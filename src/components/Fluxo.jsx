import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Gear, 
  Factory, 
  CheckCircle, 
  Truck, 
  Wrench 
} from 'phosphor-react';

const Fluxo = () => {
  const [activeStep, setActiveStep] = useState(1);

  // Removido o avanço automático

  const steps = [
    { 
      id: 1, 
      icon: <FileText className="w-7 h-7" />, 
      shortTitle: "Projeto", 
      content: { 
        title: "Recebimento do Projeto Executivo",
        timeframe: "2-3 dias úteis",
        description: "Nossa equipe técnica realiza uma análise detalhada do projeto executivo para compreender todas as especificações, requisitos técnicos e particularidades da obra.",
        items: [
          "Análise completa do projeto hidráulico",
          "Identificação de pontos críticos", 
          "Levantamento de materiais necessários",
          "Cronograma preliminar de execução"
        ]
      }
    },
    { 
      id: 2, 
      icon: <Gear className="w-7 h-7" />, 
      shortTitle: "Compatibilização", 
      content: { 
        title: "Compatibilização Técnica e Detalhamento",
        timeframe: "3-5 dias úteis",
        description: "Desenvolvimento personalizado dos kits conforme as necessidades específicas do projeto, garantindo total compatibilidade com os sistemas prediais.",
        items: [
          "Compatibilização com outros sistemas",
          "Detalhamento técnico dos kits",
          "Especificação de materiais",
          "Aprovação do cliente"
        ]
      }
    },
    { 
      id: 3, 
      icon: <Factory className="w-7 h-7" />, 
      shortTitle: "Produção", 
      content: { 
        title: "Produção em Fábrica",
        timeframe: "5-10 dias úteis",
        description: "Fabricação dos kits em ambiente controlado, seguindo rigorosos padrões de qualidade e utilizando equipamentos de última geração.",
        items: [
          "Ambiente controlado de produção",
          "Equipamentos de alta precisão",
          "Controle de qualidade contínuo",
          "Rastreabilidade de componentes"
        ]
      }
    },
    { 
      id: 4, 
      icon: <CheckCircle className="w-7 h-7" />, 
      shortTitle: "Testes", 
      content: { 
        title: "Teste de Montagem e Checklist",
        timeframe: "1-2 dias úteis",
        description: "Verificação completa de todos os componentes e teste de montagem para garantir perfeito funcionamento antes da entrega.",
        items: [
          "Teste de pressão hidráulica",
          "Verificação de conexões",
          "Checklist de qualidade",
          "Documentação técnica"
        ]
      }
    },
    { 
      id: 5, 
      icon: <Truck className="w-7 h-7" />, 
      shortTitle: "Entrega", 
      content: { 
        title: "Entrega Rastreável e Pronta",
        timeframe: "Conforme logística",
        description: "Kits prontos para instalação imediata, com embalagem adequada e sistema de rastreamento completo para acompanhamento da entrega.",
        items: [
          "Embalagem protegida e identificada",
          "Sistema de rastreamento",
          "Documentação completa",
          "Manual de instalação"
        ]
      }
    },
    { 
      id: 6, 
      icon: <Wrench className="w-7 h-7" />, 
      shortTitle: "Suporte", 
      content: { 
        title: "Suporte Técnico na Obra",
        timeframe: "Sob demanda",
        description: "Acompanhamento técnico especializado durante a instalação, quando necessário, garantindo a correta implementação dos kits.",
        items: [
          "Suporte técnico especializado",
          "Acompanhamento da instalação",
          "Resolução de dúvidas",
          "Garantia de funcionamento"
        ]
      }
    },
  ];

  const currentStep = steps.find(step => step.id === activeStep);

  return (
    <section id="fluxo" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Como Trabalhamos
          </h2>
          <div className="w-20 h-1 bg-[#FFD027] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nosso processo é estruturado para garantir máxima qualidade e eficiência em cada etapa.
          </p>
        </div>

        {/* Steps com linhas conectando */}
        <div className="hidden md:flex justify-between items-center mb-12 relative" style={{ minHeight: '9rem' }}>
          {/* Linha horizontal única conectando as bolas */}
          <div className="absolute h-px bg-gray-300 z-0" style={{ 
            left: 'calc(16.66% / 2)', 
            right: 'calc(16.66% / 2)', 
            top: '50%', 
            transform: 'translateY(-20px)' 
          }}></div>
          {steps.map((step) => (
            <div key={step.id} className="relative flex-1 flex justify-center">
              <button
                onClick={() => setActiveStep(step.id)}
                className={`flex flex-col items-center transition-all duration-300 relative z-10`}
              >
                <div
                  className={`flex flex-col items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    activeStep === step.id
                      ? 'w-36 h-36 bg-[#005563] border-[#005563] text-white shadow-xl scale-115'
                      : 'w-24 h-24 bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                  }`}
                >
                  {React.cloneElement(step.icon, {
                    className: activeStep === step.id ? "w-10 h-10 text-white mb-2" : "w-6 h-6 text-gray-500"
                  })}
                  
                  {/* Título dentro da bola quando ativa */}
                  {activeStep === step.id && (
                    <span className={`${step.shortTitle === 'Compatibilização' ? 'text-sm font-bold' : 'text-base font-bold'} text-white text-center leading-tight`}>
                      {step.shortTitle}
                    </span>
                  )}
                </div>
                {/* Label abaixo sempre */}
                <span className={`transition-all duration-300 ${
                  activeStep === step.id 
                    ? 'mt-6 text-lg font-bold text-gray-800' 
                    : 'mt-5 text-base font-semibold text-gray-600'
                }`}>
                  {step.shortTitle}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Versão Mobile - Grid com 2 colunas */}
        <div className="md:hidden grid grid-cols-2 gap-6 mb-12">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <button
                onClick={() => setActiveStep(step.id)}
                className={`flex flex-col items-center transition-all duration-300 relative z-10`}
              >
                <div
                  className={`flex flex-col items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    activeStep === step.id
                      ? 'w-20 h-20 bg-[#005563] border-[#005563] text-white shadow-xl scale-110'
                      : 'w-16 h-16 bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                  }`}
                >
                  {React.cloneElement(step.icon, {
                    className: activeStep === step.id ? "w-6 h-6 text-white" : "w-5 h-5 text-gray-500"
                  })}
                </div>
                {/* Label abaixo sempre no mobile */}
                <span className={`mt-3 text-center transition-all duration-300 ${
                  activeStep === step.id 
                    ? 'text-sm font-bold text-gray-800' 
                    : 'text-xs font-semibold text-gray-600'
                }`}>
                  {step.shortTitle}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Linha vertical fixa no meio do card */}
        <div className="flex justify-center mb-6">
          <div className="w-px h-12 bg-gray-300"></div>
        </div>

        {/* Card de conteúdo */}
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStep.content.title}
          </h3>
          <p className="text-[#FFD027] font-semibold text-lg mb-6">
            {currentStep.content.timeframe}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            {currentStep.content.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Fluxo;
