/**
 * Storage API (Supabase Storage) via fetch.
 *
 * Motivo:
 * - O projeto usa um cliente PostgREST custom (sem @supabase/supabase-js).
 * - Em produção precisamos passar por /api/supabase-proxy para evitar Mixed Content.
 */

const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

const forceProxy = String(import.meta.env.VITE_SUPABASE_FORCE_PROXY || '').toLowerCase() === 'true';
const customProxyUrl = import.meta.env.VITE_SUPABASE_PROXY_URL || '/api/supabase-proxy';

const SUPABASE_HTTP_URL = import.meta.env.VITE_SUPABASE_URL || 'http://173.249.32.99:54321';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const useProxy = !isDevelopment || forceProxy;

const buildProxyUrl = (path) => {
  if (!useProxy) {
    return `${SUPABASE_HTTP_URL}${path}`;
  }
  const qs = new URLSearchParams({ path }).toString();
  return `${customProxyUrl}?${qs}`;
};

export const storageAPI = {
  /**
   * Faz upload de um objeto para um bucket.
   *
   * @param {string} bucket
   * @param {string} objectPath
   * @param {File|Blob} file
   * @param {{ upsert?: boolean }} options
   */
  async uploadObject(bucket, objectPath, file, options = {}) {
    if (!bucket) throw new Error('Bucket não informado');
    if (!objectPath) throw new Error('Caminho do arquivo não informado');
    if (!file) throw new Error('Arquivo não informado');

    const path = `/storage/v1/object/${bucket}/${objectPath}`;
    const url = buildProxyUrl(path);

    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: SUPABASE_ANON_KEY ? `Bearer ${SUPABASE_ANON_KEY}` : '',
      'Content-Type': file.type || 'application/octet-stream'
    };

    if (options.upsert) {
      headers['x-upsert'] = 'true';
    }

    // Remover headers vazios
    Object.keys(headers).forEach((k) => {
      if (!headers[k]) delete headers[k];
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: file
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro no upload (${response.status}): ${text}`);
    }

    // Storage pode retornar JSON (ou vazio). Tentamos JSON e fallback.
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  },

  /**
   * Gera URL pública (em produção via proxy HTTPS).
   */
  getPublicUrl(bucket, objectPath) {
    const publicPath = `/storage/v1/object/public/${bucket}/${objectPath}`;
    return buildProxyUrl(publicPath);
  }
};
