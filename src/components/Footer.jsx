import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Envelope, Phone, MapPin, InstagramLogo, FacebookLogo, YoutubeLogo, LinkedinLogo } from 'phosphor-react';
import logoBraspexBranca from '../assets/logo-braspex.png';

const Footer = () => {
  const { content } = useSiteContent();
  const footerContent = content.footer || {};
  
  return (
    <footer className="bg-[#005563] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
          <div className="flex justify-center md:justify-start w-full mb-4">
            <img 
              src={logoBraspexBranca}
              alt={footerContent.logoAlt || 'BRASPEX Logo'}
              className="h-16 w-auto object-contain brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md text-center md:text-left">
            {footerContent.description || 'Soluções em equipamentos de proteção individual e segurança.'}
          </p>
          {footerContent.slogan && (
            <p className="text-[#FFD027] text-xs italic mt-2 text-center md:text-left">
              {footerContent.slogan}
            </p>
          )}
        </div>

        <div>
          <h4 className="text-lg font-bold text-[#FFD027] mb-4">{footerContent.contactTitle || 'Contato'}</h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            {footerContent.email && (
              <li className="flex items-center">
                <Envelope className="w-4 h-4 mr-2 text-gray-400" />
                <a href={'mailto:' + footerContent.email} className="hover:text-white transition-colors">
                  {footerContent.email}
                </a>
              </li>
            )}
            {footerContent.phone && (
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <a href={'tel:' + footerContent.phone.replace(/\D/g, '')} className="hover:text-white transition-colors">
                  {footerContent.phone}
                </a>
              </li>
            )}
            {footerContent.address && (
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                <span style={{ whiteSpace: 'pre-line' }}>
                  {footerContent.address}
                </span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-[#FFD027] mb-4">{footerContent.socialTitle || 'Redes Sociais'}</h4>
          <div className="flex space-x-4">
            {footerContent.facebook && (
              <a href={footerContent.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FFD027] transition-colors">
                <FacebookLogo className="w-6 h-6" />
              </a>
            )}
            {footerContent.instagram && (
              <a href={footerContent.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FFD027] transition-colors">
                <InstagramLogo className="w-6 h-6" />
              </a>
            )}
            {footerContent.linkedin && (
              <a href={footerContent.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FFD027] transition-colors">
                <LinkedinLogo className="w-6 h-6" />
              </a>
            )}
            {footerContent.youtube && (
              <a href={footerContent.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FFD027] transition-colors">
                <YoutubeLogo className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center">
        <p className="text-sm font-light font-montserrat text-white mb-1">
          {footerContent.copyright || ' 2025 Braspex. Todos os direitos reservados.'}
        </p>
        <p className="mt-2 text-sm font-light font-montserrat text-[#FFD027]">
          {footerContent.developedByPrefix || 'Desenvolvido por'}{' '}
          <a
            href={footerContent.developedByUrl || 'https://www.linkedin.com/company/converseia'}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white font-montserrat font-light"
          >
            {footerContent.developedByName || 'ConverseIA Tech'}
          </a>
        </p>
        <div className="mt-4">
          <a 
            href="/admin" 
            className="text-xs font-light font-montserrat text-gray-500 hover:text-gray-300 transition-colors opacity-50 hover:opacity-75"
            title={footerContent.adminTitle || 'Painel Administrativo'}
          >
            
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
