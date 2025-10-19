/**
 * API para gerenciamento de produtos no Supabase
 * Tabela: products
 * 
 * Estrutura ATUALIZADA:
 * - id: uuid (primary key)
 * - name: text
 * - slug: text (unique)
 * - description: text
 * - category_id: integer (FK para categories)
 * - category_name: text (cache)
 * - subcategory_id: text
 * - subcategory_name: text
 * - image_url: text (URL pública da imagem)
 * - image_path: text (caminho no Supabase Storage)
 * - thumbnail_url: text
 * - gallery: jsonb (array de URLs)
 * - price: numeric
 * - price_label: text
 * - sku: text (unique)
 * - specifications: jsonb
 * - features: jsonb (array)
 * - active: boolean
 * - featured: boolean
 * - stock_status: text
 * - order_index: integer
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
      
      console.log('📦 Produtos carregados do Supabase:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      throw error;
    }
  },

  /**
   * Buscar produtos por categoria
   */
  async getByCategory(categoryId) {
    try {
      const data = await supabase.get(TABLE_NAME, { 
        category_id: categoryId,
        active: true 
      }, {
        order: 'order_index.asc,name.asc'
      });
      return data || [];
    } catch (error) {
      console.error(`❌ Erro ao buscar produtos da categoria ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Buscar produtos em destaque
   */
  async getFeatured() {
    try {
      const data = await supabase.get(TABLE_NAME, { 
        featured: true,
        active: true 
      }, {
        order: 'order_index.asc,name.asc'
      });
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar produtos em destaque:', error);
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
      console.error(`❌ Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar produto por slug
   */
  async getBySlug(slug) {
    try {
      const data = await supabase.get(TABLE_NAME, { slug });
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`❌ Erro ao buscar produto com slug ${slug}:`, error);
      throw error;
    }
  },

  /**
   * Criar novo produto
   */
  async create(productData) {
    try {
      console.log('🆕 Criando produto:', productData);
      
      // Gerar slug se não fornecido
      const slug = productData.slug || 
        productData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');

      // Preparar dados básicos (colunas que sempre existem)
      const data = {
        name: productData.name,
        description: productData.description || null,
        category_id: productData.category_id || productData.categoryId || null,
        image_url: productData.image_url || productData.imageUrl || productData.image || null,
        price: productData.price || null,
        specifications: productData.specifications || {},
        active: productData.active !== undefined ? productData.active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Adicionar campos opcionais apenas se fornecidos
      if (slug) data.slug = slug;
      if (productData.subcategory_id || productData.subcategoryId) {
        data.subcategory_id = productData.subcategory_id || productData.subcategoryId;
      }
      if (productData.image_path || productData.imagePath) {
        data.image_path = productData.image_path || productData.imagePath;
      }
      if (productData.features) {
        data.features = productData.features;
      }
      if (productData.featured !== undefined) {
        data.featured = productData.featured;
      }
      if (productData.sku) {
        data.sku = productData.sku;
      }

      console.log('📦 Dados preparados para INSERT:', data);
      
      const result = await supabase.insert(TABLE_NAME, data);
      
      console.log('✅ Produto criado no Supabase:', result);
      return result && result.length > 0 ? result[0] : result;
      
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      // Logar erro detalhado
      if (error.message) {
        console.error('Mensagem de erro:', error.message);
      }
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

      // Mapear campos opcionais (snake_case e camelCase)
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.slug !== undefined) updateData.slug = productData.slug;
      if (productData.description !== undefined) updateData.description = productData.description;
      
      if (productData.category_id !== undefined) updateData.category_id = productData.category_id;
      if (productData.categoryId !== undefined) updateData.category_id = productData.categoryId;
      if (productData.category_name !== undefined) updateData.category_name = productData.category_name;
      if (productData.categoryName !== undefined) updateData.category_name = productData.categoryName;
      
      if (productData.subcategory_id !== undefined) updateData.subcategory_id = productData.subcategory_id;
      if (productData.subcategoryId !== undefined) updateData.subcategory_id = productData.subcategoryId;
      if (productData.subcategory_name !== undefined) updateData.subcategory_name = productData.subcategory_name;
      if (productData.subcategoryName !== undefined) updateData.subcategory_name = productData.subcategoryName;
      
      if (productData.image_url !== undefined) updateData.image_url = productData.image_url;
      if (productData.imageUrl !== undefined) updateData.image_url = productData.imageUrl;
      if (productData.image !== undefined) updateData.image_url = productData.image;
      if (productData.image_path !== undefined) updateData.image_path = productData.image_path;
      if (productData.imagePath !== undefined) updateData.image_path = productData.imagePath;
      if (productData.thumbnail_url !== undefined) updateData.thumbnail_url = productData.thumbnail_url;
      if (productData.thumbnailUrl !== undefined) updateData.thumbnail_url = productData.thumbnailUrl;
      if (productData.gallery !== undefined) updateData.gallery = productData.gallery;
      
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.price_label !== undefined) updateData.price_label = productData.price_label;
      if (productData.priceLabel !== undefined) updateData.price_label = productData.priceLabel;
      if (productData.sku !== undefined) updateData.sku = productData.sku;
      
      if (productData.specifications !== undefined) updateData.specifications = productData.specifications;
      if (productData.features !== undefined) updateData.features = productData.features;
      
      if (productData.active !== undefined) updateData.active = productData.active;
      if (productData.featured !== undefined) updateData.featured = productData.featured;
      if (productData.stock_status !== undefined) updateData.stock_status = productData.stock_status;
      if (productData.stockStatus !== undefined) updateData.stock_status = productData.stockStatus;
      if (productData.order_index !== undefined) updateData.order_index = productData.order_index;
      if (productData.orderIndex !== undefined) updateData.order_index = productData.orderIndex;

      const data = await supabase.update(TABLE_NAME, { id }, updateData);
      console.log('✅ Produto atualizado no Supabase');
      return data[0];
    } catch (error) {
      console.error(`❌ Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletar produto (soft delete - marca como inativo)
   */
  async softDelete(id) {
    try {
      await this.update(id, { active: false });
      console.log('✅ Produto desativado (soft delete)');
      return true;
    } catch (error) {
      console.error(`❌ Erro ao desativar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletar produto permanentemente
   */
  async delete(id) {
    try {
      await supabase.delete(TABLE_NAME, { id });
      console.log('✅ Produto deletado permanentemente');
      return true;
    } catch (error) {
      console.error(`❌ Erro ao deletar produto ${id}:`, error);
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
      console.log('✅ Produtos reordenados');
      return true;
    } catch (error) {
      console.error('❌ Erro ao reordenar produtos:', error);
      throw error;
    }
  },

  /**
   * Upload de imagem para Supabase Storage
   */
  async uploadImage(file, productId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId || Date.now()}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      // Upload para Storage
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file);
      
      if (error) {
        console.error('❌ Erro ao fazer upload:', error);
        throw error;
      }
      
      // Gerar URL pública
      const { data: publicData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      console.log('✅ Imagem enviada:', publicData.publicUrl);
      
      return {
        url: publicData.publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('❌ Erro no upload de imagem:', error);
      throw error;
    }
  }
};

