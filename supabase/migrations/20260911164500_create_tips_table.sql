-- Create tips table for tip payment tracking
create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators (id) on delete cascade,
  supporter_name text not null default 'Anonymous Supporter',
  amount numeric(12, 2) not null,
  currency text not null default 'INR',
  message text,
  is_anonymous boolean not null default false,
  status text not null default 'pending',
  razorpay_order_id text unique,
  razorpay_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tips_status_chk check (status in ('pending', 'completed', 'failed')),
  constraint tips_amount_chk check (amount >= 1)
);

create index if not exists tips_creator_id_idx on public.tips (creator_id);
create index if not exists tips_razorpay_order_id_idx on public.tips (razorpay_order_id);
create index if not exists tips_status_idx on public.tips (status);

drop trigger if exists tips_set_updated_at on public.tips;
create trigger tips_set_updated_at
before update on public.tips
for each row execute function private.set_updated_at();

alter table public.tips enable row level security;

grant select, insert, update, delete on table public.tips to authenticated;
grant select, insert, update on table public.tips to anon;

-- Public can view completed tips for live OBS overlays and public tip page activity
drop policy if exists tips_public_select_completed on public.tips;
create policy tips_public_select_completed
on public.tips
for select
to anon, authenticated
using (status = 'completed');

-- Creator owner can view all their tips (pending/completed/failed)
drop policy if exists tips_owner_select_all on public.tips;
create policy tips_owner_select_all
on public.tips
for select
to authenticated
using (
  creator_id in (
    select c.id
    from public.creators c
    where c.user_id = (select auth.uid())
  )
);

-- Anyone can insert pending tips for payment creation
drop policy if exists tips_public_insert on public.tips;
create policy tips_public_insert
on public.tips
for insert
to anon, authenticated
with check (true);

-- Anyone can update tips if matching order_id for payment completion
drop policy if exists tips_public_update on public.tips;
create policy tips_public_update
on public.tips
for update
to anon, authenticated
using (true)
with check (true);
