import React from 'react';
import { WhatsappLogo } from 'phosphor-react'; // Ícone para o WhatsApp

const WhatsAppButton = () => {
  // Coloque aqui o número de WhatsApp da sua empresa
  // Formato: código do país + DDD + número (tudo junto, sem espaços ou símbolos)
  const phoneNumber = '5581986431000'; 
  const message = 'Olá! Gostaria de solicitar uma cotação.';
  
  // A URL é construída dinamicamente com as variáveis acima
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
      title="Fale Conosco pelo WhatsApp"
    >
      <WhatsappLogo className="w-8 h-8" />
    </a>
  );
};

export default WhatsAppButton;