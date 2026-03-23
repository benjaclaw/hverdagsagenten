-- Hverdagsagenten: Initial database schema
-- Run this in your Supabase SQL editor
--
-- IMPORTANT: If you get "column finn_results.created_at does not exist",
-- re-run this migration. All tables require created_at columns.

-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- ============================================
-- Finn.no search monitoring
-- ============================================

create table if not exists finn_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table finn_searches enable row level security;

create policy "Users can view own finn_searches"
  on finn_searches for select
  using (auth.uid() = user_id);

create policy "Users can insert own finn_searches"
  on finn_searches for insert
  with check (auth.uid() = user_id);

create policy "Users can update own finn_searches"
  on finn_searches for update
  using (auth.uid() = user_id);

create policy "Users can delete own finn_searches"
  on finn_searches for delete
  using (auth.uid() = user_id);

create table if not exists finn_results (
  id uuid primary key default gen_random_uuid(),
  search_id uuid not null references finn_searches(id) on delete cascade,
  finn_id text not null,
  title text not null,
  price text,
  url text not null,
  image_url text,
  created_at timestamptz not null default now(),
  unique(search_id, finn_id)
);

alter table finn_results enable row level security;

create policy "Users can view own finn_results"
  on finn_results for select
  using (
    exists (
      select 1 from finn_searches
      where finn_searches.id = finn_results.search_id
      and finn_searches.user_id = auth.uid()
    )
  );

-- ============================================
-- Price monitoring (Kassal.app)
-- ============================================

create table if not exists price_watches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  search_term text not null,
  max_price numeric,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table price_watches enable row level security;

create policy "Users can view own price_watches"
  on price_watches for select
  using (auth.uid() = user_id);

create policy "Users can insert own price_watches"
  on price_watches for insert
  with check (auth.uid() = user_id);

create policy "Users can update own price_watches"
  on price_watches for update
  using (auth.uid() = user_id);

create policy "Users can delete own price_watches"
  on price_watches for delete
  using (auth.uid() = user_id);

create table if not exists price_alerts (
  id uuid primary key default gen_random_uuid(),
  watch_id uuid not null references price_watches(id) on delete cascade,
  product_name text not null,
  store text,
  price numeric not null,
  url text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table price_alerts enable row level security;

create policy "Users can view own price_alerts"
  on price_alerts for select
  using (
    exists (
      select 1 from price_watches
      where price_watches.id = price_alerts.watch_id
      and price_watches.user_id = auth.uid()
    )
  );

-- ============================================
-- Push notification tokens
-- ============================================

create table if not exists push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null,
  created_at timestamptz not null default now(),
  unique(user_id, token)
);

alter table push_tokens enable row level security;

create policy "Users can view own push_tokens"
  on push_tokens for select
  using (auth.uid() = user_id);

create policy "Users can insert own push_tokens"
  on push_tokens for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own push_tokens"
  on push_tokens for delete
  using (auth.uid() = user_id);
