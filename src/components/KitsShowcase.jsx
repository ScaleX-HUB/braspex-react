import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';

const KitsShowcase = () => {
  const { content } = useSiteContent();
  const kitsShowcaseContent = content.kitsShowcase;

  const images = (() => {
    const parsed = safeJsonParse(kitsShowcaseContent?.imagesJson, null);
    return Array.isArray(parsed) && parsed.length
      ? parsed
      : [
          {
            id: 'kit-hidraulico',
            src: '/BRASPEX_kit_hidraulico_industrial.jpg',
            alt: 'Kit Hidráulico Industrial Braspex',
            title: 'Kit Hidráulico Industrial',
            description: 'Soluções robustas e eficientes para aplicações industriais de grande porte',
            badge: 'Em Destaque'
          },
          {
            id: 'tipos-kits',
            src: '/BRASPEX_kit_tipos.png',
            alt: 'Tipos de Kits Braspex',
            title: 'Variedade de Soluções',
            description: 'Diferentes tipos de kits para atender todas as necessidades da sua empresa',
            badge: 'Versátil'
          }
        ];
  })();

  const features = (() => {
    const parsed = safeJsonParse(kitsShowcaseContent?.featuresJson, null);
    return Array.isArray(parsed) && parsed.length
      ? parsed
      : [
          { emoji: '💧', title: 'Água Fria', description: 'Sistemas eficientes de distribuição e climatização' },
          { emoji: '🔥', title: 'Água Quente', description: 'Aquecimento de alta performance e economia' },
          { emoji: '❄️', title: 'Ar-Condicionado', description: 'Climatização inteligente e sustentável' }
        ];
  })();

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {kitsShowcaseContent?.title || 'Conheça Nossos Kits Industriais'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {kitsShowcaseContent?.subtitle || 'Soluções completas e integradas para sistemas de água fria, água quente e ar-condicionado'}
          </p>
        </div>

        {/* Grid de Imagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {images.slice(0, 2).map((img) => (
            <div key={img.id || img.src} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
              <div className="aspect-w-16 aspect-h-10">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 bg-gradient-to-t from-gray-50 to-white">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{img.title}</h3>
                <p className="text-gray-600 text-sm">{img.description}</p>
              </div>
              {!!img.badge && (
                <div className="absolute top-4 right-4 bg-[#005563] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {img.badge}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cards de Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {features.slice(0, 3).map((f, idx) => (
            <div key={f.title || idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="text-4xl mb-4 text-center">{f.emoji}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{f.title}</h3>
              <p className="text-gray-600 text-sm text-center">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Botão de CTA em Destaque */}
        <div className="text-center">
          <Link 
            to="/produtos" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#005563] hover:bg-[#003d47] text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-[#005563]/50 transform hover:scale-105 transition-all duration-300 group"
          >
            <svg 
              className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
            </svg>
            {kitsShowcaseContent?.ctaButtonText || 'Ver Todos os Kits Industriais'}
            <svg 
              className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          {/* Texto adicional abaixo do botão */}
          <p className="mt-6 text-gray-500 text-sm">
            {kitsShowcaseContent?.ctaSubtext || 'Explore nossa linha completa de produtos e encontre a solução ideal para sua empresa'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default KitsShowcase;
