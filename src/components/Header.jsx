import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Menu, Search, ShoppingCart, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoBraspexBranca from '../assets/logo-branca-braspex.png';
import { useCart } from '../contexts/CartContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { loadCategories, useCategoriesSync } from '../data/productsUtils';
import CartDrawer from './CartDrawer';

const HEADER_OFFSET = 92;

const getHeaderLabel = (value, fallback, legacyValues = []) => {
  const text = String(value || '').trim();
  if (!text || legacyValues.includes(text) || /[ÃÂ]/.test(text)) return fallback;
  return text;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState({});
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const location = useLocation();
  const navigate = useNavigate();
  const { content } = useSiteContent();
  const headerContent = content.header || {};

  useEffect(() => {
    const loadCats = async () => {
      const cats = await loadCategories();
      setCategories(cats || {});
    };

    loadCats();
  }, []);

  useCategoriesSync((updatedCategories) => {
    setCategories(updatedCategories || {});
  });

  const categoriesArray = useMemo(() => Object.values(categories), [categories]);
  const kitsMenuLabel = getHeaderLabel(headerContent.navKits, 'Nossos Kits', ['Kits', 'Produtos']);
  const quoteLabel = getHeaderLabel(headerContent.navRequestQuote, 'Orçamento');
  const mobileViewAllKitsLabel = getHeaderLabel(
    headerContent.mobileViewAllProducts,
    'Ver Todos os Kits',
    ['Ver Todos os Produtos']
  );

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setIsProductsOpen(false);
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    if (location.pathname !== '/') {
      sessionStorage.setItem('scrollToSection', sectionId);
      navigate('/');
      closeMenu();
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const tryScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        closeMenu();
      } else if (attempts < maxAttempts) {
        attempts += 1;
        window.setTimeout(tryScroll, 100);
      }
    };

    tryScroll();
  }, [closeMenu, location.pathname, navigate]);

  useEffect(() => {
    const pendingScroll = sessionStorage.getItem('scrollToSection');
    if (pendingScroll && location.pathname === '/') {
      sessionStorage.removeItem('scrollToSection');
      window.setTimeout(() => {
        scrollToSection(pendingScroll);
      }, 250);
    }
  }, [location.pathname, scrollToSection]);

  const selectCategory = (categoryId) => {
    closeMenu();
    navigate('/produtos');
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('selectCategory', { detail: categoryId }));
    }, 250);
  };

  const isKitCategory = (category) => {
    const text = `${category?.id || ''} ${category?.name || ''} ${category?.displayName || ''}`.toLowerCase();
    return text.includes('kit');
  };

  const openKitsGuide = () => {
    closeMenu();
    navigate('/produtos#aplicacao-kits');
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('selectCategory', { detail: 'kit' }));
      window.dispatchEvent(new Event('openKitGuide'));
    }, 250);
  };

  const navItems = [
    {
      label: getHeaderLabel(headerContent.navAbout, 'Sobre', ['Quem Somos']),
      onClick: () => scrollToSection('sobre')
    },
    {
      label: getHeaderLabel(headerContent.navBlog, 'Blog'),
      to: '/blog'
    },
    {
      label: getHeaderLabel(headerContent.navCatalogs, 'Catálogos'),
      to: '/catalogo-virtual'
    },
    {
      label: getHeaderLabel(headerContent.navContact, 'Fale Conosco', ['Contato']),
      onClick: () => scrollToSection('contato')
    }
  ];

  const moreLabel = (count) =>
    (headerContent.megaMenuMoreLabelTemplate || '+{count} mais').replace('{count}', String(count));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-[#FFD027] bg-[#007A86] text-white shadow-[0_10px_28px_rgba(0,31,38,0.22)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center" aria-label="Braspex">
            <img
              src={logoBraspexBranca}
              alt={headerContent.logoAlt || 'BRASPEX'}
              className="h-12 w-auto object-contain md:h-14"
            />
          </Link>

          <nav className="hidden h-full items-stretch xl:flex">
            <div
              className="relative flex h-full items-stretch"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button
                onClick={() => setIsProductsOpen((open) => !open)}
                className="flex h-full items-center gap-2 px-3 text-sm font-bold uppercase tracking-normal transition-colors hover:bg-[#00626d]"
                aria-expanded={isProductsOpen}
              >
                {kitsMenuLabel}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {isProductsOpen && (
                <div className="fixed left-0 right-0 top-20 border-b border-slate-200 bg-white text-slate-700 shadow-2xl">
                  <div className="mx-auto max-w-7xl px-8 py-8">
                    <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
                      {categoriesArray.slice(0, 4).map((category) => (
                        <div key={category.id} className="min-h-52 border-l border-slate-200 px-8 first:border-l-0">
                          <button
                            onClick={() => (isKitCategory(category) ? openKitsGuide() : selectCategory(category.id))}
                            className="mb-8 text-left font-display text-xl font-bold uppercase leading-none transition-opacity hover:opacity-75"
                            style={{ color: category.color || '#005563' }}
                          >
                            {category.displayName}
                          </button>

                          {category.subcategories?.length > 0 ? (
                            <div className="space-y-2.5">
                              {category.subcategories.slice(0, 4).map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => selectCategory(sub.id)}
                                  className="flex w-full items-center gap-2 text-left text-sm font-medium text-slate-600 transition-colors hover:text-[#007A86]"
                                >
                                  <span className="text-base leading-none text-[#007A86]">›</span>
                                  {sub.name}
                                </button>
                              ))}
                              {category.subcategories.length > 4 && (
                                <button
                                  onClick={() => selectCategory(category.id)}
                                  className="pl-5 text-sm font-bold text-[#005563] transition-colors hover:text-[#007A86]"
                                >
                                  {moreLabel(category.subcategories.length - 4)}
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => selectCategory(category.id)}
                              className="text-sm font-medium text-slate-600 transition-colors hover:text-[#007A86]"
                            >
                              Ver kits
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mx-auto mt-8 flex max-w-4xl items-center justify-between border border-slate-200 bg-slate-50">
                      <button
                        onClick={() => setIsCartOpen(true)}
                        className="px-8 py-3 text-left font-display text-xl font-medium text-slate-400"
                      >
                        Faça seu orçamento ON-LINE
                      </button>
                      <Link
                        to="/produtos#aplicacao-kits"
                        onClick={closeMenu}
                        className="bg-slate-500 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#007A86]"
                      >
                        Clique e conheça os kits Braspex
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMenu}
                  className="flex h-full items-center px-3 text-sm font-semibold uppercase tracking-normal transition-colors hover:bg-[#00626d]"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex h-full items-center px-3 text-sm font-semibold uppercase tracking-normal transition-colors hover:bg-[#00626d]"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 border border-white/45 px-4 py-2 text-sm font-bold uppercase text-white transition-colors hover:border-[#FFD027] hover:text-[#FFD027]"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
              {cartCount > 0 ? `${quoteLabel} (${cartCount})` : quoteLabel}
            </button>
            <Link
              to="/produtos"
              onClick={closeMenu}
              className="hidden h-10 w-10 items-center justify-center transition-colors hover:text-[#FFD027] sm:flex"
              aria-label="Buscar kits"
            >
              <Search className="h-7 w-7" strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center transition-colors hover:text-[#FFD027]"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/15 bg-white text-slate-800 xl:hidden">
            <div className="px-5 py-4">
              {isMenuOpen && (
                <div className="mb-4 border-b border-slate-200 pb-4">
                  <button
                    onClick={() => setIsProductsOpen((open) => !open)}
                    className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-bold uppercase text-[#007A86] transition-colors hover:bg-slate-50"
                    aria-expanded={isProductsOpen}
                  >
                    {kitsMenuLabel}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isProductsOpen && (
                    <div className="mt-2 space-y-1">
                      {categoriesArray.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => (isKitCategory(category) ? openKitsGuide() : selectCategory(category.id))}
                          className="block w-full px-3 py-2 text-left text-sm font-semibold uppercase text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#007A86]"
                        >
                          {category.displayName}
                        </button>
                      ))}
                      <Link
                        to="/produtos"
                        onClick={closeMenu}
                        className="block px-3 py-2 text-sm font-bold uppercase text-[#005563] transition-colors hover:bg-slate-50"
                      >
                        {mobileViewAllKitsLabel}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {isMenuOpen && (
                <nav className="space-y-1">
                  {navItems.map((item) =>
                    item.to ? (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={closeMenu}
                        className="block px-3 py-3 text-sm font-semibold uppercase text-[#005563] transition-colors hover:bg-slate-50"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={item.label}
                        onClick={item.onClick}
                        className="block w-full px-3 py-3 text-left text-sm font-semibold uppercase text-[#005563] transition-colors hover:bg-slate-50"
                      >
                        {item.label}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => {
                      closeMenu();
                      setIsCartOpen(true);
                    }}
                    className="mt-3 flex w-full items-center gap-2 bg-[#FFD027] px-3 py-3 text-left text-sm font-bold uppercase text-[#005563] transition-colors hover:bg-[#FFB800]"
                  >
                    <ShoppingCart className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
                    {cartCount > 0 ? `${quoteLabel} (${cartCount})` : quoteLabel}
                  </button>
                </nav>
              )}
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
