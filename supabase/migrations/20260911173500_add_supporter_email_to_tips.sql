-- Add supporter_email column to tips table for sending receipts
alter table public.tips add column if not exists supporter_email text;
