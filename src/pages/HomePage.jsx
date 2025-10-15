import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Sobre from '../components/Sobre';
import ProductsShowcase from '../components/ProductsShowcase';
import Vantagens from '../components/Vantagens';
import Parceiros from '../components/Parceiros';
import Comparacao from '../components/Comparacao';
import Fluxo from '../components/Fluxo';
import Contato from '../components/Contato';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { useSectionOrder } from '../contexts/SectionOrderContext';

const HomePage = () => {
  const { getEnabledSections } = useSectionOrder();
  const enabledSections = getEnabledSections();

  // Mapa de componentes
  const componentMap = {
    'Hero': Hero,
    'Sobre': Sobre,
    'ProductsShowcase': ProductsShowcase,
    'Vantagens': Vantagens,
    'Parceiros': Parceiros,
    'Comparacao': Comparacao,
    'Fluxo': Fluxo,
    'Contato': Contato
  };

  return (
    <div className="App">
      <Header />
      <main>
        {enabledSections.map((section) => {
          const Component = componentMap[section.component];
          return Component ? <Component key={section.id} /> : null;
        })}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default HomePage;