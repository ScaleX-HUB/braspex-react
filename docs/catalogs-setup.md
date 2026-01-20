# Catálogos (setup no Supabase)

Este projeto espera:

1) Uma tabela `catalogs` no Postgres/Supabase
2) Um bucket de storage `catalogs` (público) para PDFs e capas

## 1) Tabela `catalogs`

IMPORTANTE: o app usa `Accept-Profile`/`Content-Profile` baseado em `VITE_SUPABASE_SCHEMA` (padrão: `braspex`).

Se você criar a tabela em `public` mas o schema configurado for `braspex`, o PostgREST vai responder **404 Not Found** para `/rest/v1/catalogs`.

Então crie a tabela no schema configurado (ex.: `braspex`).

SQL sugerido (schema `braspex`):

```sql
create schema if not exists braspex;

create table if not exists braspex.catalogs (
  id uuid primary key,
  title text not null,
  pdf_url text,
  pdf_path text,
  cover_url text,
  cover_path text,
  active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists catalogs_order_idx on braspex.catalogs (order_index);
create index if not exists catalogs_active_idx on braspex.catalogs (active);
```

> Observação: se você usa RLS/Policies, garanta que o site consiga dar `SELECT` e o admin consiga `INSERT/UPDATE/DELETE` conforme sua estratégia de segurança.

### Permissões (GRANT) e RLS (para o CRUD funcionar)

Se você está vendo erro **401** com `permission denied for table catalogs` ao fazer `POST /rest/v1/catalogs`, isso normalmente significa que faltam **GRANTs** no Postgres (não é só policy).

Use o SQL abaixo (schema `braspex`):

```sql
-- Permite que as roles do Supabase (PostgREST) enxerguem o schema
grant usage on schema braspex to anon, authenticated;

-- Permite operações na tabela
grant select, insert, update, delete on table braspex.catalogs to anon, authenticated;

-- (Opcional) se você usa sequences em outras tabelas, também precisaria:
-- grant usage, select on all sequences in schema braspex to anon, authenticated;
```

Se a tabela estiver com RLS habilitado, também precisa de policies (senão vai bloquear). Exemplo **bem aberto** (não recomendado para produção sem autenticação):

```sql
alter table braspex.catalogs enable row level security;

drop policy if exists "Public read catalogs" on braspex.catalogs;
create policy "Public read catalogs" on braspex.catalogs
for select
using (true);

drop policy if exists "Anon write catalogs" on braspex.catalogs;
create policy "Anon write catalogs" on braspex.catalogs
for all
using (true)
with check (true);
```

Se você preferir não usar RLS nessa tabela, pode desabilitar:

```sql
alter table braspex.catalogs disable row level security;
```

### Alternativa (sem SQL): service role no proxy (destravar admin)

Se você não consegue rodar SQL no Studio agora, dá pra destravar o CRUD de catálogos usando a chave **service role** somente no servidor (Vercel Function).

1) Configure na Vercel (Environment Variables):

- `SUPABASE_URL` (ex.: `http://173.249.32.99:54321`)
- `SUPABASE_SCHEMA` (ex.: `braspex`)
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (ou `SUPABASE_SERVICE_KEY`)

2) O proxy foi ajustado para usar service role **apenas** em escrita para:

- `/rest/v1/catalogs` (POST/PATCH/DELETE)
- `/storage/v1/object/catalogs/...` (upload no bucket `catalogs`)

Assim o site continua lendo com anon, mas o admin consegue escrever mesmo com GRANT/RLS bloqueando o anon.

> Segurança: service role ignora RLS. Use com cuidado.

#### Diagnóstico rápido (quando continuar dando 401)

Rode estes checks no SQL Editor para confirmar se você aplicou no schema/tabela certos:

```sql
-- 1) Roles existem?
select rolname from pg_roles where rolname in ('anon', 'authenticated');

-- 2) A tabela está no schema correto?
select table_schema, table_name
from information_schema.tables
where table_name = 'catalogs'
order by table_schema;

-- 3) Quais grants a role anon tem na tabela?
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'braspex'
  and table_name = 'catalogs'
  and grantee in ('anon','authenticated')
order by grantee, privilege_type;

-- 4) RLS está ligado?
select n.nspname as schema, c.relname as table, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'braspex'
  and c.relname = 'catalogs';
```

## 2) Bucket `catalogs`

- Crie um bucket chamado `catalogs`
- Marque como **Public** (para que o site consiga abrir o PDF)
- Estrutura usada pelo app:
  - `covers/` (capas)
  - `pdf/` (arquivos PDF)

## 3) Proxy e Mixed Content

Em produção, as URLs públicas de capa/PDF são geradas via proxy HTTPS:

- `/api/supabase-proxy?path=/storage/v1/object/public/catalogs/...`

Isso evita Mixed Content quando o Supabase é HTTP.

## 4) Policies de Storage (para upload funcionar)

Se o Supabase Storage estiver com RLS ativo (padrão), o upload com anon key pode falhar com 401/403.

Para permitir upload (anon) somente no bucket `catalogs`, você pode criar policies assim:

```sql
-- Leitura pública do bucket catalogs
drop policy if exists "Public read catalogs" on storage.objects;
create policy "Public read catalogs" on storage.objects
for select
using (bucket_id = 'catalogs');

-- Upload/alteração/exclusão via anon (atenção: isso libera o upload sem autenticação)
drop policy if exists "Anon upload catalogs" on storage.objects;
create policy "Anon upload catalogs" on storage.objects
for insert
with check (bucket_id = 'catalogs');

drop policy if exists "Anon update catalogs" on storage.objects;
create policy "Anon update catalogs" on storage.objects
for update
using (bucket_id = 'catalogs')
with check (bucket_id = 'catalogs');

drop policy if exists "Anon delete catalogs" on storage.objects;
create policy "Anon delete catalogs" on storage.objects
for delete
using (bucket_id = 'catalogs');
```

Se você preferir algo mais seguro (upload só via admin), dá pra ajustar o proxy para usar uma `SERVICE_ROLE_KEY` no servidor e NÃO liberar insert para anon.
