import React, { createContext, useContext, useState, useEffect } from 'react';

const SectionOrderContext = createContext();

export const useSectionOrder = () => {
  const context = useContext(SectionOrderContext);
  if (!context) {
    throw new Error('useSectionOrder must be used within a SectionOrderProvider');
  }
  return context;
};

// Ordem padrão das seções
const DEFAULT_SECTION_ORDER = [
  { id: 'hero', name: 'Hero Principal', component: 'Hero', enabled: true },
  { id: 'sobre', name: 'Sobre Nós', component: 'Sobre', enabled: true },
  { id: 'products-showcase', name: 'Produtos em Destaque', component: 'ProductsShowcase', enabled: true },
  { id: 'vantagens', name: 'Por que escolher os Kits BRASPEX?', component: 'Vantagens', enabled: true },
  { id: 'kits-showcase', name: 'Galeria de Kits', component: 'KitsShowcase', enabled: true },
  { id: 'parceiros', name: 'Parceiros de Confiança', component: 'Parceiros', enabled: true },
  { id: 'comparacao', name: 'Comparação de Produtos', component: 'Comparacao', enabled: true },
  { id: 'fluxo', name: 'Fluxo de Execução', component: 'Fluxo', enabled: true },
  { id: 'contato', name: 'Contato', component: 'Contato', enabled: true },
];

export const SectionOrderProvider = ({ children }) => {
  const [sectionOrder, setSectionOrder] = useState(() => {
    // Tentar carregar do localStorage
    const saved = localStorage.getItem('braspex_section_order');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar ordem das seções:', e);
        return DEFAULT_SECTION_ORDER;
      }
    }
    return DEFAULT_SECTION_ORDER;
  });

  // Função para salvar manualmente
  const saveSectionOrder = async () => {
    return new Promise((resolve) => {
      localStorage.setItem('braspex_section_order', JSON.stringify(sectionOrder));
      resolve();
    });
  };

  const updateSectionOrder = (newOrder) => {
    setSectionOrder(newOrder);
  };

  const toggleSectionEnabled = (sectionId) => {
    setSectionOrder(prev => {
      const newOrder = prev.map(section => 
        section.id === sectionId 
          ? { ...section, enabled: !section.enabled }
          : section
      );
      // Salvar automaticamente após toggle
      localStorage.setItem('braspex_section_order', JSON.stringify(newOrder));
      return newOrder;
    });
  };

  const moveSectionUp = (index) => {
    if (index === 0) return; // Já está no topo
    setSectionOrder(prev => {
      const newOrder = [...prev];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      // Salvar automaticamente após mover
      localStorage.setItem('braspex_section_order', JSON.stringify(newOrder));
      return newOrder;
    });
  };

  const moveSectionDown = (index) => {
    if (index === sectionOrder.length - 1) return; // Já está no final
    setSectionOrder(prev => {
      const newOrder = [...prev];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      // Salvar automaticamente após mover
      localStorage.setItem('braspex_section_order', JSON.stringify(newOrder));
      return newOrder;
    });
  };

  const getEnabledSections = () => {
    return sectionOrder.filter(section => section.enabled);
  };

  return (
    <SectionOrderContext.Provider
      value={{
        sectionOrder,
        updateSectionOrder,
        toggleSectionEnabled,
        moveSectionUp,
        moveSectionDown,
        saveSectionOrder,
        getEnabledSections,
      }}
    >
      {children}
    </SectionOrderContext.Provider>
  );
};
