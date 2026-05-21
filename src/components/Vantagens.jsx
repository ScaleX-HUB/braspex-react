import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';
import comparacaoImg from '../assets/comparacao-tradicionalxprazo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const DEFAULT_CHART = [
  { value: 40, label: 'De economia de mão de obra' },
  { value: 10, label: 'Menos dias no cronograma' },
  { value: 80, label: 'De redução de perdas' },
  { value: 90, label: 'Menos retrabalho' },
];

const barGradients = [
  ['#007A86', '#005563'],
  ['#FFD027', '#D8AA00'],
  ['#00A3AD', '#007A86'],
  ['#005563', '#001f26'],
];

const Vantagens = () => {
  const { content } = useSiteContent();
  const comparacaoContent = content?.comparacao || {};
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);

  const parsedChart = safeJsonParse(comparacaoContent?.chartDataJson, null);
  const chartData = Array.isArray(parsedChart) ? parsedChart : DEFAULT_CHART;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="vantagens" className="bg-[#f8f9fb] py-20 md:py-24" ref={chartRef}>
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#007A86]">Comparação de Prazo</p>
          <h2 className="max-w-3xl text-3xl font-bold leading-tight text-[#001f26] md:text-4xl">
            {comparacaoContent.title || 'TRADICIONAL VS KITS BRASPEX'}
          </h2>
          {comparacaoContent.subtitle && (
            <p className="mt-2 text-lg text-gray-500">{comparacaoContent.subtitle}</p>
          )}
          <div className="mt-5 h-1 w-16 rounded-full bg-[#FFD027]" />
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            {[...chartData].reverse().map((item, i) => {
              const gradient = barGradients[i % barGradients.length];
              return (
                <motion.div key={`${item.label}-${i}`} variants={fadeUp}>
                  <div className="mb-2 flex items-baseline justify-between gap-4">
                    <span className="text-2xl font-bold text-[#005563]">{item.value}%</span>
                    <span className="text-right text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden bg-slate-200">
                    <div
                      className="h-full transition-all duration-1000 ease-out"
                      style={{
                        width: isVisible ? `${item.value}%` : '0%',
                        transitionDelay: `${i * 180}ms`,
                        background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center"
          >
            <div className="overflow-hidden border-2 border-[#FFD027] bg-white shadow-2xl">
              <img
                src={comparacaoImg}
                alt={comparacaoContent.imageAlt || 'Comparação Tradicional vs Kits Braspex'}
                className="max-h-[450px] max-w-full object-contain"
              />
            </div>
          </motion.div>
        </div>

        {comparacaoContent.description && (
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mt-14 max-w-3xl text-center text-lg leading-relaxed text-gray-600"
          >
            {comparacaoContent.description}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Vantagens;
