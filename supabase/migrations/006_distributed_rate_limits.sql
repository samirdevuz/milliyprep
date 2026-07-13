-- Distributed, atomic rate-limit buckets shared by every application instance.
-- Application keys are SHA-256 hashes, so contacts and IP addresses are not
-- stored directly in this table.

create table if not exists public.rate_limit_buckets (
  bucket_key text primary key,
  request_count integer not null check (request_count > 0),
  window_started_at timestamptz not null,
  expires_at timestamptz not null,
  constraint rate_limit_window_valid check (expires_at > window_started_at)
);

create index if not exists rate_limit_buckets_expires_at_idx
  on public.rate_limit_buckets (expires_at);

alter table public.rate_limit_buckets enable row level security;
revoke all on table public.rate_limit_buckets from anon, authenticated;

create or replace function public.consume_rate_limit(
  p_bucket_key text,
  p_limit integer,
  p_window_ms integer
)
returns table (allowed boolean, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_count integer;
  v_expires timestamptz;
begin
  if p_bucket_key is null or length(p_bucket_key) <> 64 then
    raise exception 'Invalid rate-limit bucket key';
  end if;
  if p_limit < 1 or p_window_ms < 1000 or p_window_ms > 86400000 then
    raise exception 'Invalid rate-limit configuration';
  end if;

  insert into public.rate_limit_buckets (
    bucket_key,
    request_count,
    window_started_at,
    expires_at
  ) values (
    p_bucket_key,
    1,
    v_now,
    v_now + (p_window_ms * interval '1 millisecond')
  )
  on conflict (bucket_key) do update set
    request_count = case
      when rate_limit_buckets.expires_at <= v_now then 1
      else rate_limit_buckets.request_count + 1
    end,
    window_started_at = case
      when rate_limit_buckets.expires_at <= v_now then v_now
      else rate_limit_buckets.window_started_at
    end,
    expires_at = case
      when rate_limit_buckets.expires_at <= v_now
        then v_now + (p_window_ms * interval '1 millisecond')
      else rate_limit_buckets.expires_at
    end
  returning request_count, expires_at into v_count, v_expires;

  allowed := v_count <= p_limit;
  retry_after := case
    when allowed then 0
    else greatest(1, ceil(extract(epoch from (v_expires - v_now)))::integer)
  end;
  return next;
end;
$$;

create or replace function public.prune_rate_limit_buckets()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from public.rate_limit_buckets
  where expires_at < clock_timestamp() - interval '1 day';
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public;
revoke all on function public.prune_rate_limit_buckets() from public;

