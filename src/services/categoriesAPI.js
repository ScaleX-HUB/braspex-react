import supabase from '../lib/supabaseClient';

/**
 * API para gerenciar CATEGORIAS no Supabase
 * Tabela: categories
 * Campos: id, name, display_name, icon, logo, color, subcategories (JSONB), created_at, updated_at
 */

export const categoriesAPI = {
  /**
   * Buscar todas as categorias
   */
  getAll: async () => {
    try {
      const { data, error } = await supabase.get('categories');
      
      if (error) {
        console.error('❌ Erro ao buscar categorias:', error);
        return null;
      }

      // Converter formato do banco para formato da aplicação
      if (data && data.length > 0) {
        const categoriesObj = {};
        data.forEach(cat => {
          categoriesObj[cat.name] = {
            id: cat.name,
            name: cat.name,
            displayName: cat.display_name,
            icon: cat.icon,
            logo: cat.logo,
            color: cat.color,
            subcategories: cat.subcategories || []
          };
        });
        console.log('✅ Categorias carregadas do Supabase:', categoriesObj);
        return categoriesObj;
      }

      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      return null;
    }
  },

  /**
   * Criar ou atualizar categoria
   */
  upsert: async (category) => {
    try {
      const categoryData = {
        name: category.id || category.name,
        display_name: category.displayName,
        icon: category.icon,
        logo: category.logo,
        color: category.color,
        subcategories: category.subcategories || [],
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase.insert('categories', categoryData);

      if (error) {
        console.error('❌ Erro ao salvar categoria:', error);
        return false;
      }

      console.log('✅ Categoria salva no Supabase:', data);
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar categoria:', error);
      return false;
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
   * Deletar categoria
   */
  delete: async (categoryId) => {
    try {
      const { error } = await supabase.delete('categories', {
        name: categoryId
      });

      if (error) {
        console.error('❌ Erro ao deletar categoria:', error);
        return false;
      }

      console.log('✅ Categoria deletada do Supabase');
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar categoria:', error);
      return false;
    }
  }
};
