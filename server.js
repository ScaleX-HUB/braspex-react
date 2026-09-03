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

// ─── Supabase proxy config ─────────────────────────────────────────────────────
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'http://173.249.32.99:54321';

const SUPABASE_SCHEMA =
  process.env.SUPABASE_SCHEMA ||
  process.env.VITE_SUPABASE_SCHEMA ||
  'braspex';

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  '';

const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD',
  'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey, Prefer, Accept-Profile, Content-Profile, x-upsert',
};

const PROXY_RESPONSE_HEADERS = [
  'content-type', 'content-disposition', 'cache-control',
  'etag', 'content-range', 'content-location', 'location', 'preference-applied',
];

// Read raw request body (needed for binary uploads)
async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// Core proxy logic ─────────────────────────────────────────────────────────────
async function supabaseProxy(req, res, supabasePath) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') return res.status(200).end();

  // If supabasePath includes a query string, split it out
  const [pathOnly, pathQs] = supabasePath.split('?');

  // Merge path-level query string with request query params
  // (exclude the internal "path" key forwarded from Vercel-style rewrites)
  const { path: _ignored, ...extraQuery } = req.query || {};
  const merged = new URLSearchParams(pathQs || '');
  Object.entries(extraQuery).forEach(([k, v]) => merged.set(k, v));
  const qs = merged.toString();

  const finalPath = pathOnly + (qs ? `?${qs}` : '');
  const targetUrl = `${SUPABASE_URL}${finalPath}`;

  let pathname = pathOnly;
  try { pathname = new URL(finalPath, 'http://local').pathname; } catch { /* noop */ }

  const method = (req.method || 'GET').toUpperCase();
  const isWrite = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  const allowServiceRole = Boolean(SUPABASE_SERVICE_ROLE_KEY);
  const isCatalogsWrite = isWrite && pathname.startsWith('/rest/v1/catalogs');
  const isCatalogsStorage = isWrite &&
    (pathname.startsWith('/storage/v1/object/catalogs/') || pathname === '/storage/v1/object/catalogs');
  const useServiceRole = allowServiceRole && (isCatalogsWrite || isCatalogsStorage);

  const clientApiKey = req.headers['apikey'] || '';
  const apiKey = useServiceRole ? SUPABASE_SERVICE_ROLE_KEY : (clientApiKey || SUPABASE_ANON_KEY);
  const clientAuth = req.headers['authorization'] || '';
  const auth = useServiceRole
    ? `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    : (clientAuth || (apiKey ? `Bearer ${apiKey}` : ''));

  const headers = {
    'Content-Type': req.headers['content-type'] || 'application/json',
    'Authorization': auth,
    'apikey': apiKey,
    'Prefer': req.headers['prefer'] || '',
    'Accept-Profile': SUPABASE_SCHEMA,
    'Content-Profile': SUPABASE_SCHEMA,
  };
  Object.keys(headers).forEach(k => { if (!headers[k]) delete headers[k]; });

  let body;
  if (!['GET', 'HEAD'].includes(method)) {
    const raw = await readRawBody(req);
    if (raw.length > 0) body = raw;
  }

  console.log(`[proxy] ${method} ${targetUrl}`);

  try {
    const upstream = await fetch(targetUrl, { method, headers, body });

    PROXY_RESPONSE_HEADERS.forEach(h => {
      const v = upstream.headers.get(h);
      if (v) res.setHeader(h, v);
    });

    if (upstream.status === 204) return res.status(204).end();

    const ct = upstream.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    return res.status(upstream.status).send(buf);
  } catch (err) {
    console.error('[proxy] error:', err.message);
    return res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}

// ─── Proxy routes ──────────────────────────────────────────────────────────────

// Pattern 1: /api/supabase-proxy/some/path?queryparams
// → Replicates Vercel rewrite: adds /rest/v1/ prefix (same as vercel.json)
app.all('/api/supabase-proxy/*path', (req, res) => {
  const subpath = req.params.path || '';
  const { path: _ignored, ...extra } = req.query || {};
  const qs = new URLSearchParams(extra).toString();
  const supabasePath = `/rest/v1/${subpath}${qs ? `?${qs}` : ''}`;
  return supabaseProxy(req, res, supabasePath);
});

// Pattern 2: /api/supabase-proxy?path=/storage/v1/...  (direct with path query param)
app.all('/api/supabase-proxy', (req, res) => {
  const { path: supabasePath, ...extra } = req.query || {};
  const qs = new URLSearchParams(extra).toString();
  const fullPath = (supabasePath || '/') + (qs ? `?${qs}` : '');
  return supabaseProxy(req, res, fullPath);
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
