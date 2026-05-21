import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart2, 
  Newspaper, 
  Users, 
  Package, 
  FileText,
  Settings, 
  AlignLeft,
  ArrowUpDown,
  Database,
  Tag,
  Mail
} from 'lucide-react';
import logoBraspex from '../assets/logo-braspex.png';

// Importar componentes modulares
import AnalyticsSection from '../components/admin/AnalyticsSection';
import SupabaseTestSection from '../components/admin/SupabaseTestSection';
import TextsManager from '../components/admin/TextsManager';
import SectionOrderManager from '../components/admin/SectionOrderManager';
import BlogManager from '../components/admin/BlogManager';
import ClientsKanban from '../components/admin/ClientsKanban';
import ProductsManager from '../components/admin/ProductsManager';
import CategoriesManager from '../components/admin/CategoriesManagerSimple';
import QuotesManager from '../components/admin/QuotesManager';
import CatalogsManager from '../components/admin/CatalogsManager';

const AdminPanel = () => {
  const [activeMenu, setActiveMenu] = useState('page-management');
  const [activeSubsection, setActiveSubsection] = useState('section-order');
  const navigate = useNavigate();

  // Estrutura do menu principal
  const menuStructure = [
    {
      id: 'page-management',
      name: 'Página Principal',
      icon: <AlignLeft size={24} />,
      subsections: [
        { id: 'section-order', name: 'Ordem das Seções', icon: <ArrowUpDown size={20} /> },
        { id: 'hero-edit', name: 'Editar Conteudo', icon: <AlignLeft size={20} /> }
      ]
    },
    {
      id: 'blog',
      name: 'Blog',
      icon: <Newspaper size={24} />,
      subsections: []
    },
    {
      id: 'clients',
      name: 'Clientes',
      icon: <Users size={24} />,
      subsections: []
    },
    {
      id: 'quotes',
      name: 'Cotações',
      icon: <Mail size={24} />,
      subsections: []
    },
    {
      id: 'products',
      name: 'Produtos',
      icon: <Package size={24} />,
      subsections: [
        { id: 'products-list', name: 'Gerenciar Produtos', icon: <Package size={20} /> },
        { id: 'categories', name: 'Categorias', icon: <Tag size={20} /> }
      ]
    },
    {
      id: 'catalogs',
      name: 'Catálogos',
      icon: <FileText size={24} />,
      subsections: []
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: <Settings size={24} />,
      subsections: [
        { id: 'analytics', name: 'Analytics', icon: <BarChart2 size={20} /> },
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
        return <TextsManager />;
      }
    }

    // Blog
    if (activeMenu === 'blog') {
      return <BlogManager />;
    }

    // Clients
    if (activeMenu === 'clients') {
      return <ClientsKanban />;
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

    // Catalogs
    if (activeMenu === 'catalogs') {
      return <CatalogsManager />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <img src={logoBraspex} alt="BRASPEX" className="h-12" />
              <div className="hidden h-8 w-px bg-gray-300 sm:block"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">Gerencie todo o conteúdo do site</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
              Voltar ao Site
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Menu Principal */}
        <aside className="w-full border-b border-gray-200 bg-white lg:sticky lg:top-[73px] lg:min-h-[calc(100vh-73px)] lg:w-64 lg:border-b-0 lg:border-r">
          <nav className="flex gap-2 overflow-x-auto p-4 lg:block lg:space-y-2 lg:overflow-visible">
            {menuStructure.map((menu) => (
              <div key={menu.id} className="min-w-[190px] lg:min-w-0">
                <button
                  onClick={() => handleMenuClick(menu.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 font-semibold transition-all ${
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
