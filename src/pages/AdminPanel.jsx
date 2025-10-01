import React, { useState } from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Eye, Users, Calendar, ChartBar, FloppyDisk, ArrowCounterClockwise, ArrowLeft, SignOut, Gear } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import BaserowSetup from '../components/BaserowSetup';

const AdminPanel = ({ onLogout }) => {
  const { content, analytics, updateContent, resetContent, loading, isBaserowConnected } = useSiteContent();
  const [activeSection, setActiveSection] = useState('analytics');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  const sections = [
    { id: 'analytics', name: 'Analytics', icon: <ChartBar className="w-5 h-5" /> },
    { id: 'baserow', name: 'Configurar Baserow', icon: <Gear className="w-5 h-5" /> },
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
              {/* Status da conexão com Baserow */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isBaserowConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isBaserowConnected ? 'Baserow Conectado' : 'Modo Local'}
                </span>
              </div>
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
              {activeSection === 'baserow' && <BaserowSetup />}
              {activeSection !== 'analytics' && activeSection !== 'baserow' && renderContentEditor(activeSection)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;