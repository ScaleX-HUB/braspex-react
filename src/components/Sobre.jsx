import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Settings, Factory, CheckCircle, Truck, Wrench,
  ShieldCheck, Lightbulb, ArrowRight,
} from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { NORTHEAST_STATES } from '../data/northeastMapPaths';
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
const DEFAULT_ABOUT_CARDS = [
  {
    Icon: Lightbulb,
    title: 'Experiência Sólida',
    description: 'Nascida da experiência do Grupo Protogás, a Braspex une rotina de obra, engenharia e produção industrial.'
  },
  {
    Icon: ShieldCheck,
    title: 'Qualidade Certificada',
    description: 'Produtos desenvolvidos com rigor técnico, padronização e controle para entregar desempenho superior em campo.'
  },
];

const DEFAULT_STEPS = [
  { id: 1, Icon: FileText,    label: 'Projeto',          title: 'Recebimento do Projeto Executivo',       timeframe: '2-3 dias úteis',      description: 'Análise detalhada do projeto executivo: especificações, requisitos técnicos e particularidades da obra.' },
  { id: 2, Icon: Settings,    label: 'Compatibilização', title: 'Compatibilização Técnica e Detalhamento', timeframe: '3-5 dias úteis',      description: 'Desenvolvimento personalizado dos kits, compatibilizando com todos os sistemas prediais.' },
  { id: 3, Icon: Factory,     label: 'Produção',         title: 'Produção em Fábrica',                    timeframe: '5-10 dias úteis',     description: 'Fabricação em ambiente controlado com equipamentos de precisão e controle de qualidade contínuo.' },
  { id: 4, Icon: CheckCircle, label: 'Testes',           title: 'Teste de Montagem e Checklist',          timeframe: '1-2 dias úteis',      description: 'Verificação completa e teste de pressão para garantir perfeito funcionamento antes da entrega.' },
  { id: 5, Icon: Truck,       label: 'Entrega',          title: 'Entrega Rastreável e Pronta',            timeframe: 'Conforme logística',  description: 'Kits embalados e identificados, prontos para instalação imediata, com rastreamento completo.' },
  { id: 6, Icon: Wrench,      label: 'Suporte',          title: 'Suporte Técnico na Obra',                timeframe: 'Sob demanda',         description: 'Acompanhamento especializado durante a instalação, garantindo a correta implementação dos kits.' },
];

const normalizeText = (value = '') =>
  String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const pickDifferential = (items, fallback) => {
  if (!Array.isArray(items)) return fallback;

  const titleKey = normalizeText(fallback.title);
  const match = items.find((item) => {
    const searchable = normalizeText(`${item?.title || ''} ${item?.description || ''}`);
    if (titleKey.includes('experiencia')) return searchable.includes('experiencia') || searchable.includes('protogas');
    if (titleKey.includes('qualidade')) return searchable.includes('qualidade');
    return false;
  });

  return {
    ...fallback,
    title: match?.title || fallback.title,
    description: match?.description || fallback.description,
  };
};

