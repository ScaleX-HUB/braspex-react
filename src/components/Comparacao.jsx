import React, { useState, useEffect, useRef } from 'react';
import comparacaoImg from '../assets/comparacao-tradicionalxprazo.png';

const Comparacao = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const chartData = [
    {
      label: "Economia de mão de obra",
      value: 40,
      color: "bg-gradient-to-r from-green-400 to-green-600"
    },
    {
      label: "Menos dias no cronograma",
      value: 10,
      color: "bg-gradient-to-r from-blue-400 to-blue-600"
    },
    {
      label: "Redução de perdas",
      value: 80,
      color: "bg-gradient-to-r from-yellow-400 to-yellow-600"
    },
    {
      label: "Menos retrabalho",
      value: 90,
      color: "bg-gradient-to-r from-red-400 to-red-600"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comparação de Prazo
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold">
            <span className="text-gray-600">TRADICIONAL</span>
            <span className="mx-4 text-[#FFD027] font-bold">VS</span>
            <span className="text-[#005563]">KITS BRASPEX</span>
          </h3>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full mt-6"></div>
        </div>

        {/* Comparação lado a lado */}
        <div className="flex flex-col lg:flex-row items-stretch gap-12 mb-16">
          {/* Charts - Esquerda */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="space-y-6 h-full flex flex-col justify-center">
              {chartData.map((item, index) => (
                <div key={index} className="flex-1 min-h-[50px] flex flex-col justify-center transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 transition-colors duration-300 hover:text-[#FFD027]">
                      {item.label}
                    </h4>
                    <span className="text-2xl font-bold text-[#005563] transition-transform duration-300 hover:scale-110">
                      {item.value}%
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden transition-all duration-300 hover:h-4">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out hover:brightness-110`}
                      style={{
                        width: isVisible ? `${item.value}%` : '0%',
                        transitionDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Comparison - Direita */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="bg-white shadow-lg transition-transform duration-300 hover:scale-105 rounded-2xl overflow-hidden">
              <img
                src={comparacaoImg}
                alt="Comparação visual entre instalação tradicional e Kits BRASPEX"
                className="object-contain max-h-[450px] max-w-full border-2 border-[#FFD027] rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Texto explicativo */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed font-montserrat">
            Os Kits BRASPEX revolucionam a construção civil com processos industrializados 
            que garantem maior eficiência, qualidade superior e redução significativa de custos e prazos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Comparacao;
