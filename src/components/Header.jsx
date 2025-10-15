import React, { useState, useEffect } from 'react';
import { List, X, CaretDown, Drop, Fire, Wind, Gear, House, Info, Package, FlowArrow, AddressBook, Article, ShoppingCart } from 'phosphor-react';
import { useLocation } from 'react-router-dom';
import logoBraspex from '../assets/logo-braspex.png';
import logoBraspexBranca from '../assets/logo-branca-braspex.png';
import { useCart } from '../contexts/CartContext';
import CartDrawer from './CartDrawer';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const location = useLocation();

  // Detectar se estamos em páginas com fundo claro (não é a home)
  const isLightBackground = location.pathname !== '/';
  
  // Cores do texto baseado no estado
  const textColorClass = (isScrolled || isLightBackground) ? 'text-[#005563] hover:text-[#FFD027]' : 'text-white hover:text-[#FFD027]';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false); // Fechar dropdown também ao fechar menu mobile
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
      // Remover o item do sessionStorage
      sessionStorage.removeItem('scrollToSection');
      
      // Aguardar a página carregar completamente e fazer o scroll
      setTimeout(() => {
        scrollToSection(pendingScroll);
      }, 300);
    }
  }, [location]);

  const scrollToSection = (sectionId) => {
    // Se não estamos na home, redirecionar primeiro
    if (location.pathname !== '/') {
      // Guardar a seção alvo no sessionStorage
      sessionStorage.setItem('scrollToSection', sectionId);
      // Redirecionar para home
      window.location.href = '/';
      return;
    }

    // Para kits específicos, navegar para seção de kits e definir o carrossel
    if (sectionId.startsWith('kit-')) {
      const kitIndex = sectionId === 'kit-agua' ? 0 : sectionId === 'kit-ar' ? 1 : sectionId === 'kit-chassis' ? 2 : 0;
      
      // Disparar evento customizado para controlar o carrossel
      window.dispatchEvent(new CustomEvent('navigateToKit', { detail: { kitIndex } }));
      
      // Scroll para a seção de kits
      sectionId = 'kits';
    }
    
    let attempts = 0;
    const maxAttempts = 10;
    const tryScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop - 96;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        closeMenu();
        return;
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 100);
      }
    };
    tryScroll();
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isMenuOpen || isScrolled || isLightBackground ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo - Mais à esquerda */}
          <div className="nav-logo">
            <a href="/" className="cursor-pointer">
              <img 
                src={(isScrolled || isMenuOpen || isLightBackground) ? logoBraspex : logoBraspexBranca}
                alt="BRASPEX Logo" 
                className="h-14 lg:h-16 w-auto transition-transform duration-300 hover:scale-105"
              />
            </a>
          </div>

          {/* Container para Menu Desktop e Botão CTA */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Menu de Navegação - Letras menores */}
            <ul className="flex items-center space-x-6">
              <li>
                <a 
                  href="/"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${textColorClass}`}
                >
                  <House className="w-4 h-4" />
                  Home
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('sobre')} 
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${textColorClass}`}
                >
                  <Info className="w-4 h-4" />
                  Sobre
                </button>
              </li>
              <li>
                <a 
                  href="/produtos"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${textColorClass}`}
                >
                  <Package className="w-4 h-4" />
                  Produtos
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('fluxo')} 
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${textColorClass}`}
                >
                  <FlowArrow className="w-4 h-4" />
                  Fluxo de Execução
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contato')} 
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${textColorClass}`}
                >
                  <AddressBook className="w-4 h-4" />
                  Contato
                </button>
              </li>
              <li>
                <a
                  href="/blog"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${textColorClass}`}
                >
                  <Article className="w-4 h-4" />
                  Blog
                </a>
              </li>
            </ul>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-colors duration-300 ${textColorClass}`}
              title="Carrinho de Orçamento"
            >
              <ShoppingCart size={24} weight="bold" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFD027] text-[#005563] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Botão CTA */}
            <button 
              onClick={() => scrollToSection('contato')}
              className="bg-[#FFD027] text-[#005563] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#ffd942] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Solicitar Cotação
            </button>
          </div>

          {/* Botão do Menu Mobile */}
          <button 
            onClick={toggleMenu}
            className={`lg:hidden p-2 transition-colors duration-300 ${
              (isScrolled || isLightBackground) ? 'text-[#005563]' : 'text-white'
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>

        <div className={`lg:hidden transition-all duration-300 bg-white ${
          isMenuOpen ? 'max-h-[80vh] opacity-100 border-t overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <ul className="py-4 space-y-2">
            <li><a href="/" className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Home</a></li>
            <li><button onClick={() => scrollToSection('sobre')} className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Sobre</button></li>
            <li><a href="/produtos" className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Produtos</a></li>
            <li><button onClick={() => scrollToSection('fluxo')} className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Fluxo de Execução</button></li>
            <li><button onClick={() => scrollToSection('contato')} className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Contato</button></li>
            <li><a href="/blog" className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Blog</a></li>
            <li><button onClick={() => { setIsCartOpen(true); closeMenu(); }} className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Carrinho ({cartCount})</button></li>
            <li className="pt-2 px-4">
              <button onClick={() => scrollToSection('contato')} className="w-full bg-[#FFD027] text-[#005563] px-6 py-3 rounded-lg font-semibold">Solicitar Cotação</button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;