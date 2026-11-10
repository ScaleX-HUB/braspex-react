import { supabaseEnv } from './supabaseEnv.mjs';

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

const RESPONSE_HEADERS = [
  'content-type',
  'content-disposition',
  'cache-control',
  'etag',
  'content-range',
  'content-location',
  'location',
  'preference-applied'
];

export async function proxySupabase(req, res, supabasePath) {
  const { url, anonKey, serviceKey, schema } = supabaseEnv();

  if (!url) {
    res.status(500).json({ error: 'SUPABASE_URL não configurada' });
    return;
  }

  const method = (req.method || 'GET').toUpperCase();
  const isWrite = !['GET', 'HEAD', 'OPTIONS'].includes(method);

  let pathname = supabasePath || '/';
  try {
    pathname = new URL(supabasePath, 'http://local').pathname || '/';
  } catch {
    pathname = (supabasePath || '/').split('?')[0] || '/';
  }

  const useServiceRole = Boolean(serviceKey) && isWrite && (
    pathname.startsWith('/rest/v1/') || pathname.startsWith('/storage/v1/object/')
  );

  const clientApiKey = req.headers['apikey'] || '';
  const apiKey = useServiceRole ? serviceKey : (clientApiKey || anonKey);
  const clientAuth = req.headers['authorization'] || '';
  const auth = useServiceRole
    ? `Bearer ${serviceKey}`
    : (clientAuth || (apiKey ? `Bearer ${apiKey}` : ''));

  if (!apiKey) {
    res.status(500).json({ error: 'Chave do Supabase não configurada' });
    return;
  }

  const headers = {
    'Content-Type': req.headers['content-type'] || 'application/json',
    Authorization: auth,
    apikey: apiKey,
    Prefer: req.headers['prefer'] || '',
    'Accept-Profile': schema,
    'Content-Profile': schema
  };
  Object.keys(headers).forEach((key) => {
    if (!headers[key]) delete headers[key];
  });

  let body;
  if (!['GET', 'HEAD'].includes(method)) {
    const raw = await readRawBody(req);
    if (raw && raw.length > 0) body = raw;
  }

  const targetUrl = `${url}${supabasePath}`;

  try {
    const upstream = await fetch(targetUrl, { method, headers, body });

    RESPONSE_HEADERS.forEach((header) => {
      const value = upstream.headers.get(header);
      if (value) res.setHeader(header, value);
    });

    if (upstream.status === 204) {
      res.status(204).end();
      return;
    }

    const contentType = upstream.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await upstream.json();
      res.status(upstream.status).json(data);
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.status(upstream.status).send(buffer);
  } catch (error) {
    console.error('Proxy Supabase:', error.message);
    res.status(500).json({ error: 'Proxy error', message: error.message });
  }
}
