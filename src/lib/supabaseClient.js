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

// Detectar ambiente
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

// URL base - em produção usa o proxy da Vercel
const SUPABASE_BASE_URL = isDevelopment 
  ? (import.meta.env.VITE_SUPABASE_URL || 'http://173.249.32.99:54321')
  : '/api/supabase-proxy'; // Proxy da Vercel em produção

// Adicionar /rest/v1 apenas em desenvolvimento (proxy já inclui)
const SUPABASE_URL = isDevelopment ? `${SUPABASE_BASE_URL}/rest/v1` : SUPABASE_BASE_URL;

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYwMDE1NTc0LCJleHAiOjIwNzUzNzU1NzR9.zOkNw3Bh2qhDjrOYK8Gptx7Kv_ADs-9x0732M9pLYoQ';
const SUPABASE_SCHEMA = import.meta.env.VITE_SUPABASE_SCHEMA || 'braspex';

console.log('🔧 Supabase Client Config:', {
  environment: isDevelopment ? 'development' : 'production',
  baseURL: SUPABASE_URL,
  schema: SUPABASE_SCHEMA,
  usingProxy: !isDevelopment
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
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept-Profile': this.schema,
      'Content-Profile': this.schema,
    };

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

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao inserir dados em ${table}:`, error);
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

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar dados em ${table}:`, error);
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
