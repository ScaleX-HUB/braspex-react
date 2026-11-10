// Chave anon/public do Supabase. Ela é feita para ir no navegador.
// A service role continua só no servidor.
export const SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_URL || 'https://npodobjsewuwuxwxtapj.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wb2RvYmpzZXd1d3V4d3h0YXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyOTI0ODQsImV4cCI6MjEwOTg2ODQ4NH0.WB6LxUuGEkAbPWdKy9JSOODH1BRExJBTArCtalaPLOo';
export const SUPABASE_SCHEMA = import.meta.env.VITE_SUPABASE_SCHEMA || 'public';
