import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../contexts/SiteContentContext';
import heroImage from '../assets/hero-bg.jpg';

const Hero = () => {
  const { content } = useSiteContent();
  const heroContent = content.hero;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 96;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Animações suaves e profissionais
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2
      }
    }
  };

  const buttonsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.5
      }
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-16 pt-20 md:pt-24 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.65) 50%, rgba(0, 0, 0, 0.70) 100%), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed'
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Grid Pattern Overlay (sutil) */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        backgroundSize: '100% 4px'
      }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Conteúdo Textual - Lado Esquerdo */}
          <motion.div
            className="text-left space-y-8 md:space-y-10"
            variants={contentVariants}
          >
            {/* Título Principal - Tamanho Reduzido */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {heroContent.title}
              </h1>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-[#FFD027] leading-tight">
                {heroContent.subtitle}
              </h2>
            </div>

            {/* Descrição - Mais Concisa */}
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
              {heroContent.description}
            </p>

            {/* Linha Decorativa */}
            <div className="w-20 h-1 bg-gradient-to-r from-[#FFD027] to-transparent rounded-full" />

            {/* CTAs - Estilo Profissional */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={buttonsVariants}
            >
              <motion.button
                onClick={() => scrollToSection('contato')}
                className="group inline-flex items-center justify-center gap-2 bg-[#FFD027] text-[#005563] font-semibold text-base md:text-lg px-8 md:px-10 py-3.5 md:py-4 rounded-lg shadow-lg hover:shadow-xl hover:shadow-[#FFD027]/30 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {heroContent.buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                onClick={() => {
                  const url = heroContent.videoUrl || 'https://www.youtube.com/watch?v=SEU_VIDEO_ID';
                  window.open(url, '_blank');
                }}
                className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold text-base md:text-lg px-8 md:px-10 py-3.5 md:py-4 rounded-lg border-2 border-white/30 hover:bg-white hover:text-[#005563] hover:border-white transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <PlayCircle className="w-6 h-6" weight="fill" />
                {heroContent.videoButtonText || 'Ver Vídeo'}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Imagem/Visual - Lado Direito (Opcional para Desktop) */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Card de destaque - Produtos */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <div className="w-14 h-14 bg-[#005563] rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#FFD027]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#005563]">{heroContent.featureCardTitle}</h3>
                    <p className="text-sm text-gray-600 mt-1">{heroContent.featureCardSubtitle}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#FFD027] rounded-full" />
                    <span className="text-base text-gray-700">{heroContent.featureCardItem1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#FFD027] rounded-full" />
                    <span className="text-base text-gray-700">{heroContent.featureCardItem2}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#FFD027] rounded-full" />
                    <span className="text-base text-gray-700">{heroContent.featureCardItem3}</span>
                  </div>
                </div>

                <Link 
                  to="/produtos"
                  className="block w-full bg-[#005563] text-white font-semibold py-3.5 rounded-lg hover:bg-[#00424d] transition-colors duration-300 text-center"
                >
                  {heroContent.featureCardButtonText}
                </Link>
              </div>

              {/* Elementos decorativos */}
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#FFD027]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-[#005563]/20 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indicador de Scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 bg-white/60 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-white/60 text-xs">{heroContent.scrollIndicatorText}</span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;