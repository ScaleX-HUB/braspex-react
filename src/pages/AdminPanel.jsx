import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { productsAPI } from '../services/productsAPI';
import { Eye, Users, Calendar, ChartBar, FloppyDisk, ArrowCounterClockwise, ArrowLeft, SignOut, Gear, Database, X } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import SupabaseStatusDashboard from '../components/SupabaseStatusDashboard';

const AdminPanel = ({ onLogout }) => {
  const { content, analytics, updateContent, resetContent, loading, isSupabaseConnected } = useSiteContent();
  const [activeSection, setActiveSection] = useState('analytics');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const navigate = useNavigate();

  // Carregar produtos quando necessário
  useEffect(() => {
    if (activeSection === 'produtos') {
      loadProducts();
    }
  }, [activeSection]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productsAPI.getAll(true); // incluir inativos
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const sections = [
    { id: 'status', name: 'Status Supabase', icon: <Database className="w-5 h-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <ChartBar className="w-5 h-5" /> },
    { id: 'produtos', name: 'Produtos', icon: <Gear className="w-5 h-5" /> },
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics do Site</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Visualizações</p>
              <p className="text-3xl font-bold">{(analytics?.totalViews || 0).toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Visualizações Hoje</p>
              <p className="text-3xl font-bold">{analytics?.dailyViews || 0}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Últimos Visitantes</p>
              <p className="text-3xl font-bold">{(analytics?.visitors?.length || 0)}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {analytics.visitors && analytics.visitors.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Visitas</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analytics.visitors.slice(-10).reverse().map((visitor, index) => {
              const visitDate = new Date(visitor.created_at || visitor.date);
              const browserInfo = visitor.user_agent ? visitor.user_agent.split(' ').slice(0, 3).join(' ') : 'Navegador desconhecido';
              
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {visitDate.toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {visitor.ip_address && visitor.ip_address !== 'unknown' && (
                        <span className="px-2 py-0.5 bg-[#005563] text-white text-xs rounded-full font-mono">
                          {visitor.ip_address}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate max-w-2xl">
                      {browserInfo}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCreateProduct = () => {
    setEditingProduct({
      name: '',
      description: '',
      category: '',
      image_url: '',
      features: [],
      active: true
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct.id) {
        // Atualizar produto existente
        await productsAPI.update(editingProduct.id, editingProduct);
        alert('Produto atualizado com sucesso!');
      } else {
        // Criar novo produto
        await productsAPI.create(editingProduct);
        alert('Produto criado com sucesso!');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      alert('Erro ao salvar produto: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await productsAPI.delete(productId);
        alert('Produto deletado com sucesso!');
        loadProducts();
      } catch (error) {
        alert('Erro ao deletar produto: ' + error.message);
      }
    }
  };

  const handleAddFeature = () => {
    setEditingProduct({
      ...editingProduct,
      features: [...(editingProduct.features || []), '']
    });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...editingProduct.features];
    newFeatures.splice(index, 1);
    setEditingProduct({
      ...editingProduct,
      features: newFeatures
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...editingProduct.features];
    newFeatures[index] = value;
    setEditingProduct({
      ...editingProduct,
      features: newFeatures
    });
  };

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h2>
        <div className="flex gap-3">
          <button
            onClick={handleCreateProduct}
            className="px-4 py-2 bg-[#FFD027] text-[#005563] rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
          >
            + Novo Produto
          </button>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004449] transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>
      
      {loadingProducts ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando produtos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                    {product.category && (
                      <span className="px-3 py-1 bg-[#FFD027] bg-opacity-20 text-[#005563] rounded-full text-xs font-semibold">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {product.features && product.features.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Características:</p>
                  <ul className="space-y-1">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-[#FFD027] rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 px-3 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004449] transition-colors text-sm font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loadingProducts && products.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Nenhum produto encontrado.</p>
        </div>
      )}

      {/* Modal de Edição/Criação */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsProductModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#005563] text-white p-6 rounded-t-xl">
              <h3 className="text-2xl font-bold">
                {editingProduct.id ? 'Editar Produto' : 'Novo Produto'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-[#005563]"
                  placeholder="Ex: Sistema PPR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-[#005563]"
                  placeholder="Ex: Água, Ar-Condicionado, Chassis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-[#005563]"
                  rows={4}
                  placeholder="Descrição completa do produto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem</label>
                <input
                  type="text"
                  value={editingProduct.image_url}
                  onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-[#005563]"
                  placeholder="/caminho/para/imagem.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
                <div className="space-y-2">
                  {(editingProduct.features || []).map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-[#005563]"
                        placeholder="Ex: Kit Chuveiro Tê Misturador"
                      />
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddFeature}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                  >
                    + Adicionar Característica
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={editingProduct.active}
                  onChange={(e) => setEditingProduct({...editingProduct, active: e.target.checked})}
                  className="w-5 h-5 text-[#005563] border-gray-300 rounded focus:ring-[#005563]"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Produto Ativo
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-xl flex gap-3">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProduct}
                className="flex-1 px-4 py-3 bg-[#FFD027] text-[#005563] rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-[#005563] transition-colors"
                  rows={4}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleContentChange(sectionId, field, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-[#005563] transition-colors"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#005563] shadow-lg border-b border-[#004449]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-100 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Site
              </button>
              <h1 className="text-2xl font-bold text-white">
                Painel Administrativo - BRASPEX
              </h1>
              {/* Status da conexão com Supabase */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-[#FFD027]' : 'bg-red-400'}`}></div>
                <span className="text-sm text-gray-200">
                  {isSupabaseConnected ? 'Supabase Conectado' : 'Modo Local'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {unsavedChanges && (
                <span className="text-sm text-[#FFD027] font-medium">
                  Alterações não salvas
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={!unsavedChanges}
                className="flex items-center px-4 py-2 bg-[#FFD027] text-[#005563] rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                <FloppyDisk className="w-4 h-4 mr-2" />
                Salvar
              </button>
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <ArrowCounterClockwise className="w-4 h-4 mr-2" />
                Reset
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
                        ? 'bg-[#005563] text-white border border-[#004449]'
                        : 'text-gray-700 hover:bg-gray-100'
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
              {activeSection === 'status' && <SupabaseStatusDashboard />}
              {activeSection === 'analytics' && renderAnalytics()}
              {activeSection === 'produtos' && renderProducts()}
              {activeSection !== 'analytics' && activeSection !== 'status' && activeSection !== 'produtos' && renderContentEditor(activeSection)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;