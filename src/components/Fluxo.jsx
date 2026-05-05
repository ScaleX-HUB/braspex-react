import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';
import { 
  FileText, 
  Settings, 
  Factory, 
  CheckCircle, 
  Truck, 
  Wrench 
} from 'lucide-react';

const Fluxo = () => {
  const { content } = useSiteContent();
  const fluxoContent = content.fluxo;
  
  const [activeStep, setActiveStep] = useState(1);

  const defaultStepsData = [
    {
      id: 1,
      shortTitle: "Projeto",
      title: "Recebimento do Projeto Executivo",
      timeframe: "2-3 dias úteis",
      description:
        "Nossa equipe técnica realiza uma análise detalhada do projeto executivo para compreender todas as especificações, requisitos técnicos e particularidades da obra.",
      items: [
        "Análise completa do projeto hidráulico",
        "Identificação de pontos críticos",
        "Levantamento de materiais necessários",
        "Cronograma preliminar de execução"
      ]
    },
    {
      id: 2,
      shortTitle: "Compatibilização",
      title: "Compatibilização Técnica e Detalhamento",
      timeframe: "3-5 dias úteis",
      description:
        "Desenvolvimento personalizado dos kits conforme as necessidades específicas do projeto, garantindo total compatibilidade com os sistemas prediais.",
      items: [
        "Compatibilização com outros sistemas",
        "Detalhamento técnico dos kits",
        "Especificação de materiais",
        "Aprovação do cliente"
      ]
    },
    {
      id: 3,
      shortTitle: "Produção",
      title: "Produção em Fábrica",
      timeframe: "5-10 dias úteis",
      description:
        "Fabricação dos kits em ambiente controlado, seguindo rigorosos padrões de qualidade e utilizando equipamentos de última geração.",
      items: [
        "Ambiente controlado de produção",
        "Equipamentos de alta precisão",
        "Controle de qualidade contínuo",
        "Rastreabilidade de componentes"
      ]
    },
    {
      id: 4,
      shortTitle: "Testes",
      title: "Teste de Montagem e Checklist",
      timeframe: "1-2 dias úteis",
      description:
        "Verificação completa de todos os componentes e teste de montagem para garantir perfeito funcionamento antes da entrega.",
      items: [
        "Teste de pressão hidráulica",
        "Verificação de conexões",
        "Checklist de qualidade",
        "Documentação técnica"
      ]
    },
    {
      id: 5,
      shortTitle: "Entrega",
      title: "Entrega Rastreável e Pronta",
      timeframe: "Conforme logística",
      description:
        "Kits prontos para instalação imediata, com embalagem adequada e sistema de rastreamento completo para acompanhamento da entrega.",
      items: [
        "Embalagem protegida e identificada",
        "Sistema de rastreamento",
        "Documentação completa",
        "Manual de instalação"
      ]
    },
    {
      id: 6,
      shortTitle: "Suporte",
      title: "Suporte Técnico na Obra",
      timeframe: "Sob demanda",
      description:
        "Acompanhamento técnico especializado durante a instalação, quando necessário, garantindo a correta implementação dos kits.",
      items: [
        "Suporte técnico especializado",
        "Acompanhamento da instalação",
        "Resolução de dúvidas",
        "Garantia de funcionamento"
      ]
    }
  ];

  const parsedSteps = safeJsonParse(fluxoContent?.stepsJson, null);
  const stepsData = Array.isArray(parsedSteps) ? parsedSteps : defaultStepsData;

  const iconById = {
    1: <FileText className="w-7 h-7" />,
    2: <Settings className="w-7 h-7" />,
    3: <Factory className="w-7 h-7" />,
    4: <CheckCircle className="w-7 h-7" />,
    5: <Truck className="w-7 h-7" />,
    6: <Wrench className="w-7 h-7" />
  };

  const steps = stepsData.map((s) => ({
    id: s.id,
    icon: iconById[s.id] || <FileText className="w-7 h-7" />,
    shortTitle: s.shortTitle,
    content: {
      title: s.title,
      timeframe: s.timeframe,
      description: s.description,
      items: Array.isArray(s.items) ? s.items : []
    }
  }));

  const currentStep = steps.find(step => step.id === activeStep);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const stepsRowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
        delay: 1.2
      }
    }
  };

  return (
    <motion.section
      id="fluxo"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-5xl mx-auto px-5">
        {/* Header */}
        <motion.div variants={titleVariants} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {fluxoContent.title}
          </h2>
          <div className="w-20 h-1 bg-[#FFD027] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {fluxoContent.description}
          </p>
        </motion.div>

        {/* Steps com linhas conectando */}
        <motion.div variants={stepsRowVariants} className="hidden md:flex justify-between items-center mb-12 relative" style={{ minHeight: '9rem' }}>
          {/* Linha horizontal única conectando as bolas */}
          <div className="absolute h-px bg-gray-300 z-0" style={{ 
            left: 'calc(16.66% / 2)', 
            right: 'calc(16.66% / 2)', 
            top: '50%', 
            transform: 'translateY(-20px)' 
          }}></div>
          {steps.map((step) => (
            <motion.div key={step.id} variants={stepVariants} className="relative flex-1 flex justify-center">
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
            </motion.div>
          ))}
        </motion.div>

        {/* Versão Mobile - Grid com 2 colunas + linhas conectoras */}
        <motion.div variants={stepsRowVariants} className="md:hidden relative mb-12">
          {/* SVG com linhas conectoras */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Projeto → Compatibilização (horizontal com espaçamento) */}
            <line x1="35" y1="16.5" x2="65" y2="16.5" stroke="#d1d5db" strokeWidth="0.3" />
            {/* Compatibilização → Produção (vertical com espaçamento) */}
            <line x1="75" y1="26" x2="75" y2="40" stroke="#d1d5db" strokeWidth="0.3" />
            {/* Produção → Testes (horizontal com espaçamento) */}
            <line x1="65" y1="49.5" x2="35" y2="49.5" stroke="#d1d5db" strokeWidth="0.3" />
            {/* Testes → Entrega (vertical com espaçamento) */}
            <line x1="25" y1="59" x2="25" y2="73" stroke="#d1d5db" strokeWidth="0.3" />
            {/* Entrega → Suporte (horizontal com espaçamento) */}
            <line x1="35" y1="82.5" x2="65" y2="82.5" stroke="#d1d5db" strokeWidth="0.3" />
          </svg>
          
          <div className="grid grid-cols-2 gap-6 relative z-10">
            {steps.map((step) => (
              <motion.div key={step.id} variants={stepVariants} className="flex flex-col items-center">
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Linha vertical fixa no meio do card - maior e mais para cima */}
        <div className="flex justify-center" style={{marginTop: '-32px', marginBottom: '8px'}}>
          <div className="w-px h-14 bg-gray-300"></div>
        </div>

        {/* Card de conteúdo - mais próximo dos steps e com hover, agora com numeração */}
        <motion.div variants={cardVariants} className="fluxo-card bg-white rounded-2xl shadow-md p-8 text-center max-w-3xl mx-auto transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            <span className="font-extrabold mr-2 text-2xl" style={{color:'#120229'}}>{currentStep.id}.</span>
            {currentStep.content.title}
          </h3>
          <p className="text-[#FFD027] font-semibold text-lg mb-6">
            {currentStep.content.timeframe}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            {currentStep.content.description}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Fluxo;
