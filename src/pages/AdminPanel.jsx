import React, { useState } from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Eye, Users, Calendar, ChartBar, FloppyDisk, ArrowCounterClockwise, ArrowLeft, SignOut, Gear, Package, Plus, Trash, PencilSimple } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { productCategories } from '../data/productCategories';
import { mockProducts } from '../data/mockProducts';

const AdminPanel = ({ onLogout }) => {
  const { content, analytics, updateContent, resetContent, loading } = useSiteContent();
  const [activeSection, setActiveSection] = useState('analytics');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const navigate = useNavigate();

  const sections = [
    { id: 'analytics', name: 'Analytics', icon: <ChartBar className="w-5 h-5" /> },
    { id: 'produtos', name: 'Produtos', icon: <Package className="w-5 h-5" /> },
    { id: 'hero', name: 'Hero/Banner', icon: <Eye className="w-5 h-5" /> },
    { id: 'vantagens', name: 'Vantagens', icon: <Users className="w-5 h-5" /> },
    { id: 'parceiros', name: 'Parceiros', icon: <Users className="w-5 h-5" /> },
    { id: 'comparacao', name: 'Comparação', icon: <ChartBar className="w-5 h-5" /> },
    { id: 'kits', name: 'Kits', icon: <Eye className="w-5 h-5" /> },
    { id: 'fluxo', name: 'Fluxo', icon: <Calendar className="w-5 h-5" /> },
    { id: 'contato', name: 'Contato', icon: <Users className="w-5 h-5" /> },
    { id: 'footer', name: 'Footer', icon: <Eye className="w-5 h-5" /> }
  ];

  const handleContentChange = (section, field, value) => {
    updateContent(section, field, value);
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      // As alterações já são salvas automaticamente pelo updateContent
      setUnsavedChanges(false);
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar alterações: ' + error.message);
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todo o conteúdo para os valores padrão?')) {
      resetContent();
      setUnsavedChanges(false);
      alert('Conteúdo resetado com sucesso!');
    }
  };

  // Funções de gerenciamento de produtos
  const handleAddProduct = () => {
    setEditingProduct({
      id: null,
      name: '',
      description: '',
      categoryId: '',
      subcategoryId: '',
      childId: '',
      subchildId: '',
      image: '',
      specifications: {},
      active: true
    });
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== productId));
      setUnsavedChanges(true);
      alert('Produto excluído com sucesso!');
    }
  };

  const handleSaveProduct = () => {
    if (!editingProduct.name || !editingProduct.categoryId) {
      alert('Por favor, preencha o nome e selecione a categoria do produto.');
      return;
    }

    if (editingProduct.id) {
      // Atualizar produto existente
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      alert('Produto atualizado com sucesso!');
    } else {
      // Adicionar novo produto
      const newProduct = {
        ...editingProduct,
        id: Math.max(...products.map(p => p.id), 0) + 1
      };
      setProducts([...products, newProduct]);
      alert('Produto adicionado com sucesso!');
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setUnsavedChanges(true);
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const getSubcategoriesForCategory = (categoryId) => {
    const category = Object.values(productCategories).find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics do Site</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Visualizações</p>
              <p className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Visualizações Hoje</p>
              <p className="text-3xl font-bold">{analytics.dailyViews}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Últimos Visitantes</p>
              <p className="text-3xl font-bold">{analytics.visitors.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Visitas</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analytics.visitors.slice(-10).reverse().map((visitor, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(visitor.date).toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-600 truncate max-w-md">
                  {visitor.userAgent.split(' ')[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProductsManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
        <button
          onClick={handleAddProduct}
          className="flex items-center px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#003d47] transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Produto
        </button>
      </div>

      {/* Formulário de Produto */}
      {showProductForm && editingProduct && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-[#005563]">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {editingProduct.id ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="Ex: Adaptador Cobre Solda - PEX"
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                rows={3}
                placeholder="Descrição detalhada do produto"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={editingProduct.categoryId}
                onChange={(e) => setEditingProduct({
                  ...editingProduct, 
                  categoryId: e.target.value,
                  subcategoryId: '',
                  childId: '',
                  subchildId: ''
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {Object.values(productCategories).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategoria */}
            {editingProduct.categoryId && getSubcategoriesForCategory(editingProduct.categoryId).length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategoria
                </label>
                <select
                  value={editingProduct.subcategoryId}
                  onChange={(e) => setEditingProduct({...editingProduct, subcategoryId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                >
                  <option value="">Selecione uma subcategoria</option>
                  {getSubcategoriesForCategory(editingProduct.categoryId).map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* URL da Imagem */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem
              </label>
              <input
                type="text"
                value={editingProduct.image}
                onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            {/* Status Ativo */}
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                checked={editingProduct.active}
                onChange={(e) => setEditingProduct({...editingProduct, active: e.target.checked})}
                className="w-4 h-4 text-[#005563] border-gray-300 rounded focus:ring-[#005563]"
                id="product-active"
              />
              <label htmlFor="product-active" className="ml-2 text-sm font-medium text-gray-700">
                Produto Ativo
              </label>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveProduct}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Salvar Produto
            </button>
            <button
              onClick={handleCancelProductForm}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Produtos */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subcategoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const category = Object.values(productCategories).find(cat => cat.id === product.categoryId);
                const subcategory = category?.subcategories?.find(sub => sub.id === product.subcategoryId);
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category?.displayName || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subcategory?.name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-[#005563] hover:text-[#FFD027] mr-3"
                        title="Editar"
                      >
                        <PencilSimple className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum produto cadastrado</p>
              <button
                onClick={handleAddProduct}
                className="mt-4 text-[#005563] hover:text-[#FFD027] font-medium"
              >
                Adicionar primeiro produto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContentEditor = (sectionId) => {
    const sectionContent = content[sectionId];
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Editar {sections.find(s => s.id === sectionId)?.name}
        </h2>
        
        <div className="space-y-4">
          {Object.entries(sectionContent).map(([field, value]) => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {field === 'description' || value.length > 50 ? (
                <textarea
                  value={value}
                  onChange={(e) => handleContentChange(sectionId, field, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleContentChange(sectionId, field, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Site
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Painel Administrativo - BRASPEX
              </h1>
              {/* Status da conexão removido */}
            </div>
            
            <div className="flex items-center space-x-3">
              {unsavedChanges && (
                <span className="text-sm text-amber-600 font-medium">
                  Alterações não salvas
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={!unsavedChanges}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FloppyDisk className="w-4 h-4 mr-2" />
                Salvar
              </button>
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ArrowCounterClockwise className="w-4 h-4 mr-2" />
                Reset
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <SignOut className="w-4 h-4 mr-2" />
                  Sair
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seções</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {section.icon}
                    <span className="ml-3">{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {activeSection === 'analytics' && renderAnalytics()}
              {/* Baserow removido */}
              {activeSection === 'produtos' && renderProductsManager()}
              {activeSection !== 'analytics' && activeSection !== 'produtos' && renderContentEditor(activeSection)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;