const RegionalMap = () => (
  <div className="relative overflow-hidden border border-[#007A86]/20 bg-[#f4fbfc] p-4 shadow-xl md:p-6">
    <svg
      viewBox="0 0 620 560"
      role="img"
      aria-labelledby="regional-map-title regional-map-description"
      className="h-full min-h-[360px] w-full"
    >
      <title id="regional-map-title">Mapa de atuação regional da Braspex no Nordeste</title>
      <desc id="regional-map-description">
        Mapa estilizado do Nordeste com sede destacada em Pernambuco e atuação nos estados da região.
      </desc>
      <defs>
        <linearGradient id="regionalFill" x1="130" y1="70" x2="470" y2="500" gradientUnits="userSpaceOnUse">
          <stop stopColor="#008896" stopOpacity="0.98" />
          <stop offset="1" stopColor="#004a54" stopOpacity="0.98" />
        </linearGradient>
        <pattern id="regionalGrid" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0H0V34" fill="none" stroke="#005563" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
        <filter id="regionalGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="620" height="560" fill="#f4fbfc" />
      <rect width="620" height="560" fill="url(#regionalGrid)" />
      <path
        d="M60 473 C125 445 182 459 250 446 C329 431 375 387 444 371 C516 354 555 375 590 410 L590 560 L60 560 Z"
        fill="#d7edf0"
        opacity="0.45"
      />
      <circle cx="417.9" cy="240.7" r="48" fill="none" stroke="#FFD027" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="417.9" cy="240.7" r="104" fill="none" stroke="#FFD027" strokeOpacity="0.18" strokeWidth="1.5" />

      <g filter="url(#regionalGlow)">
        {NORTHEAST_STATES.map((state) => (
          <path
            key={state.code}
            d={state.path}
            fill={state.active ? '#FFD027' : 'url(#regionalFill)'}
            fillOpacity={state.active ? '1' : '0.98'}
            stroke={state.active ? '#001f26' : '#ffffff'}
            strokeOpacity="1"
            strokeLinejoin="round"
            strokeWidth={state.active ? '2.8' : '1.35'}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      {NORTHEAST_STATES.map((state) => {
        const active = state.active;
        return (
          <g key={state.code}>
            <circle
              cx={state.label[0]}
              cy={state.label[1]}
              r={active ? '10' : '7.5'}
              fill={active ? '#FFD027' : '#005563'}
              stroke={active ? '#FFF6C7' : '#BFECEF'}
              strokeWidth={active ? '3' : '2'}
            />
            <text
              x={state.label[0] + 14}
              y={state.label[1] + 5}
              fill={active ? '#001f26' : '#E7FBFD'}
              fontSize={active ? '17' : '13'}
              fontWeight="700"
            >
              {state.code}
            </text>
          </g>
        );
      })}

      <g>
        <path d="M428 239 C468 229 491 222 518 208" fill="none" stroke="#001f26" strokeWidth="1.4" strokeDasharray="4 4" />
        <rect x="515" y="174" width="78" height="48" fill="#001f26" />
        <text x="529" y="193" fill="#FFD027" fontSize="11" fontWeight="900" letterSpacing="1.4">MATRIZ</text>
        <text x="529" y="210" fill="#ffffff" fontSize="12" fontWeight="800">PE</text>
      </g>

      <g transform="translate(70 468)">
        <rect width="236" height="62" fill="#ffffff" stroke="#d6e7ea" />
        <circle cx="22" cy="22" r="7" fill="#FFD027" stroke="#001f26" strokeWidth="1.2" />
        <text x="42" y="27" fill="#001f26" fontSize="13" fontWeight="800">Sede - Pernambuco</text>
        <circle cx="22" cy="44" r="7" fill="#007A86" />
        <text x="42" y="49" fill="#4f6870" fontSize="13" fontWeight="700">Atuacao regional</text>
      </g>
    </svg>
  </div>
);

const Sobre = () => {
  const { content } = useSiteContent();
  const sobreContent = content?.sobre || {};
  const fluxoContent = content?.fluxo || {};
  const [activeStep, setActiveStep] = useState(1);

  /* Differentials */
  const parsedDiff = safeJsonParse(sobreContent.differentialsJson, null);
  const aboutCards = DEFAULT_ABOUT_CARDS.map((fallback) => pickDifferential(parsedDiff, fallback));
  const conciseAbout =
    'A Braspex industrializa kits hidráulicos para obras de construção civil, com base em Pernambuco e atuação regional no Nordeste.';
  const firstContentParagraph = String(sobreContent.content || '').split('\n\n').find(Boolean);
  const aboutSummary =
    firstContentParagraph && firstContentParagraph.length <= 210 ? firstContentParagraph : conciseAbout;
  const aboutTitle =
    !sobreContent.title || sobreContent.title === 'Sobre a Braspex'
      ? 'Braspex no Nordeste'
      : sobreContent.title;

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
      <div className="py-20 bg-[#f8f9fb] md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <RegionalMap />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.p variants={fadeUp} className="text-[#007A86] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Quem Somos
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[#001f26] leading-tight max-w-xl">
                {aboutTitle}
              </motion.h2>
              <motion.div variants={fadeUp} className="w-16 h-1 bg-[#FFD027] rounded-full mt-5" />
              <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
                {aboutSummary}
              </motion.p>

              <motion.div variants={stagger} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {aboutCards.map((item) => (
                  <motion.div key={item.title} variants={fadeUp}
                    className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="w-10 h-10 bg-[#005563]/10 rounded-lg flex items-center justify-center mb-3">
                      <item.Icon className="w-5 h-5 text-[#005563]" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-bold text-[#001f26] mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button variants={fadeUp} onClick={() => scrollTo('contato')}
                className="group mt-8 inline-flex items-center gap-2 text-[#005563] font-bold text-sm transition-colors hover:text-[#007A86]">
                Fale com a nossa equipe
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
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
