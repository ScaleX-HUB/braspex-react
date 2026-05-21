import React, { createContext, useContext, useEffect, useState } from 'react';

const SectionOrderContext = createContext();

export const useSectionOrder = () => {
  const context = useContext(SectionOrderContext);
  if (!context) {
    throw new Error('useSectionOrder must be used within a SectionOrderProvider');
  }
  return context;
};

const STORAGE_KEY = 'braspex_section_order';

const DEFAULT_SECTION_ORDER = [
  { id: 'hero', name: 'Hero Principal', component: 'Hero', enabled: true },
  { id: 'sobre', name: 'Sobre Nos', component: 'Sobre', enabled: true },
  { id: 'products-showcase', name: 'Produtos em Destaque', component: 'ProductsShowcase', enabled: true },
  { id: 'kits-showcase', name: 'Nossos Kits', component: 'KitsShowcase', enabled: true },
  { id: 'vantagens', name: 'Comparacao de Prazo', component: 'Vantagens', enabled: true },
  { id: 'parceiros', name: 'Parceiros de Confianca', component: 'Parceiros', enabled: true },
  { id: 'contato', name: 'Contato', component: 'Contato', enabled: true },
];

const DEFAULT_SECTION_BY_ID = new Map(DEFAULT_SECTION_ORDER.map((section) => [section.id, section]));

const reconcileSectionOrder = (savedOrder) => {
  if (!Array.isArray(savedOrder)) return DEFAULT_SECTION_ORDER;

  const cleaned = savedOrder
    .map((section) => {
      const current = DEFAULT_SECTION_BY_ID.get(section?.id);
      if (!current) return null;

      return {
        ...current,
        enabled: section.enabled !== false,
      };
    })
    .filter(Boolean);

  const knownIds = new Set(cleaned.map((section) => section.id));
  const missing = DEFAULT_SECTION_ORDER.filter((section) => !knownIds.has(section.id));

  return [...cleaned, ...missing];
};

export const SectionOrderProvider = ({ children }) => {
  const [sectionOrder, setSectionOrder] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_SECTION_ORDER;

    try {
      return reconcileSectionOrder(JSON.parse(saved));
    } catch (error) {
      console.error('Erro ao carregar ordem das secoes:', error);
      return DEFAULT_SECTION_ORDER;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  const saveSectionOrder = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sectionOrder));
  };

  const updateSectionOrder = (newOrder) => {
    setSectionOrder(reconcileSectionOrder(newOrder));
  };

  const toggleSectionEnabled = (sectionId) => {
    setSectionOrder((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;

    setSectionOrder((prev) => {
      const newOrder = [...prev];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      return newOrder;
    });
  };

  const moveSectionDown = (index) => {
    if (index === sectionOrder.length - 1) return;

    setSectionOrder((prev) => {
      const newOrder = [...prev];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      return newOrder;
    });
  };

  const getEnabledSections = () => sectionOrder.filter((section) => section.enabled);

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
