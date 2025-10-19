import { supabase } from '../lib/supabaseClient';

/**
 * API para gerenciar CATEGORIAS no Supabase
 * Tabela: categories
 * Campos: id, name, display_name, icon, logo, color, subcategories (JSONB), created_at, updated_at
 */

export const categoriesAPI = {
  /**
   * Buscar todas as categorias (retorna objeto)
   */
  getAll: async () => {
    try {
      console.log('🔍 Buscando categorias do Supabase...');
      
      const data = await supabase.get('categories', {}, {
        order: 'order_index.asc'
      });
      
      console.log('📦 Dados brutos do Supabase:', data);

      // Converter formato do banco para formato da aplicação
      if (data && data.length > 0) {
        const categoriesObj = {};
        data.forEach(cat => {
          categoriesObj[cat.name] = {
            id: cat.id, // UUID do Supabase
            uuid: cat.id,
            name: cat.name,
            displayName: cat.display_name,
            icon: cat.icon || 'Package',
            color: cat.color || '#005563',
            subcategories: cat.subcategories || [],
            active: cat.active !== false,
            order_index: cat.order_index || 0
          };
        });
        console.log('✅ Categorias carregadas e formatadas:', categoriesObj);
        return categoriesObj;
      }

      console.log('⚠️ Nenhuma categoria encontrada no Supabase');
      return {};
      
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      throw error;
    }
  },

  /**
   * Buscar todas as categorias (retorna array)
   */
  getAllArray: async () => {
    try {
      console.log('🔍 Buscando categorias (array) do Supabase...');
      
      const data = await supabase.get('categories', {}, {
        order: 'order_index.asc'
      });
      
      console.log('📦 Categorias carregadas:', data?.length || 0);
      return data || [];
      
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      throw error;
    }
  },

  /**
   * Criar ou atualizar categoria (UPSERT)
   */
  upsert: async (category) => {
    try {
      console.log('💾 Salvando categoria:', category);
      
      const categoryData = {
        name: category.id || category.name,
        display_name: category.displayName,
        icon: category.icon || 'Package',
        logo: category.logo || '',
        color: category.color || '#005563',
        slug: category.slug || category.id || category.name,
        description: category.description || '',
        subcategories: category.subcategories || [],
        active: category.active !== false,
        order_index: category.order_index || 0,
        updated_at: new Date().toISOString()
      };

      console.log('📦 Dados formatados para Supabase:', categoryData);

      // Buscar categoria existente por name
      const existing = await supabase.get('categories', { name: categoryData.name });
      
      if (existing && existing.length > 0) {
        // Categoria existe - atualizar usando o UUID
        console.log('🔄 Categoria existe, atualizando...', existing[0].id);
        const updateResult = await supabase.update('categories', { id: existing[0].id }, categoryData);
        console.log('✅ Categoria atualizada no Supabase:', updateResult);
        return true;
      }

      // Categoria não existe - inserir nova com UUID
      const insertData = {
        ...categoryData,
        created_at: new Date().toISOString()
      };
      
      // Se tiver UUID fornecido, usar. Senão, deixar o DB gerar automaticamente
      if (category.uuid) {
        insertData.id = category.uuid;
      }
      
      const insertResult = await supabase.insert('categories', insertData);
      console.log('✅ Categoria criada no Supabase:', insertResult);
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao salvar categoria:', error);
      throw error;
    }
  },

  /**
   * Sincronizar todas as categorias do localStorage para o Supabase
   */
  syncAll: async (categories) => {
    try {
      const categoriesArray = Object.values(categories);
      
      for (const category of categoriesArray) {
        await categoriesAPI.upsert(category);
      }

      console.log('✅ Todas as categorias sincronizadas com Supabase');
      return true;
    } catch (error) {
      console.error('❌ Erro ao sincronizar categorias:', error);
      return false;
    }
  },

  /**
   * Criar nova categoria
   */
  create: async (categoryData) => {
    try {
      console.log('🆕 Criando categoria:', categoryData);
      
      const data = {
        name: categoryData.name,
        display_name: categoryData.display_name || categoryData.displayName,
        icon: categoryData.icon || 'Package',
        color: categoryData.color || '#005563',
        order_index: categoryData.order_index || 0,
        active: categoryData.active !== false,
        subcategories: categoryData.subcategories || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = await supabase.insert('categories', data);
      console.log('✅ Categoria criada:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Erro ao criar categoria:', error);
      throw error;
    }
  },

  /**
   * Atualizar categoria existente
   */
  update: async (id, categoryData) => {
    try {
      console.log('🔄 Atualizando categoria:', id, categoryData);
      
      const data = {
        name: categoryData.name,
        display_name: categoryData.display_name || categoryData.displayName,
        icon: categoryData.icon || 'Package',
        color: categoryData.color || '#005563',
        order_index: categoryData.order_index || 0,
        active: categoryData.active !== false,
        subcategories: categoryData.subcategories || [],
        updated_at: new Date().toISOString()
      };

      const result = await supabase.update('categories', { id }, data);
      console.log('✅ Categoria atualizada:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Erro ao atualizar categoria:', error);
      throw error;
    }
  },

  /**
   * Deletar categoria por ID (UUID)
   */
  deleteById: async (id) => {
    try {
      console.log('🗑️ Deletando categoria:', id);
      
      const result = await supabase.delete('categories', { id });
      console.log('✅ Categoria deletada:', result);
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao deletar categoria:', error);
      throw error;
    }
  },

  /**
   * Deletar categoria por nome
   */
  delete: async (categoryId) => {
    try {
      console.log('🗑️ Deletando categoria:', categoryId);
      
      // Buscar a categoria primeiro para pegar o UUID correto
      const categories = await supabase.get('categories', { name: categoryId });
      
      if (!categories || categories.length === 0) {
        throw new Error(`Categoria ${categoryId} não encontrada`);
      }
      
      const category = categories[0];
      console.log('🔍 Categoria encontrada:', category);
      
      // Deletar usando o UUID (campo id)
      const result = await supabase.delete('categories', {
        id: category.id
      });

      console.log('✅ Categoria deletada do Supabase:', result);
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao deletar categoria:', error);
      throw error;
    }
  }
};
