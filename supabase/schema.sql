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

grant select, insert, update, delete on public.products to anon, authenticated;
grant select, insert, update, delete on public.categories to anon, authenticated;
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

drop policy if exists products_anon_insert on public.products;
create policy products_anon_insert on public.products
  for insert to anon, authenticated
  with check (true);

drop policy if exists products_anon_update on public.products;
create policy products_anon_update on public.products
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists products_anon_delete on public.products;
create policy products_anon_delete on public.products
  for delete to anon, authenticated
  using (true);

drop policy if exists categories_anon_insert on public.categories;
create policy categories_anon_insert on public.categories
  for insert to anon, authenticated
  with check (true);

drop policy if exists categories_anon_update on public.categories;
create policy categories_anon_update on public.categories
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists categories_anon_delete on public.categories;
create policy categories_anon_delete on public.categories
  for delete to anon, authenticated
  using (true);

create extension if not exists pgcrypto with schema extensions;

create or replace function public.admin_login(p_username text, p_password text)
returns table (id bigint, username text, role text)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  found public.users%rowtype;
begin
  select * into found
  from public.users
  where users.username = p_username
    and users.active = true
  limit 1;

  if found.id is not null and found.password = extensions.crypt(p_password, found.password) then
    update public.users set last_login = now() where users.id = found.id;
    return query select found.id, found.username, found.role;
  end if;
end;
$$;

revoke all on function public.admin_login(text, text) from public;
grant execute on function public.admin_login(text, text) to anon, authenticated;
