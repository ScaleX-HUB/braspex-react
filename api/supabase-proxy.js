import { proxySupabase } from '../server/supabaseProxy.mjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey, Prefer, Accept-Profile, Content-Profile, x-upsert'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { path: capturedPath, ...queryParams } = req.query || {};
  let finalPath = capturedPath || '/';
  const queryString = new URLSearchParams(queryParams).toString();
  if (queryString) {
    finalPath += (finalPath.includes('?') ? '&' : '?') + queryString;
  }

  return proxySupabase(req, res, finalPath);
}
