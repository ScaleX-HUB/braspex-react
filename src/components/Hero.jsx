import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import heroImage from '../assets/hero-bg.jpg';

const Hero = () => {
  const { content } = useSiteContent();
  const heroContent = content.hero;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 96;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const stats = [
    { value: '15+', label: 'Anos de Mercado' },
    { value: '500+', label: 'Obras Entregues' },
    { value: '3x', label: 'Mais Rápido' },
    { value: '100%', label: 'Rastreabilidade' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Dark overlay - gradient from left */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001f26]/95 via-[#001f26]/80 to-[#001f26]/50" />
      {/* Subtle teal accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD027]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-28 pb-20">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#FFD027]/15 border border-[#FFD027]/40 text-[#FFD027] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase"
          >
            <CheckCircle className="w-4 h-4" />
            {heroContent.eyebrow || 'Sistemas Hidráulicos Industrializados'}
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4"
          >
            {heroContent.title}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold text-[#FFD027] leading-tight mb-6"
          >
            {heroContent.subtitle}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-white/75 leading-relaxed mb-10 max-w-2xl"
          >
            {heroContent.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <motion.button
              onClick={() => scrollToSection('contato')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center justify-center gap-2 bg-[#FFD027] text-[#001f26] font-bold text-base px-8 py-4 rounded-lg shadow-lg hover:shadow-[#FFD027]/30 hover:shadow-xl transition-all duration-300"
            >
              {heroContent.buttonText || 'Solicitar OrÃ§amento'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>

            <motion.button
              onClick={() => scrollToSection('fluxo')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-semibold text-base px-8 py-4 rounded-lg border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              {heroContent.secondaryButtonText || 'Como Funciona'}
            </motion.button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm px-6 py-5 text-center hover:bg-white/10 transition-colors">
                <div className="text-2xl md:text-3xl font-bold text-[#FFD027]">{stat.value}</div>
                <div className="text-xs text-white/60 mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
