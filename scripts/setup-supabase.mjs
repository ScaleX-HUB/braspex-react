import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import pg from 'pg';

dns.setDefaultResultOrder('ipv4first');
import { productCategories } from '../src/data/productCategories.js';
import { hashPassword } from '../server/passwords.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const connectionString = process.env.SUPABASE_DB_URL || '';
const adminUsername = (process.env.ADMIN_USERNAME || '').trim();
const adminPassword = process.env.ADMIN_PASSWORD || '';

if (!connectionString || !adminUsername || !adminPassword) {
  console.error('Faltam SUPABASE_DB_URL, ADMIN_USERNAME ou ADMIN_PASSWORD.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

await client.connect();

try {
  const schema = readFileSync(resolve(__dirname, '../supabase/schema.sql'), 'utf8');
  await client.query(schema);

  let order = 0;
  for (const category of Object.values(productCategories)) {
    await client.query(
      `insert into public.categories
        (id, name, display_name, icon, logo, color, slug, subcategories, active, order_index, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, true, $9, now())
       on conflict (id) do update set
         name = excluded.name,
         display_name = excluded.display_name,
         logo = excluded.logo,
         color = excluded.color,
         slug = excluded.slug,
         subcategories = excluded.subcategories,
         order_index = excluded.order_index,
         updated_at = now()`,
      [
        category.id,
        category.name,
        category.displayName || category.name,
        'Package',
        category.logo || '',
        category.color || '#005563',
        category.id,
        JSON.stringify(category.subcategories || []),
        order
      ]
    );
    order += 1;
  }

  const passwordHash = hashPassword(adminPassword);
  await client.query(
    `insert into public.users (username, password, role, active)
     values ($1, $2, 'super_admin', true)
     on conflict (username) do update set
       password = excluded.password,
       role = 'super_admin',
       active = true`,
    [adminUsername, passwordHash]
  );

  const check = await client.query(
    `select
       (select count(*)::int from public.categories) as categories,
       (select count(*)::int from public.users where username = $1 and role = 'super_admin') as admins`,
    [adminUsername]
  );
  console.log('Supabase pronto:', check.rows[0]);
} finally {
  await client.end();
}
