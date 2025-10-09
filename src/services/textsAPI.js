/**
 * API para gerenciamento de textos do site no Supabase
 * Tabela: site_texts
 * 
 * Estrutura:
 * - id: integer (primary key)
 * - section: text (hero, vantagens, contato, etc)
 * - field: text (title, subtitle, description, etc)
 * - value: text (conteúdo)
 * - created_at: timestamp
 * - updated_at: timestamp
 */

import { supabase } from '../lib/supabaseClient';

const TABLE_NAME = 'site_texts';

export const textsAPI = {
  /**
   * Buscar todos os textos
   */
  async getAll() {
    try {
      const data = await supabase.get(TABLE_NAME, {}, {
        order: 'section.asc,field.asc'
      });
      return data;
    } catch (error) {
      console.error('Erro ao buscar textos:', error);
      throw error;
    }
  },

  /**
   * Buscar textos por seção
   */
  async getBySection(section) {
    try {
      const data = await supabase.get(TABLE_NAME, { section });
      return data;
    } catch (error) {
      console.error(`Erro ao buscar textos da seção ${section}:`, error);
      throw error;
    }
  },

  /**
   * Buscar texto específico por seção e campo
   */
  async getByField(section, field) {
    try {
      const data = await supabase.get(TABLE_NAME, { section, field });
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Erro ao buscar texto ${section}.${field}:`, error);
      throw error;
    }
  },

  /**
   * Criar novo texto
   */
  async create(textData) {
    try {
      const data = await supabase.insert(TABLE_NAME, {
        section: textData.section,
        field: textData.field,
        value: textData.value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return data[0];
    } catch (error) {
      console.error('Erro ao criar texto:', error);
      throw error;
    }
  },

  /**
   * Atualizar texto existente
   */
  async update(id, textData) {
    try {
      const data = await supabase.update(
        TABLE_NAME,
        { id },
        {
          ...textData,
          updated_at: new Date().toISOString()
        }
      );
      return data[0];
    } catch (error) {
      console.error(`Erro ao atualizar texto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualizar texto por seção e campo
   */
  async updateByField(section, field, value) {
    try {
      const data = await supabase.update(
        TABLE_NAME,
        { section, field },
        {
          value,
          updated_at: new Date().toISOString()
        }
      );
      return data[0];
    } catch (error) {
      console.error(`Erro ao atualizar texto ${section}.${field}:`, error);
      throw error;
    }
  },

  /**
   * Deletar texto
   */
  async delete(id) {
    try {
      await supabase.delete(TABLE_NAME, { id });
      return true;
    } catch (error) {
      console.error(`Erro ao deletar texto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Formatar textos em estrutura de objeto por seção
   * Converte array de textos em objeto {section: {field: value}}
   */
  formatToObject(texts) {
    const formatted = {};
    
    texts.forEach(text => {
      if (!formatted[text.section]) {
        formatted[text.section] = {};
      }
      formatted[text.section][text.field] = text.value;
    });

    return formatted;
  },

  /**
   * Buscar e formatar todos os textos em estrutura de objeto
   */
  async getAllFormatted() {
    try {
      const texts = await this.getAll();
      return this.formatToObject(texts);
    } catch (error) {
      console.error('Erro ao buscar textos formatados:', error);
      throw error;
    }
  }
};
