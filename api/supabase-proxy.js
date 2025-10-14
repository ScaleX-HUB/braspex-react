/**
 * Proxy API para Supabase Self-Hosted
 * 
 * Resolve o problema de Mixed Content (HTTPS → HTTP)
 * Vercel (HTTPS) → Esta função → Supabase (HTTP)
 * 
 * Rota: https://www.braspexne.com.br/api/supabase-proxy
 */

export default async function handler(req, res) {
  // URL e Schema do Supabase self-hosted (HTTP) - Pegar das variáveis de ambiente
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://173.249.32.99:54321';
  const SUPABASE_SCHEMA = process.env.VITE_SUPABASE_SCHEMA || 'braspex';
  
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
  
  // Reconstruir URL completa
  let finalPath = capturedPath ? `/${capturedPath}` : '/';
  const queryString = new URLSearchParams(queryParams).toString();
  if (queryString) {
    finalPath += `?${queryString}`;
  }
  
  const targetUrl = `${SUPABASE_URL}${finalPath}`;
  console.log('🎯 Proxy request:', req.method, targetUrl);
  console.log('📂 Schema:', SUPABASE_SCHEMA);

  // Headers PostgREST obrigatórios
  const headers = {
    'Content-Type': req.headers['content-type'] || 'application/json',
    'Authorization': req.headers['authorization'] || '',
    'apikey': req.headers['apikey'] || '',
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
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Retornar resposta com status correto
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      targetUrl: targetUrl 
    });
  }
}
