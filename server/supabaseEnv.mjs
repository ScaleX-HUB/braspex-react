export function supabaseEnv() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
  const schema = process.env.SUPABASE_SCHEMA || process.env.VITE_SUPABASE_SCHEMA || 'public';

  return { url, anonKey, serviceKey, schema };
}
