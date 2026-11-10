/**
 * Cliente PostgREST customizado para Supabase Self-Hosted
 * Baseado no padrão do talka-analytics
 * 
 * ⚠️ IMPORTANTE:
 * - Em produção (HTTPS), usa proxy da Vercel para evitar Mixed Content
 * - Em desenvolvimento (HTTP), conecta direto no Supabase
 * - Sempre incluir headers do schema: Accept-Profile e Content-Profile
 * - NÃO usar JOINs (fazer queries separadas)
 */

import { SUPABASE_ANON_KEY, SUPABASE_PROJECT_URL, SUPABASE_SCHEMA } from './supabasePublic';

// O projeto na nuvem é HTTPS, então o navegador fala direto com o Supabase.
// O proxy só entra se VITE_SUPABASE_USE_PROXY=true.
const useProxy = String(import.meta.env.VITE_SUPABASE_USE_PROXY || '').toLowerCase() === 'true';
const customProxyUrl = import.meta.env.VITE_SUPABASE_PROXY_URL || '/api/supabase-proxy';
const projectUrl = String(SUPABASE_PROJECT_URL || '').replace(/\/$/, '');

const SUPABASE_URL = useProxy ? customProxyUrl : (projectUrl ? `${projectUrl}/rest/v1` : '');

const isDevelopment = Boolean(import.meta.env.DEV);

console.log('🔧 Supabase Client Config:', {
  environment: isDevelopment ? 'development' : 'production',
  baseURL: SUPABASE_URL,
  schema: SUPABASE_SCHEMA,
  usingProxy: useProxy
});

class SupabaseClient {
  constructor() {
    this.baseURL = SUPABASE_URL;
    this.apiKey = SUPABASE_ANON_KEY;
    this.schema = SUPABASE_SCHEMA;
    this.isDevelopment = isDevelopment;
  }

  /**
   * Monta os headers padrão para requisições
   */
  getHeaders(isWrite = false) {
    const headers = {
      'Accept-Profile': this.schema,
      'Content-Profile': this.schema,
    };

    if (this.apiKey) {
      headers.apikey = this.apiKey;
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    if (isWrite) {
      headers['Content-Type'] = 'application/json';
      headers['Prefer'] = 'return=representation';
    }

    return headers;
  }

  /**
   * Constrói query string com filtros e ordenação
   */
  buildQueryString(filters = {}, options = {}) {
    const params = new URLSearchParams();

    // Filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, `eq.${value}`);
      }
    });

    // Select (colunas específicas)
    if (options.select) {
      params.append('select', options.select);
    }

    // Ordenação
    if (options.order) {
      params.append('order', options.order);
    }

    // Limite
    if (options.limit) {
      params.append('limit', options.limit);
    }

    // Offset
    if (options.offset) {
      params.append('offset', options.offset);
    }

    return params.toString();
  }

  /**
   * GET - Buscar dados
   */
  async get(table, filters = {}, options = {}) {
    try {
      if (!this.baseURL) {
        throw new Error('Supabase não configurado.');
      }
      const queryString = this.buildQueryString(filters, options);
      const url = `${this.baseURL}/${table}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar dados de ${table}:`, error);
      throw error;
    }
  }

  /**
   * POST - Inserir dados
   */
  async insert(table, data) {
    try {
      const url = `${this.baseURL}/${table}`;

      console.log('📤 INSERT Request:', {
        url,
        table,
        data,
        headers: this.getHeaders(true)
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });

      console.log('📥 INSERT Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ INSERT Error Response:', errorText);
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}\n\nDetalhes: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ INSERT Success:', result);
      return result;
    } catch (error) {
      console.error(`❌ Erro ao inserir dados em ${table}:`, error);
      throw error;
    }
  }

  /**
   * PATCH - Atualizar dados
   */
  async update(table, filters = {}, data) {
    try {
      const queryString = this.buildQueryString(filters);
      const url = `${this.baseURL}/${table}${queryString ? `?${queryString}` : ''}`;

      console.log('📤 UPDATE Request:', {
        url,
        table,
        filters,
        data,
        headers: this.getHeaders(true)
      });

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });

      console.log('📥 UPDATE Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ UPDATE Error Response:', errorText);
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}\n\nDetalhes: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ UPDATE Success:', result);
      return result;
    } catch (error) {
      console.error(`❌ Erro ao atualizar dados em ${table}:`, error);
      throw error;
    }
  }

  /**
   * DELETE - Deletar dados
   */
  async delete(table, filters = {}) {
    try {
      const queryString = this.buildQueryString(filters);
      const url = `${this.baseURL}/${table}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error(`Erro ao deletar dados de ${table}:`, error);
      throw error;
    }
  }

  /**
   * RPC - Chamar função do banco
   */
  async rpc(functionName, params = {}) {
    try {
      const url = `${this.baseURL}/rpc/${functionName}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao chamar RPC ${functionName}:`, error);
      throw error;
    }
  }
}

// Exportar instância única
export const supabase = new SupabaseClient();
