import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Envelope, Phone, MapPin, InstagramLogo, YoutubeLogo, FacebookLogo, LinkedinLogo } from 'phosphor-react';
import logoBraspexDark from '../assets/logo-braspex-dark.png'; // Usaremos esta versão do logo
import logoBraspexBranca from '../assets/logo-braspex.png';

const Footer = () => {
  const { content } = useSiteContent();
  const footerContent = content.footer;
  
  return (
  <footer className="bg-[#005563] text-white pt-16 pb-6">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Coluna 1: Logo e Descrição */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
          <div className="flex justify-center md:justify-start w-full">
            <div
                  className="logo-balloon flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-105"
                  style={{ 
                    minWidth: '240px', // mais largo
                    minHeight: '120px', // menos alto
                    borderRadius: '60px', // bordas bem arredondadas
                    border: '6px solid #fff', // cor branca igual ao texto
                    boxSizing: 'border-box',
                    background: '#fff', // preenchido por dentro
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
                  }}
            >
              <img 
                src={logoBraspexBranca}
                alt="BRASPEX Logo"
                className="h-20 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}
              />
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed max-w-md text-center md:text-left">
            {footerContent.description}
          </p>
        </div>

        {/* Coluna 2: Contato */}
        <div>
          <h4 className="text-xl font-bold text-[#FFD027] mb-6">Contato</h4>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-center">
              <Envelope className="w-5 h-5 mr-3 text-gray-400" />
              <a href="mailto:braspexne@gmail.com" className="hover:text-white transition-colors">braspexne@gmail.com</a>
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-gray-400" />
              <a href="tel:+5581989635638" className="hover:text-white transition-colors">(81) 98963-5638</a>
            </li>
            <li className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-gray-400 mt-1" />
              <span>
                R. Prof. Paes Leme, 50<br/>
                Piedade, Jaboatão dos Guararapes - PE<br/>
                CEP: 54400-460
              </span>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Redes Sociais */}
        <div>
          <h4 className="text-xl font-bold text-[#FFD027] mb-6">Redes Sociais</h4>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/braspex.ne" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FFD027] transition-colors">
              <InstagramLogo className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-16 pt-8 text-center">
        <p className="text-base font-light font-montserrat text-white mb-1">{footerContent.copyright}</p>
        <p className="mt-2 text-sm font-light font-montserrat text-[#FFD027]">
          Desenvolvido por <a href="https://www.linkedin.com/company/converseia" target="_blank" rel="noopener noreferrer" className="underline hover:text-white font-montserrat font-light">ConverseIA Tech</a>
        </p>
        <div className="mt-4">
          <a 
            href="/admin" 
            className="text-xs font-light font-montserrat text-gray-500 hover:text-gray-300 transition-colors opacity-50 hover:opacity-75"
            title="Painel Administrativo"
          >
            •
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;