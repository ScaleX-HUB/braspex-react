/**
 * Proxy API para Supabase Self-Hosted (Vercel Serverless Function)
 * 
 * Resolve o problema de Mixed Content (HTTPS → HTTP)
 * Vercel (HTTPS) → Esta função → Supabase (HTTP)
 * 
 * Suporta:
 *  - PostgREST (/rest/v1/...) via rewrite /api/supabase-proxy/:path+
 *  - Storage (/storage/v1/...) via /api/supabase-proxy?path=...
 *  - RPC functions
 *  - Uploads e downloads binários (PDFs, imagens)
 */

export const config = {
  api: {
    bodyParser: false,
  },
};

const readRawBody = async (req) => {
  if (req.body) {
    if (Buffer.isBuffer(req.body)) return req.body;
    if (typeof req.body === 'string') return Buffer.from(req.body);
    if (typeof req.body === 'object') return Buffer.from(JSON.stringify(req.body));
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
};

const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwMDE1NTc0LCJleHAiOjIwNzUzNzU1NzR9.zOkNw3Bh2qhDjrOYK8Gptx7Kv_ADs-9x0732M9pLYoQ';

export default async function handler(req, res) {
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
    DEFAULT_ANON_KEY;

  const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    '';
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey, Prefer, Accept-Profile, Content-Profile, x-upsert'
  );

  // Responder preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Capturar path do query param
  const { path: capturedPath, ...queryParams } = req.query || {};
  
  let finalPath = capturedPath || '/';
  const queryString = new URLSearchParams(queryParams).toString();
  if (queryString) {
    finalPath += (finalPath.includes('?') ? '&' : '?') + queryString;
  }

  let pathname = '/';
  try {
    pathname = new URL(finalPath, 'http://local').pathname || '/';
  } catch {
    pathname = (finalPath || '/').split('?')[0] || '/';
  }
  
  const targetUrl = `${SUPABASE_URL}${finalPath}`;

  const method = (req.method || 'GET').toUpperCase();
  const isWrite = !['GET', 'HEAD', 'OPTIONS'].includes(method);

  // Usar service role para escritas se a chave estiver configurada
  const allowServiceRole = Boolean(SUPABASE_SERVICE_ROLE_KEY);
  const isRestWrite = isWrite && pathname.startsWith('/rest/v1/');
  const isStorageWrite = isWrite && pathname.startsWith('/storage/v1/object/');
  const useServiceRole = allowServiceRole && (isRestWrite || isStorageWrite);

  const clientApiKey = req.headers['apikey'] || '';
  const apiKeyToUse = useServiceRole ? SUPABASE_SERVICE_ROLE_KEY : (clientApiKey || SUPABASE_ANON_KEY);

  const clientAuth = req.headers['authorization'] || '';
  const authToUse = useServiceRole
    ? `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    : (clientAuth || (apiKeyToUse ? `Bearer ${apiKeyToUse}` : ''));

  const headers = {
    'Content-Type': req.headers['content-type'] || 'application/json',
    'Authorization': authToUse,
    'apikey': apiKeyToUse,
    'Prefer': req.headers['prefer'] || '',
    'Accept-Profile': SUPABASE_SCHEMA,
    'Content-Profile': SUPABASE_SCHEMA,
  };

  // Remover headers vazios
  Object.keys(headers).forEach(key => {
    if (!headers[key]) delete headers[key];
  });

  let body = undefined;
  if (!['GET', 'HEAD'].includes(method)) {
    try {
      body = await readRawBody(req);
    } catch (readErr) {
      console.warn('⚠️ Erro ao ler body da requisição:', readErr.message);
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    // Copiar headers relevantes da resposta
    const responseHeaders = [
      'content-type',
      'content-disposition',
      'cache-control',
      'etag',
      'content-range',
      'content-location',
      'location',
      'preference-applied',
    ];

    responseHeaders.forEach(header => {
      const val = response.headers.get(header);
      if (val) {
        res.setHeader(header, val);
      }
    });

    if (response.status === 204) {
      res.status(204).end();
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
      return;
    }

    const buf = Buffer.from(await response.arrayBuffer());
    res.status(response.status).send(buf);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      targetUrl 
    });
  }
}
