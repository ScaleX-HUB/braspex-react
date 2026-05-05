import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ShoppingCart, Home, Info, Package, BookUser, Newspaper, Mail, FileText } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import logoBraspex from '../assets/logo-braspex.png';
import logoBraspexBranca from '../assets/logo-branca-braspex.png';
import { useCart } from '../contexts/CartContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { loadCategories, useCategoriesSync } from '../data/productsUtils';
import CartDrawer from './CartDrawer';

// Mapeamento de ícones disponíveis (lucide-react)
import * as LucideIcons from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState({});
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const location = useLocation();
  const { content } = useSiteContent();
  const headerContent = content.header;

  const moreLabel = (count) =>
    (headerContent?.megaMenuMoreLabelTemplate || '+{count} mais').replace('{count}', String(count));

  // Detectar se estamos em páginas com fundo claro (não é a home)
  const isLightBackground = location.pathname !== '/';
  
  // Cores do texto baseado no estado
  const textColorClass = (isScrolled || isLightBackground) ? 'text-[#005563] hover:text-[#FFD027]' : 'text-white hover:text-[#FFD027]';
  const bgClass = (isScrolled || isLightBackground) ? 'bg-white shadow-md' : 'bg-transparent';

  // Carregar categorias do Supabase
  useEffect(() => {
    const loadCats = async () => {
      console.log('🏁 HEADER: Carregando categorias do Supabase...');
      const cats = await loadCategories();
      console.log('✅ HEADER: Categorias carregadas:', cats);
      setCategories(cats);
    };
    loadCats();
  }, []);

  // Log quando categories mudar
  useEffect(() => {
    console.log('🔄 HEADER: Estado categories atualizado:', categories);
    console.log('📊 Número de categorias no estado:', Object.keys(categories).length);
  }, [categories]);

  // Sincronizar categorias
  useCategoriesSync((updatedCategories) => {
    console.log('🔔 HEADER RECEBEU ATUALIZAÇÃO DE CATEGORIAS:', updatedCategories);
    console.log('📊 Número de categorias:', Object.keys(updatedCategories).length);
    setCategories(updatedCategories);
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProductsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Verificar se há uma seção pendente para scroll após redirecionamento
  useEffect(() => {
    const pendingScroll = sessionStorage.getItem('scrollToSection');
    if (pendingScroll && location.pathname === '/') {
      sessionStorage.removeItem('scrollToSection');
      setTimeout(() => {
        scrollToSection(pendingScroll);
      }, 300);
    }
  }, [location]);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      sessionStorage.setItem('scrollToSection', sectionId);
      window.location.href = '/';
      return;
    }
    
    let attempts = 0;
    const maxAttempts = 10;
    const tryScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        closeMenu();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryScroll, 100);
      }
    };
    tryScroll();
  };

  // Função para renderizar ícone dinamicamente
  const renderIcon = (iconName, size = 24) => {
    if (!iconName) return <Package size={size} />;
    
    // Mapear nomes do phosphor para lucide quando divergem
    const nameMap = { Fire: 'Flame', Lightning: 'Zap', Drop: 'Droplets', Gear: 'Settings', Cube: 'Box' };
    const lucideName = nameMap[iconName] || iconName;
    const IconComponent = LucideIcons[lucideName];
    if (IconComponent) {
      return <IconComponent size={size} />;
    }
    return <Package size={size} />;
  };

  const categoriesArray = Object.values(categories);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <img 
                src={(isScrolled || isLightBackground) ? logoBraspex : logoBraspexBranca} 
                alt={headerContent?.logoAlt || 'BRASPEX'} 
                className="h-12 md:h-14 object-contain transition-all duration-300"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <a href="/" className={`text-sm font-semibold transition-colors flex items-center gap-2 ${textColorClass}`}>
                <Home size={18} />
                {headerContent?.navHome || 'Home'}
              </a>

              <button 
                onClick={() => scrollToSection('sobre')}
                className={`text-sm font-semibold transition-colors flex items-center gap-2 ${textColorClass}`}
              >
                <Info size={18} />
                {headerContent?.navAbout || 'Sobre'}
              </button>

              {/* Mega Menu Produtos */}
              <div 
                className="relative"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <button 
                  onClick={() => { scrollToSection('vantagens'); setIsProductsOpen(!isProductsOpen); }}
                  className={`text-sm font-semibold transition-colors flex items-center gap-2 ${textColorClass}`}
                >
                  <Package size={18} />
                  {headerContent?.navProducts || 'KITS'}
                  <ChevronDown size={14} className={`transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown */}
                {isProductsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-screen max-w-4xl">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categoriesArray.map((category) => (
                          <Link
                            key={category.id}
                            to="/produtos"
                            onClick={() => {
                              // Usar timeout para garantir que a página carregue antes de selecionar
                              setTimeout(() => {
                                const event = new CustomEvent('selectCategory', { detail: category.id });
                                window.dispatchEvent(event);
                              }, 100);
                            }}
                            className="group p-4 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                          >
                            <div className="flex flex-col items-center text-center gap-3">
                              {/* Ícone da Categoria */}
                              <div 
                                className="w-16 h-16 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                                style={{ backgroundColor: `${category.color}20` }}
                              >
                                <span style={{ color: category.color }}>
                                  {renderIcon(category.icon, 32)}
                                </span>
                              </div>

                              {/* Nome da Categoria */}
                              <div>
                                <h3 
                                  className="font-bold text-sm mb-1 transition-colors"
                                  style={{ color: category.color }}
                                >
                                  {category.displayName}
                                </h3>
                                
                                {/* Subcategorias */}
                                {category.subcategories && category.subcategories.length > 0 && (
                                  <div className="text-xs text-gray-500 space-y-1">
                                    {category.subcategories.slice(0, 3).map((sub) => (
                                      <div key={sub.id}>{sub.name}</div>
                                    ))}
                                    {category.subcategories.length > 3 && (
                                      <div className="text-[#005563] font-medium">{moreLabel(category.subcategories.length - 3)}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}

                        {/* Link "Ver Todos" */}
                        <Link
                          to="/produtos"
                          className="group p-4 rounded-lg bg-[#005563] hover:bg-[#004450] transition-all flex items-center justify-center"
                        >
                          <div className="text-center text-white">
                            <Package size={32} className="mx-auto mb-2" />
                            <div className="font-bold">{headerContent?.megaMenuViewAllTitle || 'Ver Todos'}</div>
                            <div className="text-xs opacity-90">{headerContent?.megaMenuViewAllSubtitle || 'os Produtos'}</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => scrollToSection('contato')}
                className={`text-sm font-semibold transition-colors flex items-center gap-2 ${textColorClass}`}
              >
                <BookUser size={18} />
                {headerContent?.navContact || 'Contato'}
              </button>

              <a href="/blog" className={`text-sm font-semibold transition-colors flex items-center gap-2 ${textColorClass}`}>
                <Newspaper size={18} />
                {headerContent?.navBlog || 'Blog'}
              </a>

              <a href="/catalogo-virtual" className={`text-sm font-semibold transition-colors flex items-center gap-2 ${textColorClass}`}>
                <FileText size={18} />
                {headerContent?.navCatalogs || 'Catálogos'}
              </a>

              {/* Carrinho */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-[#FFD027] hover:bg-[#FFB800] transition-colors"
              >
                <ShoppingCart size={22} className="text-[#005563]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Botão Enviar Orçamento */}
              <button
                onClick={() => window.location.href = '/#contato'}
                className="px-4 py-2 bg-[#FFD027] text-[#005563] text-sm font-bold rounded-lg hover:bg-[#FFB800] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Mail size={18} />
                {headerContent?.navRequestQuote || 'Enviar Orçamento'}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-[#FFD027] hover:bg-[#FFB800] transition-colors"
              >
                <ShoppingCart size={20} className="text-[#005563]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleMenu}
                className={`p-2 rounded-lg transition-colors ${textColorClass}`}
              >
                {isMenuOpen ? (
                  <X size={28} />
                ) : (
                  <Menu size={28} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <nav className="px-6 py-4 space-y-2">
              <a href="/" onClick={closeMenu} className="block py-3 text-[#005563] hover:text-[#FFD027] font-semibold transition-colors">
                {headerContent?.navHome || 'Home'}
              </a>
              <button onClick={() => { scrollToSection('sobre'); }} className="block w-full text-left py-3 text-[#005563] hover:text-[#FFD027] font-semibold transition-colors">
                {headerContent?.navAbout || 'Sobre'}
              </button>
              
              {/* Mobile Products Dropdown */}
              <div>
                <button 
                  onClick={() => { scrollToSection('vantagens'); setIsProductsOpen(!isProductsOpen); }}
                  className="flex items-center justify-between w-full py-3 text-[#005563] hover:text-[#FFD027] font-semibold transition-colors"
                >
                  {headerContent?.navProducts || 'KITS'}
                  <ChevronDown size={16} className={`transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProductsOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    {categoriesArray.map((category) => (
                      <Link
                        key={category.id}
                        to={`/produtos?categoria=${category.id}`}
                        onClick={closeMenu}
                        className="flex items-center gap-3 py-2 text-gray-700 hover:text-[#005563] transition-colors"
                      >
                        <span style={{ color: category.color }}>
                          {renderIcon(category.icon, 20)}
                        </span>
                        {category.displayName}
                      </Link>
                    ))}
                    <Link
                      to="/produtos"
                      onClick={closeMenu}
                      className="flex items-center gap-3 py-2 text-[#005563] hover:text-[#FFD027] font-semibold transition-colors"
                    >
                      <Package size={20} />
                      {headerContent?.mobileViewAllProducts || 'Ver Todos os Produtos'}
                    </Link>
                  </div>
                )}
              </div>

              <button onClick={() => { scrollToSection('contato'); }} className="block w-full text-left py-3 text-[#005563] hover:text-[#FFD027] font-semibold transition-colors">
                {headerContent?.navContact || 'Contato'}
              </button>
              <a href="/blog" onClick={closeMenu} className="block py-3 text-[#005563] hover:text-[#FFD027] font-semibold transition-colors">
                {headerContent?.navBlog || 'Blog'}
              </a>

              <a href="/catalogo-virtual" onClick={closeMenu} className="block py-3 text-[#005563] hover:text-[#FFD027] font-semibold transition-colors">
                {headerContent?.navCatalogs || 'Catálogos'}
              </a>
              
              {/* Enviar Orçamento Mobile */}
              <button 
                onClick={() => { 
                  closeMenu();
                  window.location.href = '/#contato';
                }}
                className="flex items-center gap-3 py-3 px-4 mt-2 bg-[#FFD027] text-[#005563] font-bold rounded-lg hover:bg-[#FFB800] transition-all shadow-md w-full"
              >
                <Mail size={20} />
                {headerContent?.navRequestQuote || 'Enviar Orçamento'}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
