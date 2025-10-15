import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Envelope, Phone, MapPin, InstagramLogo } from 'phosphor-react';
import logoBraspexBranca from '../assets/logo-braspex.png';

const Footer = () => {
  const { content } = useSiteContent();
  const footerContent = content.footer;
  
  return (
  <footer className="bg-[#005563] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Coluna 1: Logo e Descrição */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
          <div className="flex justify-center md:justify-start w-full mb-4">
            <img 
              src={logoBraspexBranca}
              alt="BRASPEX Logo"
              className="h-16 w-auto object-contain brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md text-center md:text-left">
            {footerContent.description}
          </p>
        </div>

        {/* Coluna 2: Contato */}
        <div>
          <h4 className="text-lg font-bold text-[#FFD027] mb-4">Contato</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-center">
              <Envelope className="w-4 h-4 mr-2 text-gray-400" />
              <a href="mailto:braspexne@gmail.com" className="hover:text-white transition-colors">braspexne@gmail.com</a>
            </li>
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <a href="tel:+5581989635638" className="hover:text-white transition-colors">(81) 98963-5638</a>
            </li>
            <li className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
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
          <h4 className="text-lg font-bold text-[#FFD027] mb-4">Redes Sociais</h4>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/braspex.ne" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FFD027] transition-colors">
              <InstagramLogo className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center">
        <p className="text-sm font-light font-montserrat text-white mb-1">{footerContent.copyright}</p>
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