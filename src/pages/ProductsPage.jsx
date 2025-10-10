import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CaretDown, CaretRight, MagnifyingGlass, X } from 'phosphor-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { productCategories, getCategoryById } from '../data/productCategories';
import { mockProducts, getProductsByCategory, searchProducts, getAllActiveProducts } from '../data/mockProducts';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Inicializar filtros baseado nos query params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setExpandedCategories(prev => ({ ...prev, [categoryParam]: true }));
    }
    
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    }
  }, [searchParams]);

  // Filtrar produtos
  useEffect(() => {
    let products = [];
    
    if (searchQuery) {
      // Se há busca, filtrar por texto
      products = searchProducts(searchQuery);
    } else if (selectedCategory) {
      // Filtrar por categoria/subcategoria
      products = getProductsByCategory(selectedCategory, selectedSubcategory);
    } else {
      // Mostrar todos os produtos
      products = getAllActiveProducts();
    }
    
    setFilteredProducts(products);
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubcategory = (subcategoryId) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId]
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSearchQuery('');
    navigate(`/produtos?category=${categoryId}`);
  };

  const handleSubcategorySelect = (categoryId, subcategoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    setSearchQuery('');
    navigate(`/produtos?category=${categoryId}&subcategory=${subcategoryId}`);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    navigate('/produtos');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const getCategoryName = () => {
    if (!selectedCategory) return 'Todos os Produtos';
    
    const category = getCategoryById(selectedCategory);
    if (!category) return 'Produtos';
    
    if (selectedSubcategory) {
      const subcategory = category.subcategories.find(sub => sub.id === selectedSubcategory);
      return subcategory ? `${category.displayName} - ${subcategory.name}` : category.displayName;
    }
    
    return category.displayName;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#005563] to-[#003d47] text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossos Produtos</h1>
          <p className="text-xl text-gray-200">
            Conheça nossa linha completa de produtos para sistemas hidráulicos e de climatização
          </p>
        </div>
      </div>

      {/* Breadcrumb e Busca */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600">
              <button onClick={() => navigate('/')} className="hover:text-[#005563]">Home</button>
              <span className="mx-2">/</span>
              <span className="text-[#005563] font-medium">{getCategoryName()}</span>
            </div>
            
            {/* Busca */}
            <form onSubmit={handleSearch} className="relative max-w-md w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Layout Principal */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Produtos</h2>
                {(selectedCategory || selectedSubcategory || searchQuery) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-[#005563] hover:text-[#FFD027] font-medium"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                {/* PEX */}
                <div className="border-b border-gray-200 pb-2">
                  <button
                    onClick={() => toggleCategory('pex')}
                    className="w-full flex items-center justify-between py-2 text-left hover:text-red-600 transition-colors"
                  >
                    <span className={`font-semibold ${selectedCategory === 'pex' && !selectedSubcategory ? 'text-red-600' : 'text-gray-900'}`}>
                      Linha Pex Barbi
                    </span>
                    {expandedCategories['pex'] ? <CaretDown className="w-4 h-4" /> : <CaretRight className="w-4 h-4" />}
                  </button>
                  
                  {expandedCategories['pex'] && (
                    <div className="ml-4 mt-2 space-y-1">
                      {productCategories.PEX.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubcategorySelect('pex', sub.id)}
                          className={`block w-full text-left py-1 text-sm hover:text-red-600 transition-colors ${
                            selectedSubcategory === sub.id ? 'text-red-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          › {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* GAS */}
                <div className="border-b border-gray-200 pb-2">
                  <button
                    onClick={() => toggleCategory('gas')}
                    className="w-full flex items-center justify-between py-2 text-left hover:text-yellow-600 transition-colors"
                  >
                    <span className={`font-semibold ${selectedCategory === 'gas' && !selectedSubcategory ? 'text-yellow-600' : 'text-gray-900'}`}>
                      Linha Pex Gás
                    </span>
                    {expandedCategories['gas'] ? <CaretDown className="w-4 h-4" /> : <CaretRight className="w-4 h-4" />}
                  </button>
                  
                  {expandedCategories['gas'] && (
                    <div className="ml-4 mt-2 space-y-1">
                      {productCategories.GAS.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubcategorySelect('gas', sub.id)}
                          className={`block w-full text-left py-1 text-sm hover:text-yellow-600 transition-colors ${
                            selectedSubcategory === sub.id ? 'text-yellow-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          › {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* KIT */}
                <div className="border-b border-gray-200 pb-2">
                  <button
                    onClick={() => toggleCategory('kit')}
                    className="w-full flex items-center justify-between py-2 text-left hover:text-gray-600 transition-colors"
                  >
                    <span className={`font-semibold ${selectedCategory === 'kit' && !selectedSubcategory ? 'text-gray-600' : 'text-gray-900'}`}>
                      Sistema Kit Barbi
                    </span>
                    {expandedCategories['kit'] ? <CaretDown className="w-4 h-4" /> : <CaretRight className="w-4 h-4" />}
                  </button>
                  
                  {expandedCategories['kit'] && (
                    <div className="ml-4 mt-2 space-y-1">
                      {productCategories.KIT.subcategories.map((sub) => (
                        <div key={sub.id}>
                          <button
                            onClick={() => handleSubcategorySelect('kit', sub.id)}
                            className={`block w-full text-left py-1 text-sm hover:text-gray-600 transition-colors ${
                              selectedSubcategory === sub.id ? 'text-gray-600 font-medium' : 'text-gray-700'
                            }`}
                          >
                            › {sub.name}
                          </button>
                          
                          {/* Sub-subcategorias se existirem */}
                          {sub.children && expandedSubcategories[sub.id] && (
                            <div className="ml-4 mt-1 space-y-1">
                              {sub.children.map((child) => (
                                <button
                                  key={child.id}
                                  className="block w-full text-left py-1 text-xs text-gray-600 hover:text-gray-800"
                                >
                                  • {child.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* POLVO */}
                <div className="border-b border-gray-200 pb-2">
                  <button
                    onClick={() => handleCategorySelect('polvo')}
                    className={`w-full flex items-center justify-between py-2 text-left hover:text-green-600 transition-colors ${
                      selectedCategory === 'polvo' ? 'text-green-600' : ''
                    }`}
                  >
                    <span className="font-semibold text-gray-900">Sistema Polvo</span>
                  </button>
                </div>

                {/* OUTROS */}
                <div className="pb-2">
                  <button
                    onClick={() => toggleCategory('outros')}
                    className="w-full flex items-center justify-between py-2 text-left hover:text-[#005563] transition-colors"
                  >
                    <span className={`font-semibold ${selectedCategory === 'outros' && !selectedSubcategory ? 'text-[#005563]' : 'text-gray-900'}`}>
                      Outros Sistemas
                    </span>
                    {expandedCategories['outros'] ? <CaretDown className="w-4 h-4" /> : <CaretRight className="w-4 h-4" />}
                  </button>
                  
                  {expandedCategories['outros'] && productCategories.OUTROS.subcategories && (
                    <div className="ml-4 mt-2 space-y-1">
                      {productCategories.OUTROS.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubcategorySelect('outros', sub.id)}
                          className={`block w-full text-left py-1 text-sm hover:text-[#005563] transition-colors ${
                            selectedSubcategory === sub.id ? 'text-[#005563] font-medium' : 'text-gray-700'
                          }`}
                        >
                          › {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Lista de Produtos */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{getCategoryName()}</h2>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlass className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? 'Tente ajustar sua busca ou filtros'
                    : 'Não há produtos nesta categoria no momento'
                  }
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-[#005563] text-white px-6 py-2 rounded-lg hover:bg-[#003d47] transition-colors"
                >
                  Ver todos os produtos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                    {/* Imagem do Produto */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400?text=Produto';
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 text-center p-8">
                          <Package className="w-16 h-16 mx-auto mb-2" />
                          <p className="text-sm">Imagem não disponível</p>
                        </div>
                      )}
                    </div>

                    {/* Informações do Produto */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Especificações */}
                      {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="mb-3 text-xs text-gray-500">
                          {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1 border-t border-gray-100">
                              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="text-right">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button className="w-full bg-[#005563] text-white py-2 rounded-lg hover:bg-[#FFD027] hover:text-[#005563] transition-colors duration-300 font-medium">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
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
