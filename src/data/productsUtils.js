// Utilitário para gerenciar produtos (sincroniza localStorage com mockProducts)
import { useEffect } from 'react';
import { productCategories } from './productCategories';

const STORAGE_KEY = 'braspex_products';
const CATEGORIES_STORAGE_KEY = 'braspex_categories';

/**
 * Carrega categorias do localStorage ou retorna padrão
 */
export const loadCategories = () => {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('❌ Erro ao carregar categorias:', e);
  }
  
  // Fallback: retornar categorias padrão
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
 * Carrega produtos: APENAS do localStorage (não usa fallback mockProducts)
 */
export const loadProducts = async () => {
  // Tentar carregar do localStorage primeiro
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const products = JSON.parse(saved);
      console.log('✅ Produtos carregados do localStorage:', products.length);
      return products;
    } catch (e) {
      console.error('❌ Erro ao carregar produtos do localStorage:', e);
    }
  }

  // Se não houver produtos no localStorage, retornar array vazio
  console.log('⚠️ Nenhum produto encontrado no localStorage. Retornando array vazio.');
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
