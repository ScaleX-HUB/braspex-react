import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Vantagens from '../components/Vantagens';
import Parceiros from '../components/Parceiros';
import Comparacao from '../components/Comparacao';
import Kits from '../components/Kits';
import Fluxo from '../components/Fluxo';
import Contato from '../components/Contato';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const HomePage = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Vantagens />
        <Parceiros />
        <Comparacao />
        <Kits />
        <Fluxo />
        <Contato />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default HomePage;