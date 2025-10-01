import React from 'react';
import parceiro1 from '../assets/parceiro1.png';
import parceiro2 from '../assets/parceiro2.png';
import parceria3 from '../assets/parceria3.png';
import parceria4 from '../assets/parceria4.png';
import parceria5 from '../assets/parceria5.png';

const Parceiros = () => {
  const parceiros = [
    { src: parceiro1, alt: "Parceiro 1" },
    { src: parceiro2, alt: "Parceiro 2" },
    { src: parceria3, alt: "Parceiro 3" },
    { src: parceria4, alt: "Parceiro 4" },
    { src: parceria5, alt: "Parceiro 5" }
  ];

  // Duplicar os parceiros para criar o efeito de loop infinito
  const duplicatedParceiros = [...parceiros, ...parceiros];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossos Parceiros
          </h2>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full"></div>
        </div>
        
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll space-x-12">
            {duplicatedParceiros.map((parceiro, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-48 h-32 flex items-center justify-center p-4"
              >
                <img
                  src={parceiro.src}
                  alt={parceiro.alt}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg font-poppins">
            Trabalhamos com os melhores fornecedores do mercado para garantir a qualidade dos nossos produtos.
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Parceiros;
