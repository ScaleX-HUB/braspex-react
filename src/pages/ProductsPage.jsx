import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowRight, Home, ShoppingCart, Settings, Eye, Info } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import KitApplicationGuide from '../components/KitApplicationGuide';
import { useCart } from '../contexts/CartContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { loadProducts, useProductsSync, loadCategories, useCategoriesSync } from '../data/productsUtils';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [products, setProducts] = useState([]);
  const [categoriesData, setCategoriesData] = useState({});
  const { addToCart, isInCart } = useCart();
  const { content } = useSiteContent();
  const productsPageContent = content.productsPage;

  const scrollToKitApplication = useCallback((behavior = 'smooth') => {
    const element = document.getElementById('aplicacao-kits');
    if (!element) return;

    const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 96;
    window.scrollTo({ top: offsetPosition, behavior });
  }, []);

  const openKitApplication = useCallback(() => {
    setSelectedCategory('kit');
    window.setTimeout(() => scrollToKitApplication(), 80);
  }, [scrollToKitApplication]);

  // Carregar produtos e categorias
  useEffect(() => {
    document.title = 'Produtos | Braspex Sistemas Hidráulicos';
    console.log('🔄 ProductsPage: Carregando produtos e categorias...');
    
    // Carregar produtos
    loadProducts().then(products => {
      console.log('✅ Produtos carregados:', products.length);
      setProducts(products);
    });
    
    // Carregar categorias (async!)
    loadCategories().then(cats => {
      console.log('✅ Categorias carregadas:', Object.keys(cats).length);
      console.log('📦 Categorias:', cats);
      setCategoriesData(cats);
    });
  }, []);

  // Sincronizar quando produtos forem atualizados no admin
  useProductsSync((updatedProducts) => {
    setProducts(updatedProducts);
  });

  // Sincronizar quando categorias forem atualizadas
  useCategoriesSync((updatedCategories) => {
    setCategoriesData(updatedCategories);
  });

  // Listener para seleção de categoria do Header
  useEffect(() => {
    const handleSelectCategory = (event) => {
      const categoryId = event.detail;
      console.log('📂 Selecionando categoria:', categoryId);
      setSelectedCategory(categoryId);
      if (categoryId === 'kit') {
        window.setTimeout(() => scrollToKitApplication(), 120);
      }
    };

    window.addEventListener('selectCategory', handleSelectCategory);
    return () => window.removeEventListener('selectCategory', handleSelectCategory);
  }, [scrollToKitApplication]);

  // Estrutura de categorias dinâmica
  useEffect(() => {
    const handleOpenKitGuide = () => {
      openKitApplication();
    };

    window.addEventListener('openKitGuide', handleOpenKitGuide);
    return () => window.removeEventListener('openKitGuide', handleOpenKitGuide);
  }, [openKitApplication]);

  useEffect(() => {
    if (location.hash === '#aplicacao-kits') {
      window.setTimeout(() => {
        openKitApplication();
      }, 350);
    }
  }, [location.hash, openKitApplication]);

  const categoriesArray = Object.values(categoriesData);
  
  // Adicionar categoria "todos"
  const categories = [
    {
      id: 'todos',
      name: productsPageContent?.allProductsCategory || 'Todos os Produtos',
      icon: null,
      subcategories: []
    },
    ...categoriesArray.map(cat => ({
      id: cat.id,
      name: cat.displayName,
      icon: <Settings className="w-5 h-5" />,
      subcategories: cat.subcategories || []
    }))
  ];
  
  const filteredProducts = selectedCategory === 'todos' 
    ? products.filter(p => p.active !== false)
    : products.filter(p => {
        // Verifica se o produto pertence à categoria ou subcategoria selecionada
        const matchesCategory = p.categoryId === selectedCategory || p.categoryName === selectedCategory;
        const matchesSubcategory = p.subcategoryId === selectedCategory;
        return (matchesCategory || matchesSubcategory) && p.active !== false;
      });

  const getCategoryIcon = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId || c.name === categoryId);
    return cat?.icon || <Settings className="w-5 h-5" />;
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'kit') {
      openKitApplication();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-[#005563] hover:text-[#FFD027] transition-colors">
              <Home className="w-4 h-4" />
              {productsPageContent?.breadcrumbHome || 'Home'}
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{productsPageContent?.breadcrumbProducts || 'Produtos'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{productsPageContent?.title || 'Kits Hidráulicos Industriais'}</h1>
          <p className="text-lg text-gray-600">
            {productsPageContent?.subtitle || 'Soluções completas e pré-montadas para instalação rápida e eficiente'}
          </p>
        </div>

        <div className="mb-12 overflow-hidden border border-gray-200 bg-white shadow-md">
          <KitApplicationGuide compact />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Categorias */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden sticky top-24">
              <div className="bg-[#005563] text-white px-6 py-4">
                <h2 className="text-xl font-bold">{productsPageContent?.categoriesTitle || 'Categorias'}</h2>
              </div>
              <div className="p-4">
                {categories.map((category) => (
                  <div key={category.id} className="mb-2">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        selectedCategory === category.id
                          ? 'bg-[#005563] text-white font-semibold shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.icon && <span className={selectedCategory === category.id ? 'text-[#FFD027]' : 'text-[#005563]'}>{category.icon}</span>}
                      <span>{category.name}</span>
                    </button>
                    
                    {/* Subcategorias */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="ml-6 mt-1 space-y-1">
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => setSelectedCategory(subcategory.id)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                              selectedCategory === subcategory.id
                                ? 'bg-[#FFD027] text-[#005563] font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-[#005563]'
                            }`}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={openKitApplication}
                  className="mt-4 flex w-full items-center justify-between gap-3 border border-[#005563]/20 bg-[#005563]/5 px-4 py-4 text-left text-[#005563] transition-colors hover:bg-[#005563]/10"
                >
                  <span className="flex items-center gap-3">
                    <Info className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm font-bold uppercase leading-tight">
                      {productsPageContent?.kitGuideButtonText || 'Entenda a aplicacao dos kits'}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600 text-lg">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span>{' '}
                {filteredProducts.length === 1
                  ? (productsPageContent?.productsFoundSingular || 'produto encontrado')
                  : (productsPageContent?.productsFoundPlural || 'produtos encontrados')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <Link to={`/produtos/${product.id}`}>
                    <div className="relative h-64 bg-gradient-to-br from-[#005563]/5 to-[#005563]/10 flex items-center justify-center p-8 hover:from-[#005563]/10 hover:to-[#005563]/20 transition-all cursor-pointer">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="text-[#005563]/20 text-8xl">
                          {getCategoryIcon(product.category)}
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-[#005563] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {categories.find(c => c.id === product.categoryId || c.id === product.categoryName)?.name || product.categoryName || productsPageContent?.categoryFallback || 'Kit'}
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6">
                    <Link to={`/produtos/${product.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 min-h-[3.5rem] line-clamp-2 hover:text-[#005563] transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>

                    <p className="text-lg font-bold text-[#005563] mb-4">
                      {product.price}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.specifications?.material && (
                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                          {product.specifications.material}
                        </span>
                      )}
                      {product.specifications?.acabamento && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                          {product.specifications.acabamento}
                        </span>
                      )}
                      {product.specifications?.capacity && (
                        <span className="bg-[#FFD027]/20 text-[#005563] text-xs font-medium px-3 py-1 rounded-full">
                          {product.specifications.capacity}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={isInCart(product.id)}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md ${
                          isInCart(product.id)
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : 'bg-[#005563] text-white hover:bg-[#004450] hover:shadow-lg'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {isInCart(product.id)
                          ? (productsPageContent?.inCart || 'No Carrinho')
                          : (productsPageContent?.addToCart || 'Adicionar')}
                      </button>
                      <Link
                        to={`/produtos/${product.id}`}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
                <div className="text-gray-300 text-7xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {productsPageContent?.emptyTitle || 'Nenhum produto encontrado'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {productsPageContent?.emptyDescription || 'Não há produtos nesta categoria no momento.'}
                </p>
                <button
                  onClick={() => setSelectedCategory('todos')}
                  className="bg-[#005563] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#004450] transition-colors"
                >
                  {productsPageContent?.emptyButtonText || 'Ver todos os produtos'}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
