import React from 'react';
import { 
  Lock, 
  Lightning, 
  Factory, 
  Target 
} from 'phosphor-react';

const Vantagens = () => {
  const steps = [
    {
      icon: <Factory className="w-7 h-7" />,
      title: "Qualidade em Fábrica",
      description: "Montagem controlada e testada antes da entrega"
    },
    {
      icon: <Lock className="w-7 h-7" />,
      title: "Segurança e Rastreabilidade",
      description: "Todos os componentes são rastreáveis e seguros"
    },
    {
      icon: <Lightning className="w-7 h-7" />,
      title: "Agilidade",
      description: "Instalação até 3x mais rápida que sistemas convencionais"
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Suporte Técnico",
      description: "Do projeto à entrega, com suporte completo"
    }
  ];

  return (
    <section id="vantagens" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Vantagens dos Kits Braspex
          </h2>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full"></div>
        </div>
        
        {/* Fluxo Linear */}
        <div className="flex flex-col md:flex-row items-start justify-center gap-16 md:gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-sm relative px-8">
              
              {/* Ícone em círculo */}
              <div className="w-24 h-24 flex items-center justify-center bg-[#120229] rounded-full text-white mb-6 transition-all duration-300 hover:scale-110 hover:bg-[#FFD027] hover:text-[#120229] hover:shadow-xl cursor-pointer group">
                <div className="transition-transform duration-300 group-hover:rotate-12">
                  {React.cloneElement(step.icon, { className: "w-10 h-10" })}
                </div>
              </div>

              {/* Título e descrição */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {step.description}
              </p>

              {/* Linha de conexão (apenas desktop) - alinhada com o centro das bolas */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(100%-2rem)] w-16 h-[3px] bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vantagens;
