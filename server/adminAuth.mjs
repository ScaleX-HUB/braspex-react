import { supabaseEnv } from './supabaseEnv.mjs';
import { verifyPassword } from './passwords.mjs';

const readJsonBody = async (req) => {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (typeof req.body === 'string') {
    return req.body ? JSON.parse(req.body) : {};
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

export async function handleAdminLogin(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Método não permitido' });
    return;
  }

  const { url, serviceKey, schema } = supabaseEnv();
  if (!url || !serviceKey) {
    res.status(500).json({
      success: false,
      message: 'Supabase do admin não está configurado no servidor.'
    });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    res.status(400).json({ success: false, message: 'Pedido inválido' });
    return;
  }

  const username = String(body.username || '').trim();
  const password = String(body.password || '');
  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Informe usuário e senha.' });
    return;
  }

  const query = new URLSearchParams({
    select: 'id,username,password,role,active',
    username: `eq.${username}`,
    active: 'eq.true'
  });

  try {
    const response = await fetch(`${url}/rest/v1/users?${query.toString()}`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Accept-Profile': schema,
        'Content-Profile': schema
      }
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Falha ao consultar usuários:', response.status, detail);
      res.status(502).json({ success: false, message: 'Não foi possível validar o acesso.' });
      return;
    }

    const rows = await response.json();
    const user = Array.isArray(rows) ? rows[0] : null;
    if (!user || !verifyPassword(password, user.password)) {
      res.status(401).json({ success: false, message: 'Credenciais inválidas. Por favor, tente novamente.' });
      return;
    }

    await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(user.id)}`, {
      method: 'PATCH',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Accept-Profile': schema,
        'Content-Profile': schema,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ last_login: new Date().toISOString() })
    });

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login admin:', error.message);
    res.status(502).json({ success: false, message: 'Não foi possível entrar. Verifique a conexão com o Supabase.' });
  }
}
