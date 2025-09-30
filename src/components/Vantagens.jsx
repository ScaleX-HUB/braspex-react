import React from 'react';
import { 
  Lock, 
  Lightning, 
  Ruler, 
  Factory, 
  Wrench, 
  Recycle, 
  Users, 
  Target 
} from 'phosphor-react';

const Vantagens = () => {
  const vantagens = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Segurança e Rastreabilidade",
      description: "Todos os componentes são rastreáveis e seguros"
    },
    {
      icon: <Lightning className="w-8 h-8" />,
      title: "Agilidade",
      description: "Instalação até 3x mais rápida que sistemas convencionais"
    },
    {
      icon: <Ruler className="w-8 h-8" />,
      title: "Padronização",
      description: "Todos os kits seguem altura e posicionamento de projeto"
    },
    {
      icon: <Factory className="w-8 h-8" />,
      title: "Qualidade em Fábrica",
      description: "Montagem controlada e testada antes da entrega"
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Menos Retrabalho",
      description: "Reduz erros de instalação e improvisos em campo"
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Redução de Desperdícios",
      description: "Cortes exatos, sem sobras ou perdas"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Otimização de Mão de Obra",
      description: "Montagem facilitada com suporte técnico completo"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Suporte Técnico",
      description: "Desde a concepção até a entrega"
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Vantagens dos Kits Braspex
          </h2>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vantagens.map((vantagem, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#005563] to-[#007A8A] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-white">
                  {vantagem.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                {vantagem.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {vantagem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vantagens;
