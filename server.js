/**
 * Braspex – Production server for Dokku
 *
 * Responsibilities:
 *  1. Replicates the Vercel supabase-proxy (Mixed-Content HTTPS→HTTP bridge)
 *  2. Serves the Vite static build from ./dist
 *  3. SPA fallback: all unknown routes → dist/index.html
 */

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { proxySupabase } from './server/supabaseProxy.mjs';
import { handleAdminLogin } from './server/adminAuth.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security headers ──────────────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD',
  'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey, Prefer, Accept-Profile, Content-Profile, x-upsert',
};

function withCors(req, res, handler) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => res.setHeader(key, value));
  if (req.method === 'OPTIONS') return res.status(200).end();
  return handler();
}

app.all('/api/admin-login', (req, res) => handleAdminLogin(req, res));

app.all('/api/supabase-proxy/*path', (req, res) => {
  const subpath = req.params.path || '';
  const { path: _ignored, ...extra } = req.query || {};
  const qs = new URLSearchParams(extra).toString();
  const supabasePath = `/rest/v1/${subpath}${qs ? `?${qs}` : ''}`;
  return withCors(req, res, () => proxySupabase(req, res, supabasePath));
});

app.all('/api/supabase-proxy', (req, res) => {
  const { path: supabasePath, ...extra } = req.query || {};
  const qs = new URLSearchParams(extra).toString();
  const fullPath = (supabasePath || '/') + (qs ? `?${qs}` : '');
  return withCors(req, res, () => proxySupabase(req, res, fullPath));
});

// ─── Static files ──────────────────────────────────────────────────────────────

// Hashed assets → long-lived cache
app.use(
  '/assets',
  express.static(path.join(__dirname, 'dist', 'assets'), {
    maxAge: '1y',
    immutable: true,
  }),
);

// Other static files (favicon, robots.txt, sitemap.xml …) → no cache
app.use(
  express.static(path.join(__dirname, 'dist'), {
    index: 'index.html',
    maxAge: '0',
  }),
);

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/*path', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Braspex server listening on port ${PORT}`);
});
