-- MilliyPrep production foundation schema.
-- Run this in Supabase SQL Editor or with the Supabase CLI.

create extension if not exists citext;

create table if not exists public.users (
  id uuid primary key,
  name text not null,
  email citext,
  phone text,
  password_hash text not null default '',
  provider text not null check (provider in ('email', 'phone', 'telegram', 'google')),
  external_id text,
  email_verified boolean not null default false,
  phone_verified boolean not null default false,
  onboarding jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_email_or_phone_or_external check (
    email is not null or phone is not null or external_id is not null
  )
);

create unique index if not exists users_email_unique
  on public.users (email)
  where email is not null;

create unique index if not exists users_phone_unique
  on public.users (phone)
  where phone is not null;

create unique index if not exists users_provider_external_unique
  on public.users (provider, external_id)
  where external_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create table if not exists public.verifications (
  id uuid primary key,
  channel text not null check (channel in ('email', 'phone', 'telegram')),
  contact text not null,
  contact_key text not null,
  code text not null check (code ~ '^[0-9]{6}$'),
  telegram_id bigint,
  telegram_username text,
  verified boolean not null default false,
  attempts integer not null default 0 check (attempts >= 0),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create unique index if not exists verifications_channel_contact_unique
  on public.verifications (channel, contact_key);

create index if not exists verifications_code_idx
  on public.verifications (code);

create index if not exists verifications_expires_at_idx
  on public.verifications (expires_at);

alter table public.users enable row level security;
alter table public.verifications enable row level security;

revoke all on table public.users from anon, authenticated;
revoke all on table public.verifications from anon, authenticated;
