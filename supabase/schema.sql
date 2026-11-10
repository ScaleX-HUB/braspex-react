-- Tabelas usadas pelo site e pelo painel de produtos.
-- Schema padrão do Supabase Cloud: public.

create table if not exists public.categories (
  id text primary key,
  name text unique not null,
  display_name text,
  icon text,
  logo text,
  color text,
  slug text,
  description text,
  subcategories jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  description text,
  category_id text,
  category_name text,
  subcategory_id text,
  subcategory_name text,
  image_url text,
  image_path text,
  thumbnail_url text,
  gallery jsonb not null default '[]'::jsonb,
  price numeric,
  price_label text,
  sku text,
  specifications jsonb not null default '{}'::jsonb,
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  featured boolean not null default false,
  stock_status text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id bigint generated always as identity primary key,
  username text unique not null,
  password text not null,
  role text not null default 'super_admin',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login timestamptz
);

grant usage on schema public to anon, authenticated, service_role;

grant select on public.products to anon, authenticated;
grant select on public.categories to anon, authenticated;
grant all on public.products to service_role;
grant all on public.categories to service_role;
grant all on public.users to service_role;
grant usage, select on all sequences in schema public to service_role;

alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.users enable row level security;

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select to anon, authenticated
  using (true);

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select to anon, authenticated
  using (true);
