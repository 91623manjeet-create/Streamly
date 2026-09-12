-- Streamly Phase 1 schema: users, creators, creator_settings, reserved usernames, RLS.

create schema if not exists private;

create table if not exists public.reserved_usernames (
  username text primary key
);

insert into public.reserved_usernames (username)
values
  ('admin'),
  ('administrator'),
  ('support'),
  ('help'),
  ('login'),
  ('signup'),
  ('sign-up'),
  ('dashboard'),
  ('settings'),
  ('api'),
  ('auth'),
  ('overlay'),
  ('tip'),
  ('tips'),
  ('creator'),
  ('creators'),
  ('stream'),
  ('streamly'),
  ('about'),
  ('contact'),
  ('privacy'),
  ('terms'),
  ('legal'),
  ('favicon'),
  ('robots'),
  ('sitemap'),
  ('demo')
on conflict (username) do nothing;

alter table public.reserved_usernames enable row level security;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  username text not null unique,
  display_name text not null,
  avatar text,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint creators_username_format_chk
    check (username ~ '^[a-z0-9][a-z0-9_-]{2,29}$')
);

create table if not exists public.creator_settings (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null unique references public.creators (id) on delete cascade,
  currency text not null default 'INR',
  min_tip_amount numeric(12, 2) not null default 10,
  overlay_enabled boolean not null default true,
  alert_enabled boolean not null default true,
  alert_duration integer not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint creator_settings_currency_chk check (currency = 'INR'),
  constraint creator_settings_min_tip_chk check (min_tip_amount >= 1),
  constraint creator_settings_alert_duration_chk
    check (alert_duration > 0 and alert_duration <= 60)
);

create index if not exists creators_user_id_idx on public.creators (user_id);
create index if not exists creator_settings_creator_id_idx on public.creator_settings (creator_id);
create index if not exists creators_is_active_idx on public.creators (is_active);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.normalize_creator_username()
returns trigger
language plpgsql
as $$
begin
  new.username := lower(trim(new.username));

  if exists (
    select 1 from public.reserved_usernames r where r.username = new.username
  ) then
    raise exception 'username is reserved' using errcode = '23514';
  end if;

  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace function private.enforce_creator_owner()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.user_id := auth.uid();
  else
    new.user_id := old.user_id;
    new.id := old.id;
  end if;

  if new.user_id is null or new.user_id is distinct from auth.uid() then
    raise exception 'not allowed';
  end if;

  return new;
end;
$$;

create or replace function private.seed_creator_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.creator_settings (creator_id)
  values (new.id)
  on conflict (creator_id) do nothing;
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row execute function private.set_updated_at();

drop trigger if exists creators_set_updated_at on public.creators;
create trigger creators_set_updated_at
before update on public.creators
for each row execute function private.set_updated_at();

drop trigger if exists creator_settings_set_updated_at on public.creator_settings;
create trigger creator_settings_set_updated_at
before update on public.creator_settings
for each row execute function private.set_updated_at();

drop trigger if exists creators_normalize_username on public.creators;
create trigger creators_normalize_username
before insert or update of username on public.creators
for each row execute function private.normalize_creator_username();

drop trigger if exists creators_enforce_owner on public.creators;
create trigger creators_enforce_owner
before insert or update on public.creators
for each row execute function private.enforce_creator_owner();

drop trigger if exists creators_create_settings on public.creators;
create trigger creators_create_settings
after insert on public.creators
for each row execute function private.seed_creator_settings();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.users enable row level security;
alter table public.creators enable row level security;
alter table public.creator_settings enable row level security;

revoke all on table public.users from anon, authenticated;
revoke all on table public.creators from anon, authenticated;
revoke all on table public.creator_settings from anon, authenticated;
revoke all on table public.reserved_usernames from anon, authenticated;

grant select on table public.users to authenticated;
grant update (email) on table public.users to authenticated;

grant select (
  id,
  username,
  display_name,
  avatar,
  bio,
  is_active
) on table public.creators to anon;

grant select (
  id,
  user_id,
  username,
  display_name,
  avatar,
  bio,
  is_active,
  created_at,
  updated_at
) on table public.creators to authenticated;

grant insert (
  username,
  display_name,
  avatar,
  bio
) on table public.creators to authenticated;

grant update (
  username,
  display_name,
  avatar,
  bio,
  is_active
) on table public.creators to authenticated;

grant select on table public.creator_settings to authenticated;
grant update (
  currency,
  min_tip_amount,
  overlay_enabled,
  alert_enabled,
  alert_duration
) on table public.creator_settings to authenticated;
grant insert (
  creator_id,
  currency,
  min_tip_amount,
  overlay_enabled,
  alert_enabled,
  alert_duration
) on table public.creator_settings to authenticated;

drop policy if exists users_select_own on public.users;
create policy users_select_own
on public.users
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists users_update_own on public.users;
create policy users_update_own
on public.users
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists creators_public_select on public.creators;
create policy creators_public_select
on public.creators
for select
to anon, authenticated
using (true);

drop policy if exists creators_insert_own on public.creators;
create policy creators_insert_own
on public.creators
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists creators_update_own on public.creators;
create policy creators_update_own
on public.creators
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists creator_settings_owner_select on public.creator_settings;
create policy creator_settings_owner_select
on public.creator_settings
for select
to authenticated
using (
  creator_id in (
    select c.id
    from public.creators c
    where c.user_id = (select auth.uid())
  )
);

drop policy if exists creator_settings_owner_insert on public.creator_settings;
create policy creator_settings_owner_insert
on public.creator_settings
for insert
to authenticated
with check (
  creator_id in (
    select c.id
    from public.creators c
    where c.user_id = (select auth.uid())
  )
);

drop policy if exists creator_settings_owner_update on public.creator_settings;
create policy creator_settings_owner_update
on public.creator_settings
for update
to authenticated
using (
  creator_id in (
    select c.id
    from public.creators c
    where c.user_id = (select auth.uid())
  )
)
with check (
  creator_id in (
    select c.id
    from public.creators c
    where c.user_id = (select auth.uid())
  )
);
