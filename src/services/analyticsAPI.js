/**
 * API para gerenciamento de analytics no Supabase
 * Tabela: analytics
 * 
 * Estrutura:
 * - id: integer (primary key)
 * - date: date
 * - user_agent: text
 * - ip_address: text
 * - page: text
 * - created_at: timestamp
 */

import { supabase } from '../lib/supabaseClient';

const TABLE_NAME = 'analytics';

export const analyticsAPI = {
  /**
   * Obter IP do usuário
   */
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Erro ao obter IP:', error);
      return 'unknown';
    }
  },

  /**
   * Registrar visualização (apenas uma vez por IP por dia)
   */
  async trackView(pageData) {
    try {
      const ip = await this.getClientIP();
      const today = new Date().toISOString().split('T')[0];
      
      // Verificar se já existe registro deste IP hoje
      const existingViews = await supabase.get(TABLE_NAME, { 
        date: today, 
        ip_address: ip 
      });
      
      // Se já visitou hoje, não registrar novamente
      if (existingViews && existingViews.length > 0) {
        console.log('Visitante já registrado hoje');
        return null;
      }
      
      // Registrar nova visita
      const data = await supabase.insert(TABLE_NAME, {
        date: today,
        user_agent: pageData.userAgent || navigator.userAgent,
        ip_address: ip,
        page: pageData.page || window.location.pathname,
        created_at: new Date().toISOString()
      });
      return data[0];
    } catch (error) {
      // Não bloquear a aplicação se analytics falhar
      console.warn('⚠️ Analytics não disponível (erro 401 - permissões). Analytics desabilitado.');
      return null;
    }
  },

  /**
   * Buscar todas as visualizações
   */
  async getAll(limit = 100) {
    try {
      const data = await supabase.get(TABLE_NAME, {}, {
        order: 'created_at.desc',
        limit
      });
      return data;
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
      throw error;
    }
  },

  /**
   * Buscar visualizações por data
   */
  async getByDate(date) {
    try {
      const data = await supabase.get(TABLE_NAME, { date });
      return data;
    } catch (error) {
      console.error(`Erro ao buscar analytics da data ${date}:`, error);
      throw error;
    }
  },

  /**
   * Buscar visualizações de hoje
   */
  async getToday() {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await this.getByDate(today);
    } catch (error) {
      console.error('Erro ao buscar analytics de hoje:', error);
      throw error;
    }
  },

  /**
   * Buscar estatísticas gerais
   */
  async getStats() {
    try {
      const allViews = await this.getAll(1000);
      const todayViews = await this.getToday();
      
      // Agrupar por IP para contar visitantes únicos
      const uniqueIPs = new Set(allViews.map(v => v.ip_address));
      const uniqueTodayIPs = new Set(todayViews.map(v => v.ip_address));

      return {
        totalViews: uniqueIPs.size, // Total de IPs únicos
        dailyViews: uniqueTodayIPs.size, // IPs únicos de hoje
        visitors: allViews.slice(-50) // Últimas 50 visitas
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalViews: 0,
        dailyViews: 0,
        visitors: []
      };
    }
  },

  /**
   * Buscar visualizações por período
   */
  async getByDateRange(startDate, endDate) {
    try {
      const allViews = await this.getAll(10000);
      return allViews.filter(view => {
        const viewDate = new Date(view.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return viewDate >= start && viewDate <= end;
      });
    } catch (error) {
      console.error('Erro ao buscar analytics por período:', error);
      throw error;
    }
  },

  /**
   * Deletar analytics antigos
   */
  async deleteOlderThan(days) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffString = cutoffDate.toISOString().split('T')[0];

      const oldViews = await this.getAll(10000);
      const viewsToDelete = oldViews.filter(view => view.date < cutoffString);

      for (const view of viewsToDelete) {
        await supabase.delete(TABLE_NAME, { id: view.id });
      }

      return viewsToDelete.length;
    } catch (error) {
      console.error('Erro ao deletar analytics antigos:', error);
      throw error;
    }
  }
};
