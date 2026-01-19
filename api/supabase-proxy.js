/**
 * Proxy API para Supabase Self-Hosted
 * 
 * Resolve o problema de Mixed Content (HTTPS → HTTP)
 * Vercel (HTTPS) → Esta função → Supabase (HTTP)
 * 
 * Rota: https://www.braspexne.com.br/api/supabase-proxy
 */

export default async function handler(req, res) {
  // Preferir variáveis server-side na Vercel (SUPABASE_*), mantendo fallback para VITE_*.
  // Observação: VITE_* é pensado para o frontend (build-time) e não é ideal para functions.
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
  
  // CORS headers essenciais
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey, Prefer, Accept-Profile, Content-Profile'
  );

  // Responder OPTIONS para preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // CRÍTICO: Capturar path do query param (vem do vercel.json)
  const { path: capturedPath, ...queryParams } = req.query || {};
  
  // Reconstruir URL completa (path já vem com barra inicial do vercel.json)
  let finalPath = capturedPath || '/';
  const queryString = new URLSearchParams(queryParams).toString();
  if (queryString) {
    finalPath += `?${queryString}`;
  }
  
  const targetUrl = `${SUPABASE_URL}${finalPath}`;
  console.log('🎯 Proxy request:', req.method, targetUrl);
  console.log('📂 Schema:', SUPABASE_SCHEMA);

  // Headers PostgREST obrigatórios
  // IMPORTANTE: em produção, não dependa do client enviar apikey/Authorization.
  // Se não vierem, injeta anon key configurada na Vercel.
  const clientApiKey = req.headers['apikey'] || '';
  const apiKeyToUse = clientApiKey || SUPABASE_ANON_KEY;

  const clientAuth = req.headers['authorization'] || '';
  const authToUse = clientAuth || (apiKeyToUse ? `Bearer ${apiKeyToUse}` : '');

  const headers = {
    'Content-Type': req.headers['content-type'] || 'application/json',
    'Authorization': authToUse,
    'apikey': apiKeyToUse,
    'Prefer': req.headers['prefer'] || '',
    // FORÇAR schema do .env (não confiar no cliente)
    'Accept-Profile': SUPABASE_SCHEMA,
    'Content-Profile': SUPABASE_SCHEMA,
  };

  // Remover headers vazios
  Object.keys(headers).forEach(key => {
    if (!headers[key]) delete headers[key];
  });

  // Preparar body para POST/PATCH
  let body = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    // Fazer requisição para Supabase HTTP
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
    });

    console.log('📡 Response status:', response.status);

    // Copiar headers importantes da resposta
    const responseHeaders = {
      'content-type': response.headers.get('content-type'),
      'content-range': response.headers.get('content-range'),
      'content-location': response.headers.get('content-location'),
      'location': response.headers.get('location'),
      'preference-applied': response.headers.get('preference-applied'),
    };

    // Adicionar headers à resposta
    Object.keys(responseHeaders).forEach(key => {
      if (responseHeaders[key]) {
        res.setHeader(key, responseHeaders[key]);
      }
    });

    // Processar resposta
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

    const text = await response.text();
    res.status(response.status).send(text);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      targetUrl: targetUrl 
    });
  }
}
