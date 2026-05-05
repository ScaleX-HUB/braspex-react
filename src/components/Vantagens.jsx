import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Factory, Lock, Zap, Target, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';
import comparacaoImg from '../assets/comparacao-tradicionalxprazo.png';

/* ─── Animation variants ─────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

/* ─── Default data ───────────────────────────────────────────────────────── */
const DEFAULT_STEPS = [
  { Icon: Factory, title: 'Qualidade em Fábrica',          description: 'Montagem controlada e testada antes da entrega, com rastreabilidade total de componentes.' },
  { Icon: Lock,    title: 'Segurança e Rastreabilidade',   description: 'Todos os componentes são identificados e rastreáveis do início ao fim da obra.' },
  { Icon: Zap,     title: 'Agilidade',                     description: 'Instalação até 3× mais rápida que sistemas convencionais, reduzindo prazo da obra.' },
  { Icon: Target,  title: 'Suporte Técnico',               description: 'Do projeto à entrega, com equipe especializada disponível em cada etapa.' },
];

const DEFAULT_CHART = [
  { value: 40, label: 'De economia de mão de obra',  color: 'from-green-400 to-green-600' },
  { value: 10, label: 'Menos dias no cronograma',    color: 'from-blue-400 to-blue-600' },
  { value: 80, label: 'De redução de perdas',        color: 'from-yellow-400 to-yellow-600' },
  { value: 90, label: 'Menos retrabalho',            color: 'from-red-400 to-red-600' },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const Vantagens = () => {
  const { content } = useSiteContent();
  const vantagensContent = content?.vantagens || {};
  const comparacaoContent = content?.comparacao || {};

  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);

  /* Benefit steps */
  const parsedSteps = safeJsonParse(vantagensContent?.stepsJson, null);
  const steps = Array.isArray(parsedSteps)
    ? parsedSteps.map((s, i) => ({
        ...DEFAULT_STEPS[i],
        title: s?.title ?? DEFAULT_STEPS[i]?.title,
        description: s?.description ?? DEFAULT_STEPS[i]?.description,
      }))
    : DEFAULT_STEPS;

  /* Chart data */
  const parsedChart = safeJsonParse(comparacaoContent?.chartDataJson, null);
  const chartData = Array.isArray(parsedChart) ? parsedChart : DEFAULT_CHART;

  /* IntersectionObserver for bar animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 96, behavior: 'smooth' });
  };

  return (
    <section id="vantagens" className="bg-white">

      {/* ── Part 1: Por que escolher os Kits BRASPEX ──────────────────── */}
      <div className="py-20 md:py-24 bg-[#001f26]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-14">
            <p className="text-[#FFD027] text-xs font-bold tracking-[0.2em] uppercase mb-3">Nossos Kits</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
              {vantagensContent.title || 'Por que escolher os Kits BRASPEX?'}
            </h2>
            <div className="w-16 h-1 bg-[#FFD027] rounded-full mt-5" />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-[#FFD027]/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FFD027]/25 transition-colors">
                  <step.Icon className="w-6 h-6 text-[#FFD027]" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-10">
            <button onClick={() => scrollTo('contato')}
              className="group inline-flex items-center gap-2 bg-[#FFD027] text-[#001f26] font-bold text-sm px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors">
              {vantagensContent.ctaText || 'Solicitar Orçamento'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Part 2: Comparação TRADICIONAL vs KITS BRASPEX ─────────────── */}
      <div className="py-20 md:py-24 bg-[#f8f9fb]" ref={chartRef}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-14">
            <p className="text-[#FFD027] text-xs font-bold tracking-[0.2em] uppercase mb-3">Comparação de Prazo</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#001f26] leading-tight max-w-3xl">
              {comparacaoContent.title || 'TRADICIONAL VS KITS BRASPEX'}
            </h2>
            {comparacaoContent.subtitle && (
              <p className="text-lg text-gray-500 mt-2">{comparacaoContent.subtitle}</p>
            )}
            <div className="w-16 h-1 bg-[#FFD027] rounded-full mt-5" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Chart bars */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="space-y-6">
              {[...chartData].reverse().map((item, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold text-[#005563]">{item.value}%</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: isVisible ? `${item.value}%` : '0%', transitionDelay: `${i * 180}ms` }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Image */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="flex items-center justify-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FFD027]">
                <img
                  src={comparacaoImg}
                  alt={comparacaoContent.imageAlt || 'Comparação Tradicional vs Kits Braspex'}
                  className="object-contain max-h-[450px] max-w-full"
                />
              </div>
            </motion.div>
          </div>

          {comparacaoContent.description && (
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-center text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mt-14">
              {comparacaoContent.description}
            </motion.p>
          )}
        </div>
      </div>

    </section>
  );
};

export default Vantagens;
