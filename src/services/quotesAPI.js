import supabase from '../lib/supabaseClient';

/**
 * API para gerenciar COTAÇÕES no Supabase
 * Tabela: quotes
 * Campos: id, customer (JSONB), items (JSONB), source, status, created_at, updated_at
 */

export const quotesAPI = {
  /**
   * Buscar todas as cotações
   */
  getAll: async () => {
    try {
      const { data, error } = await supabase.get('quotes');
      
      if (error) {
        console.error('❌ Erro ao buscar cotações:', error);
        return [];
      }

      const quotes = (data || []).map(quote => ({
        id: quote.id,
        customer: quote.customer,
        items: quote.items,
        source: quote.source,
        status: quote.status,
        createdAt: quote.created_at,
        updatedAt: quote.updated_at
      }));

      console.log('✅ Cotações carregadas do Supabase:', quotes.length);
      return quotes;
    } catch (error) {
      console.error('❌ Erro ao buscar cotações:', error);
      return [];
    }
  },

  /**
   * Criar nova cotação
   */
  create: async (quoteData) => {
    try {
      const data = {
        customer: quoteData.customer,
        items: quoteData.items || [],
        source: quoteData.source || 'cart',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: result, error } = await supabase.insert('quotes', data);

      if (error) {
        console.error('❌ Erro ao criar cotação:', error);
        return null;
      }

      console.log('✅ Cotação criada no Supabase:', result);
      
      // Disparar evento para notificar outros componentes
      window.dispatchEvent(new CustomEvent('quoteReceived', { detail: result }));
      
      return result;
    } catch (error) {
      console.error('❌ Erro ao criar cotação:', error);
      return null;
    }
  },

  /**
   * Atualizar status da cotação
   */
  updateStatus: async (quoteId, status) => {
    try {
      const data = {
        status: status,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.update('quotes', quoteId, data);

      if (error) {
        console.error('❌ Erro ao atualizar status da cotação:', error);
        return false;
      }

      console.log('✅ Status da cotação atualizado no Supabase');
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar status da cotação:', error);
      return false;
    }
  },

  /**
   * Deletar cotação
   */
  delete: async (quoteId) => {
    try {
      const { error } = await supabase.delete('quotes', { id: quoteId });

      if (error) {
        console.error('❌ Erro ao deletar cotação:', error);
        return false;
      }

      console.log('✅ Cotação deletada do Supabase');
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar cotação:', error);
      return false;
    }
  },

  /**
   * Estatísticas de cotações
   */
  getStats: async () => {
    try {
      const quotes = await quotesAPI.getAll();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      
      return {
        total: quotes.length,
        pending: quotes.filter(q => q.status === 'pending').length,
        contacted: quotes.filter(q => q.status === 'contacted').length,
        converted: quotes.filter(q => q.status === 'converted').length,
        cancelled: quotes.filter(q => q.status === 'cancelled').length,
        today: quotes.filter(q => new Date(q.createdAt) >= today).length,
        thisWeek: quotes.filter(q => new Date(q.createdAt) >= thisWeekStart).length
      };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas de cotações:', error);
      return {
        total: 0,
        pending: 0,
        contacted: 0,
        converted: 0,
        cancelled: 0,
        today: 0,
        thisWeek: 0
      };
    }
  }
};
