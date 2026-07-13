create table if not exists public.payment_orders (
  id uuid primary key,
  user_id uuid references public.users(id) on delete set null,
  plan_id text not null check (plan_id in ('pro')),
  billing text not null check (billing in ('monthly', 'yearly')),
  provider text not null check (provider in ('click', 'payme')),
  amount_tiyin integer not null check (amount_tiyin >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'canceled')),
  provider_transaction_id text,
  provider_state integer,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  canceled_at timestamptz
);

create index if not exists payment_orders_user_id_idx
  on public.payment_orders(user_id);

create index if not exists payment_orders_provider_transaction_idx
  on public.payment_orders(provider, provider_transaction_id)
  where provider_transaction_id is not null;

alter table public.payment_orders enable row level security;

drop policy if exists "Users can read their own payment orders" on public.payment_orders;
create policy "Users can read their own payment orders"
  on public.payment_orders
  for select
  using (auth.uid() = user_id);
