// Utilitário para gerenciar produtos (integrado com Supabase)
import { useEffect } from 'react';
import { productCategories } from './productCategories';
import { productsAPI } from '../services/productsAPI';
import { categoriesAPI } from '../services/categoriesAPI';

const STORAGE_KEY = 'braspex_products';
const CATEGORIES_STORAGE_KEY = 'braspex_categories';

/**
 * Carrega categorias: PRIORIDADE Supabase → localStorage → Padrão
 */
export const loadCategories = async () => {
  try {
    // 1. Tentar carregar do Supabase
    console.log('🔍 Buscando categorias do Supabase...');
    const supabaseCategories = await categoriesAPI.getAll();
    
    if (supabaseCategories && Object.keys(supabaseCategories).length > 0) {
      console.log('✅ Categorias carregadas do Supabase:', Object.keys(supabaseCategories).length);
      // Salvar no localStorage como cache
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(supabaseCategories));
      return supabaseCategories;
    }
  } catch (error) {
    console.error('❌ Erro ao carregar categorias do Supabase:', error);
  }

  // 2. Fallback: carregar do localStorage
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      console.log('✅ Categorias carregadas do localStorage (cache)');
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('❌ Erro ao carregar categorias do localStorage:', e);
  }
  
  // 3. Fallback final: retornar categorias padrão
  console.log('⚠️ Usando categorias padrão (productCategories)');
  return productCategories;
};

/**
 * Hook para sincronizar mudanças de categorias
 */
export const useCategoriesSync = (callback) => {
  useEffect(() => {
    const handler = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('categoriesUpdated', handler);
    return () => window.removeEventListener('categoriesUpdated', handler);
  }, [callback]);
};

/**
 * Carrega produtos: PRIORIDADE Supabase → localStorage → Array vazio
 */
export const loadProducts = async () => {
  try {
    // 1. Tentar carregar do Supabase primeiro
    console.log('🔍 Buscando produtos do Supabase...');
    const supabaseProducts = await productsAPI.getAll();
    
    if (supabaseProducts && supabaseProducts.length > 0) {
      console.log('✅ Produtos carregados do Supabase:', supabaseProducts.length);
      
      // Converter formato do Supabase para formato do site
      const products = supabaseProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        categoryId: p.category_id,
        categoryName: p.category_name,
        subcategoryId: p.subcategory_id,
        image: p.image_url || p.image_path,
        price: p.price || p.price_label || 'Sob Consulta',
        specifications: p.specifications || {},
        active: p.active !== false,
        featured: p.featured || false,
        slug: p.slug
      }));
      
      // Salvar no localStorage como cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return products;
    }
  } catch (error) {
    console.error('❌ Erro ao carregar produtos do Supabase:', error);
  }

  // 2. Fallback: carregar do localStorage
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const products = JSON.parse(saved);
      console.log('✅ Produtos carregados do localStorage (cache):', products.length);
      return products;
    } catch (e) {
      console.error('❌ Erro ao carregar produtos do localStorage:', e);
    }
  }

  // 3. Se não houver produtos, retornar array vazio
  console.log('⚠️ Nenhum produto encontrado. Retornando array vazio.');
  return [];
};

/**
 * Salva produtos no localStorage
 */
export const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    console.log('✅ Produtos salvos no localStorage:', products.length);
    
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
    
    return true;
  } catch (e) {
    console.error('❌ Erro ao salvar produtos:', e);
    return false;
  }
};

/**
 * Adiciona um novo produto
 */
export const addProduct = async (product) => {
  const products = await loadProducts();
  const newProduct = {
    ...product,
    id: product.id || Date.now()
  };
  
  const updatedProducts = [...products, newProduct];
  saveProducts(updatedProducts);
  
  return newProduct;
};

/**
 * Atualiza um produto existente
 */
export const updateProduct = async (productId, updates) => {
  const products = await loadProducts();
  const updatedProducts = products.map(p => 
    p.id === productId ? { ...p, ...updates } : p
  );
  
  saveProducts(updatedProducts);
  
  return updatedProducts.find(p => p.id === productId);
};

/**
 * Remove um produto
 */
export const deleteProduct = async (productId) => {
  const products = await loadProducts();
  const updatedProducts = products.filter(p => p.id !== productId);
  
  saveProducts(updatedProducts);
  
  return true;
};

/**
 * Restaura produtos originais do mockProducts
 */
export const restoreOriginalProducts = async () => {
  try {
    const module = await import('./mockProducts');
    const mockProducts = module.mockProducts || module.default;
    
    saveProducts(mockProducts);
    
    return mockProducts;
  } catch (error) {
    console.error('❌ Erro ao restaurar produtos originais:', error);
    return [];
  }
};

/**
 * Filtra produtos por categoria
 */
export const filterProductsByCategory = (products, categoryId) => {
  if (!categoryId || categoryId === 'all') {
    return products;
  }
  
  return products.filter(p => p.categoryId === categoryId);
};

/**
 * Filtra produtos por subcategoria
 */
export const filterProductsBySubcategory = (products, categoryId, subcategoryId) => {
  if (!subcategoryId || subcategoryId === 'all') {
    return filterProductsByCategory(products, categoryId);
  }
  
  return products.filter(p => 
    p.categoryId === categoryId && p.subcategoryId === subcategoryId
  );
};

/**
 * Busca produto por ID
 */
export const getProductById = async (productId) => {
  const products = await loadProducts();
  return products.find(p => p.id === productId || p.id === parseInt(productId));
};

/**
 * Hook para React - escuta mudanças nos produtos
 */
export const useProductsSync = (callback) => {
  useEffect(() => {
    const handler = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('productsUpdated', handler);
    return () => window.removeEventListener('productsUpdated', handler);
  }, [callback]);
};
