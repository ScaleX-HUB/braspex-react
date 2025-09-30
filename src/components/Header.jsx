import React, { useState, useEffect } from 'react';
import { List, X, CaretDown, Drop, Fire, Wind, Gear, House, Info, Package, FlowArrow, AddressBook } from 'phosphor-react';
import logoBraspex from '../assets/logo-braspex.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // A altura do header é h-24, que corresponde a 96px.
      const offsetTop = element.offsetTop - 96; 
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    closeMenu();
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <nav className="max-w-6xl mx-auto px-5">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="nav-logo">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="cursor-pointer">
              <img 
                src={logoBraspex} 
                alt="BRASPEX Logo" 
                className="h-20 w-auto transition-transform duration-300 hover:scale-105"
              />
            </a>
          </div>

          {/* Container para Menu Desktop e Botão CTA */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Menu de Navegação */}
            <ul className="flex items-center space-x-8">
              <li>
                <button 
                  onClick={() => scrollToSection('home')} 
                  className={`flex items-center gap-2 font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-[#005563] hover:text-[#FFD027]' : 'text-white hover:text-[#FFD027]'
                  }`}
                >
                  <House className="w-4 h-4" />
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('sobre')} 
                  className={`flex items-center gap-2 font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-[#005563] hover:text-[#FFD027]' : 'text-white hover:text-[#FFD027]'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  Sobre
                </button>
              </li>
              <li className="relative group">
                <button 
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className={`flex items-center gap-2 font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-[#005563] hover:text-[#FFD027]' : 'text-white hover:text-[#FFD027]'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Nossos Kits
                  <CaretDown className="ml-1 h-4 w-4" />
                </button>
                <div 
                  className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ${
                    isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button onClick={() => scrollToSection('kit-agua')} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#005563] transition-colors duration-200 rounded-t-lg flex items-center gap-2">
                    <Drop className="w-4 h-4 text-blue-500" />
                    Água Fria e Quente
                  </button>
                  <button onClick={() => scrollToSection('kit-cozinha-gas')} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#005563] transition-colors duration-200 flex items-center gap-2">
                    <Fire className="w-4 h-4 text-red-500" />
                    Cozinha e Gás
                  </button>
                  <button onClick={() => scrollToSection('kit-ar')} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#005563] transition-colors duration-200 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-green-500" />
                    Ar-Condicionado
                  </button>
                  <button onClick={() => scrollToSection('kit-chassis')} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#005563] transition-colors duration-200 rounded-b-lg flex items-center gap-2">
                    <Gear className="w-4 h-4 text-gray-600" />
                    Chassis Metálicos
                  </button>
                </div>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('fluxo')} 
                  className={`flex items-center gap-2 font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-[#005563] hover:text-[#FFD027]' : 'text-white hover:text-[#FFD027]'
                  }`}
                >
                  <FlowArrow className="w-4 h-4" />
                  Fluxo de Execução
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contato')} 
                  className={`flex items-center gap-2 font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-[#005563] hover:text-[#FFD027]' : 'text-white hover:text-[#FFD027]'
                  }`}
                >
                  <AddressBook className="w-4 h-4" />
                  Contato
                </button>
              </li>
            </ul>

            {/* Botão CTA */}
            <button 
              onClick={() => scrollToSection('contato')}
              className="bg-[#FFD027] text-[#005563] px-6 py-3 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FFD027]/30 transition-all duration-300"
            >
              Solicitar Cotação
            </button>
          </div>

          {/* Botão do Menu Mobile */}
          <button 
            onClick={toggleMenu}
            className={`lg:hidden p-2 transition-colors duration-300 ${
              isScrolled ? 'text-[#005563]' : 'text-white'
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        <div className={`lg:hidden transition-all duration-300 bg-white ${
          isMenuOpen ? 'max-h-96 opacity-100 border-t' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <ul className="py-4 space-y-2">
            <li><button onClick={() => scrollToSection('home')} className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Home</button></li>
            <li><button onClick={() => scrollToSection('sobre')} className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Sobre</button></li>
            <li><button onClick={() => scrollToSection('kit-agua')} className="w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027] flex items-center gap-2">
              <Drop className="w-4 h-4 text-blue-500" />
              Água Fria e Quente
            </button></li>
            <li><button onClick={() => scrollToSection('kit-cozinha-gas')} className="w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027] flex items-center gap-2">
              <Fire className="w-4 h-4 text-red-500" />
              Cozinha e Gás
            </button></li>
            <li><button onClick={() => scrollToSection('kit-ar')} className="w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027] flex items-center gap-2">
              <Wind className="w-4 h-4 text-green-500" />
              Ar-Condicionado
            </button></li>
            <li><button onClick={() => scrollToSection('kit-chassis')} className="w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027] flex items-center gap-2">
              <Gear className="w-4 h-4 text-gray-600" />
              Chassis Metálicos
            </button></li>
            <li><button onClick={() => scrollToSection('fluxo')} className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Fluxo de Execução</button></li>
            <li><button onClick={() => scrollToSection('contato')} className="block w-full text-left px-4 py-2 text-[#005563] hover:text-[#FFD027]">Contato</button></li>
            <li className="pt-2 px-4">
              <button onClick={() => scrollToSection('contato')} className="w-full bg-[#FFD027] text-[#005563] px-6 py-3 rounded-lg font-semibold">Solicitar Cotação</button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;