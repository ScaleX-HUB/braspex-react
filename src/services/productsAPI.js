/**
 * API para gerenciamento de produtos no Supabase
 * Tabela: products
 * 
 * Estrutura:
 * - id: integer (primary key)
 * - name: text
 * - description: text
 * - price: numeric
 * - image_url: text
 * - category: text
 * - features: jsonb (array de features)
 * - active: boolean
 * - order_index: integer (para ordenação)
 * - created_at: timestamp
 * - updated_at: timestamp
 */

import { supabase } from '../lib/supabaseClient';

const TABLE_NAME = 'products';

export const productsAPI = {
  /**
   * Buscar todos os produtos
   */
  async getAll(includeInactive = false) {
    try {
      const filters = includeInactive ? {} : { active: true };
      const data = await supabase.get(TABLE_NAME, filters, {
        order: 'order_index.asc,name.asc'
      });
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  /**
   * Buscar produtos por categoria
   */
  async getByCategory(category) {
    try {
      const data = await supabase.get(TABLE_NAME, { 
        category,
        active: true 
      }, {
        order: 'order_index.asc,name.asc'
      });
      return data;
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
      throw error;
    }
  },

  /**
   * Buscar produto por ID
   */
  async getById(id) {
    try {
      const data = await supabase.get(TABLE_NAME, { id });
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Criar novo produto
   */
  async create(productData) {
    try {
      const data = await supabase.insert(TABLE_NAME, {
        name: productData.name,
        description: productData.description,
        price: productData.price || null,
        image_url: productData.image_url || productData.imageUrl || null,
        category: productData.category || 'geral',
        features: productData.features || [],
        active: productData.active !== undefined ? productData.active : true,
        order_index: productData.order_index || productData.orderIndex || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return data[0];
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  /**
   * Atualizar produto existente
   */
  async update(id, productData) {
    try {
      const updateData = {
        updated_at: new Date().toISOString()
      };

      // Mapear campos opcionais
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.image_url !== undefined) updateData.image_url = productData.image_url;
      if (productData.imageUrl !== undefined) updateData.image_url = productData.imageUrl;
      if (productData.category !== undefined) updateData.category = productData.category;
      if (productData.features !== undefined) updateData.features = productData.features;
      if (productData.active !== undefined) updateData.active = productData.active;
      if (productData.order_index !== undefined) updateData.order_index = productData.order_index;
      if (productData.orderIndex !== undefined) updateData.order_index = productData.orderIndex;

      const data = await supabase.update(TABLE_NAME, { id }, updateData);
      return data[0];
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletar produto (soft delete - marca como inativo)
   */
  async softDelete(id) {
    try {
      await this.update(id, { active: false });
      return true;
    } catch (error) {
      console.error(`Erro ao desativar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletar produto permanentemente
   */
  async delete(id) {
    try {
      await supabase.delete(TABLE_NAME, { id });
      return true;
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar categorias únicas
   */
  async getCategories() {
    try {
      const products = await this.getAll(true);
      const categories = [...new Set(products.map(p => p.category))];
      return categories.filter(c => c); // Remove nulls
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  /**
   * Reordenar produtos
   */
  async reorder(productIds) {
    try {
      const promises = productIds.map((id, index) =>
        this.update(id, { order_index: index })
      );
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Erro ao reordenar produtos:', error);
      throw error;
    }
  }
};
