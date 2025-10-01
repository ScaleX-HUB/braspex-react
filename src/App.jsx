import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Vantagens from './components/Vantagens';
import Parceiros from './components/Parceiros';
import Comparacao from './components/Comparacao';
import Kits from './components/Kits';
import Fluxo from './components/Fluxo';
import QRCodeSection from './components/QRCode';
import Contato from './components/Contato';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton'; // 1. Importe o componente aqui
import './App.css';

function App() {
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
        {/* <QRCodeSection /> */}
        <Contato />
      </main>
      <Footer />
      <WhatsAppButton /> {/* 2. Adicione o componente aqui, antes de fechar a div */}
    </div>
  );
}

export default App;