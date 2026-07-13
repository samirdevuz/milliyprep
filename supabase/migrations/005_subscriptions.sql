-- Paid access lifecycle. Run after 003_payments.sql.

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('pro')),
  billing text not null check (billing in ('monthly', 'yearly')),
  status text not null check (status in ('active', 'canceled', 'expired')),
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  source_order_id uuid not null references public.payment_orders(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_period_valid check (current_period_end > current_period_start)
);

create table if not exists public.subscription_activations (
  order_id uuid primary key references public.payment_orders(id) on delete restrict,
  user_id uuid not null references public.users(id) on delete cascade,
  activated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
alter table public.subscription_activations enable row level security;
revoke all on table public.subscriptions from anon, authenticated;
revoke all on table public.subscription_activations from anon, authenticated;

create or replace function public.complete_payment_order(
  p_order_id uuid,
  p_provider_transaction_id text,
  p_provider_state integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.payment_orders%rowtype;
  v_start timestamptz;
  v_end timestamptz;
  v_inserted integer;
begin
  select * into v_order
  from public.payment_orders
  where id = p_order_id
  for update;

  if not found or v_order.user_id is null or v_order.status = 'canceled' then
    return false;
  end if;

  update public.payment_orders
  set status = 'paid',
      provider_transaction_id = coalesce(p_provider_transaction_id, provider_transaction_id),
      provider_state = p_provider_state,
      paid_at = coalesce(paid_at, now()),
      canceled_at = null
  where id = p_order_id;

  insert into public.subscription_activations (order_id, user_id)
  values (p_order_id, v_order.user_id)
  on conflict (order_id) do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted = 0 then
    return true;
  end if;

  select greatest(now(), current_period_end)
  into v_start
  from public.subscriptions
  where user_id = v_order.user_id;
  v_start := coalesce(v_start, now());
  v_end := v_start + case
    when v_order.billing = 'yearly' then interval '1 year'
    else interval '1 month'
  end;

  insert into public.subscriptions (
    user_id, plan_id, billing, status,
    current_period_start, current_period_end, source_order_id
  ) values (
    v_order.user_id, v_order.plan_id, v_order.billing, 'active',
    v_start, v_end, p_order_id
  )
  on conflict (user_id) do update set
    plan_id = excluded.plan_id,
    billing = excluded.billing,
    status = 'active',
    current_period_start = excluded.current_period_start,
    current_period_end = excluded.current_period_end,
    source_order_id = excluded.source_order_id,
    updated_at = now();

  return true;
end;
$$;

create or replace function public.cancel_payment_order(
  p_order_id uuid,
  p_provider_transaction_id text,
  p_provider_state integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.payment_orders%rowtype;
begin
  select * into v_order
  from public.payment_orders
  where id = p_order_id
  for update;

  if not found then return false; end if;

  update public.payment_orders
  set status = 'canceled',
      provider_transaction_id = coalesce(p_provider_transaction_id, provider_transaction_id),
      provider_state = p_provider_state,
      canceled_at = coalesce(canceled_at, now())
  where id = p_order_id;

  update public.subscriptions
  set status = 'canceled',
      current_period_end = greatest(current_period_start + interval '1 second', now()),
      updated_at = now()
  where source_order_id = p_order_id;

  return true;
end;
$$;

revoke all on function public.complete_payment_order(uuid, text, integer) from public;
revoke all on function public.cancel_payment_order(uuid, text, integer) from public;

