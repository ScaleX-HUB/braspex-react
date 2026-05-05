import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Settings, Factory, CheckCircle, Truck, Wrench,
  ShieldCheck, Zap, BarChart2, Lightbulb, ArrowRight,
} from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';

/* ─── Animation variants ────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

/* ─── Default data ──────────────────────────────────────────────────────────── */
const DEFAULT_DIFFS = [
  { Icon: ShieldCheck, title: 'Qualidade Certificada',  description: 'Produtos desenvolvidos com rigor técnico, garantindo desempenho superior em campo.' },
  { Icon: Zap,         title: 'Agilidade na Entrega',   description: 'Kits prontos para obra que reduzem prazos em até 3× frente ao método convencional.' },
  { Icon: BarChart2,   title: 'Rastreabilidade Total',  description: 'Cada componente é identificado e rastreável do início ao fim da obra.' },
  { Icon: Lightbulb,   title: 'Expertise do Grupo',    description: 'Respaldados pela experiência do Grupo Protogás, referência em instalações de gás.' },
];

const DEFAULT_STEPS = [
  { id: 1, Icon: FileText,    label: 'Projeto',          title: 'Recebimento do Projeto Executivo',       timeframe: '2-3 dias úteis',      description: 'Análise detalhada do projeto executivo: especificações, requisitos técnicos e particularidades da obra.' },
  { id: 2, Icon: Settings,    label: 'Compatibilização', title: 'Compatibilização Técnica e Detalhamento', timeframe: '3-5 dias úteis',      description: 'Desenvolvimento personalizado dos kits, compatibilizando com todos os sistemas prediais.' },
  { id: 3, Icon: Factory,     label: 'Produção',         title: 'Produção em Fábrica',                    timeframe: '5-10 dias úteis',     description: 'Fabricação em ambiente controlado com equipamentos de precisão e controle de qualidade contínuo.' },
  { id: 4, Icon: CheckCircle, label: 'Testes',           title: 'Teste de Montagem e Checklist',          timeframe: '1-2 dias úteis',      description: 'Verificação completa e teste de pressão para garantir perfeito funcionamento antes da entrega.' },
  { id: 5, Icon: Truck,       label: 'Entrega',          title: 'Entrega Rastreável e Pronta',            timeframe: 'Conforme logística',  description: 'Kits embalados e identificados, prontos para instalação imediata, com rastreamento completo.' },
  { id: 6, Icon: Wrench,      label: 'Suporte',          title: 'Suporte Técnico na Obra',                timeframe: 'Sob demanda',         description: 'Acompanhamento especializado durante a instalação, garantindo a correta implementação dos kits.' },
];

const Sobre = () => {
  const { content } = useSiteContent();
  const sobreContent = content?.sobre || {};
  const fluxoContent = content?.fluxo || {};
  const [activeStep, setActiveStep] = useState(1);

  /* Differentials */
  const parsedDiff = safeJsonParse(sobreContent.differentialsJson, null);
  const differentials = Array.isArray(parsedDiff)
    ? parsedDiff.map((d, i) => ({
        ...DEFAULT_DIFFS[i],
        title: d?.title ?? DEFAULT_DIFFS[i]?.title,
        description: d?.description ?? DEFAULT_DIFFS[i]?.description,
      }))
    : DEFAULT_DIFFS;

  /* Steps */
  const parsedSteps = safeJsonParse(fluxoContent?.stepsJson, null);
  const steps = Array.isArray(parsedSteps)
    ? parsedSteps.map((s, i) => ({
        ...DEFAULT_STEPS[i],
        label: s?.shortTitle ?? DEFAULT_STEPS[i]?.label,
        title: s?.title ?? DEFAULT_STEPS[i]?.title,
        timeframe: s?.timeframe ?? DEFAULT_STEPS[i]?.timeframe,
        description: s?.description ?? DEFAULT_STEPS[i]?.description,
      }))
    : DEFAULT_STEPS;

  const current = steps.find(s => s.id === activeStep) || steps[0];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 96, behavior: 'smooth' });
  };

  return (
    <section id="sobre" className="bg-white">

      {/* ── Part 1: Who we are ─────────────────────────────────────────── */}
      <div className="py-20 md:py-24 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="text-[#FFD027] text-xs font-bold tracking-[0.2em] uppercase mb-3">Quem Somos</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#001f26] leading-tight max-w-2xl">
              {sobreContent.title || 'Braspex: Hidráulica Industrial que funciona'}
            </h2>
            <div className="w-16 h-1 bg-[#FFD027] rounded-full mt-5" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            {/* Text */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-5">
              {(sobreContent.content || 'A Braspex fornece kits hidráulicos industrializados prontos para obra — combinando qualidade de fábrica, rastreabilidade total e agilidade de entrega.\n\nRespaldados pelo Grupo Protogás, atuamos com modelo produtivo moderno que reduz prazos, custos e retrabalhos em obras de qualquer porte.')
                .split('\n\n').filter(Boolean)
                .map((p, i) => (
                  <motion.p key={i} variants={fadeUp} className="text-base md:text-lg text-gray-600 leading-relaxed">{p}</motion.p>
                ))}
              <motion.button variants={fadeUp} onClick={() => scrollTo('contato')}
                className="group inline-flex items-center gap-2 mt-4 text-[#005563] font-bold text-sm hover:text-[#FFD027] transition-colors">
                Fale com a nossa equipe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Differentials */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {differentials.map((item, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-10 h-10 bg-[#005563]/10 rounded-lg flex items-center justify-center mb-3">
                    <item.Icon className="w-5 h-5 text-[#005563]" strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-bold text-[#001f26] mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Part 2: How we work ─────────────────────────────────────────── */}
      <div className="py-20 md:py-24 bg-[#001f26]" id="fluxo">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-14">
            <p className="text-[#FFD027] text-xs font-bold tracking-[0.2em] uppercase mb-3">Como Trabalhamos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
              {fluxoContent.title || 'Do projeto à entrega: processo simples e rastreável'}
            </h2>
            <div className="w-16 h-1 bg-[#FFD027] rounded-full mt-5" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Step selectors */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-2">
              {steps.map((step) => {
                const isActive = step.id === activeStep;
                return (
                  <motion.button key={step.id} variants={fadeUp} onClick={() => setActiveStep(step.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-300 ${
                      isActive ? 'bg-[#FFD027] text-[#001f26]' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${isActive ? 'bg-[#001f26] text-[#FFD027]' : 'bg-white/10 text-white/50'}`}>
                      {step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm ${isActive ? 'text-[#001f26]' : 'text-white'}`}>{step.label}</div>
                      <div className={`text-xs truncate ${isActive ? 'text-[#001f26]/70' : 'text-white/40'}`}>{step.timeframe}</div>
                    </div>
                    <step.Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#001f26]' : 'text-white/30'}`} />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Step detail */}
            <motion.div key={activeStep} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 bg-[#FFD027]/15 text-[#FFD027] text-xs font-bold px-3 py-1 rounded-full mb-5">
                <current.Icon className="w-3.5 h-3.5" />
                {current.timeframe}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{current.title}</h3>
              <p className="text-white/65 leading-relaxed text-sm md:text-base">{current.description}</p>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-white/40">
                <span>Etapa {current.id} de {steps.length}</span>
                <div className="flex gap-1 ml-auto">
                  {steps.map(s => (
                    <div key={s.id} onClick={() => setActiveStep(s.id)}
                      className={`h-1.5 rounded-full cursor-pointer transition-all ${s.id === activeStep ? 'bg-[#FFD027] w-4' : 'bg-white/20 w-1.5 hover:bg-white/40'}`} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Sobre;
