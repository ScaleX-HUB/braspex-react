import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { handleAdminLogin } from './server/adminAuth.mjs'
import { proxySupabase } from './server/supabaseProxy.mjs'

function adaptResponse(res) {
  return {
    setHeader(name, value) {
      res.setHeader(name, value);
    },
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(data) {
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify(data));
    },
    send(data) {
      res.end(data);
    },
    end() {
      res.end();
    }
  };
}

function braspexApi(env) {
  return {
    name: 'braspex-api',
    configureServer(server) {
      Object.assign(process.env, {
        SUPABASE_URL: env.SUPABASE_URL || env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
        SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
        SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        SUPABASE_SCHEMA: env.SUPABASE_SCHEMA || env.VITE_SUPABASE_SCHEMA || process.env.SUPABASE_SCHEMA || 'public'
      });

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost');
        if (url.pathname === '/api/admin-login') {
          req.query = Object.fromEntries(url.searchParams);
          await handleAdminLogin(req, adaptResponse(res));
          return;
        }

        if (!url.pathname.startsWith('/api/supabase-proxy')) {
          next();
          return;
        }

        req.query = Object.fromEntries(url.searchParams);
        const adapter = adaptResponse(res);
        if (req.method === 'OPTIONS') {
          adapter.status(200).end();
          return;
        }

        if (url.pathname === '/api/supabase-proxy' && url.searchParams.get('path')) {
          const extra = new URLSearchParams(url.searchParams);
          extra.delete('path');
          const qs = extra.toString();
          const target = url.searchParams.get('path') + (qs ? `?${qs}` : '');
          await proxySupabase(req, adapter, target);
          return;
        }

        const subpath = url.pathname.replace(/^\/api\/supabase-proxy\/?/, '');
        const qs = url.searchParams.toString();
        const target = `/rest/v1/${subpath}${qs ? `?${qs}` : ''}`;
        await proxySupabase(req, adapter, target);
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  plugins: [braspexApi(env), react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
})
