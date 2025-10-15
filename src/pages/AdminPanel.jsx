import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChartBar, 
  Article, 
  Users, 
  Package, 
  Gear, 
  TextAlignLeft,
  ArrowsDownUp,
  Database,
  Tag,
  EnvelopeSimple
} from 'phosphor-react';
import logoBraspex from '../assets/logo-braspex.png';

// Importar componentes modulares
import AnalyticsSection from '../components/admin/AnalyticsSection';
import SupabaseTestSection from '../components/admin/SupabaseTestSection';
import TextsEditorSection from '../components/admin/TextsEditorSection';
import SectionOrderManager from '../components/admin/SectionOrderManager';
import BlogManager from '../components/admin/BlogManager';
import ClientsSection from '../components/admin/ClientsSection';
import ProductsManager from '../components/admin/ProductsManager';
import CategoriesManager from '../components/admin/CategoriesManager';
import QuotesManager from '../components/admin/QuotesManager';

const AdminPanel = () => {
  const [activeMenu, setActiveMenu] = useState('page-management');
  const [activeSubsection, setActiveSubsection] = useState('section-order');
  const navigate = useNavigate();

  // Estrutura do menu principal
  const menuStructure = [
    {
      id: 'page-management',
      name: 'Página Principal',
      icon: <TextAlignLeft size={24} weight="bold" />,
      subsections: [
        { id: 'section-order', name: 'Ordem das Seções', icon: <ArrowsDownUp size={20} /> },
        { id: 'hero-edit', name: 'Editar Textos', icon: <TextAlignLeft size={20} /> }
      ]
    },
    {
      id: 'blog',
      name: 'Blog',
      icon: <Article size={24} weight="bold" />,
      subsections: []
    },
    {
      id: 'clients',
      name: 'Clientes',
      icon: <Users size={24} weight="bold" />,
      subsections: []
    },
    {
      id: 'quotes',
      name: 'Cotações',
      icon: <EnvelopeSimple size={24} weight="bold" />,
      subsections: []
    },
    {
      id: 'products',
      name: 'Produtos',
      icon: <Package size={24} weight="bold" />,
      subsections: [
        { id: 'products-list', name: 'Gerenciar Produtos', icon: <Package size={20} /> },
        { id: 'categories', name: 'Categorias', icon: <Tag size={20} /> }
      ]
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: <Gear size={24} weight="bold" />,
      subsections: [
        { id: 'analytics', name: 'Analytics', icon: <ChartBar size={20} /> },
        { id: 'supabase-test', name: 'Teste Supabase', icon: <Database size={20} /> }
      ]
    }
  ];

  const handleMenuClick = (menuId) => {
    const menu = menuStructure.find(m => m.id === menuId);
    setActiveMenu(menuId);
    
    // Se tem subseções, seleciona a primeira
    if (menu.subsections && menu.subsections.length > 0) {
      setActiveSubsection(menu.subsections[0].id);
    } else {
      setActiveSubsection(null);
    }
  };

  const renderContent = () => {
    // Admin subsections
    if (activeMenu === 'admin') {
      if (activeSubsection === 'analytics') {
        return <AnalyticsSection />;
      }
      if (activeSubsection === 'supabase-test') {
        return <SupabaseTestSection />;
      }
    }

    // Page Management subsections
    if (activeMenu === 'page-management') {
      if (activeSubsection === 'section-order') {
        return <SectionOrderManager />;
      }
      if (activeSubsection === 'hero-edit') {
        return <TextsEditorSection />;
      }
    }

    // Blog
    if (activeMenu === 'blog') {
      return <BlogManager />;
    }

    // Clients
    if (activeMenu === 'clients') {
      return <ClientsSection />;
    }

    // Quotes
    if (activeMenu === 'quotes') {
      return <QuotesManager />;
    }

    // Products
    if (activeMenu === 'products') {
      if (activeSubsection === 'products-list') {
        return <ProductsManager />;
      }
      if (activeSubsection === 'categories') {
        return <CategoriesManager />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img src={logoBraspex} alt="BRASPEX" className="h-12" />
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">Gerencie todo o conteúdo do site</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar ao Site
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Menu Principal */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            {menuStructure.map((menu) => (
              <div key={menu.id}>
                <button
                  onClick={() => handleMenuClick(menu.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                    activeMenu === menu.id
                      ? 'bg-[#005563] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {menu.icon}
                  <span>{menu.name}</span>
                </button>

                {/* Subseções */}
                {menu.subsections && menu.subsections.length > 0 && activeMenu === menu.id && (
                  <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                    {menu.subsections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubsection(sub.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeSubsection === sub.id
                            ? 'bg-[#005563]/10 text-[#005563]'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {sub.icon}
                        <span>{sub.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
