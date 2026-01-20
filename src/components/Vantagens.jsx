import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Lightning, 
  Factory, 
  Target,
  ArrowRight,
  Package
} from 'phosphor-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';

const Vantagens = () => {
  const { content } = useSiteContent();
  const vantagensContent = content.vantagens;
  const defaultSteps = [
    {
      icon: <Factory className="w-7 h-7" />,
      title: "Qualidade em Fábrica",
      description: "Montagem controlada e testada antes da entrega"
    },
    {
      icon: <Lock className="w-7 h-7" />,
      title: "Segurança e Rastreabilidade",
      description: "Todos os componentes são rastreáveis e seguros"
    },
    {
      icon: <Lightning className="w-7 h-7" />,
      title: "Agilidade",
      description: "Instalação até 3x mais rápida que sistemas convencionais"
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Suporte Técnico",
      description: "Do projeto à entrega, com suporte completo"
    }
  ];

  const stepsFromContent = safeJsonParse(vantagensContent?.stepsJson, null);
  const steps = Array.isArray(stepsFromContent)
    ? stepsFromContent.map((s, idx) => ({
        icon: defaultSteps[idx]?.icon || <Factory className="w-7 h-7" />,
        title: s?.title ?? defaultSteps[idx]?.title,
        description: s?.description ?? defaultSteps[idx]?.description
      }))
    : defaultSteps;

  // Hover/touch effect nos ícones para mobile
  const [activeIcon, setActiveIcon] = React.useState(null);
  const [selectedIcon, setSelectedIcon] = React.useState(0); // Permanentemente selecionado
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const carouselRef = React.useRef(null);

  const handleIconTouchStart = (idx) => setActiveIcon(idx);
  const handleIconTouchEnd = () => setTimeout(() => setActiveIcon(null), 200);
  const handleIconClick = (idx) => {
    // Se clicar na bola já selecionada, volta ao normal (desseleciona)
    if (selectedIcon === idx) {
      setSelectedIcon(null);
    } else {
      setSelectedIcon(idx);
    }
  };

  // Função para centralizar slide
  const scrollToSlide = (index) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
      setCurrentSlide(index);
    }
  };

  // Detecta mudança de slide no scroll
  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const slideWidth = carousel.offsetWidth;
      const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
      setCurrentSlide(currentIndex);
      setSelectedIcon(currentIndex); // Atualiza ícone selecionado baseado no slide atual
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 22,
        mass: 1.1
      }
    }
  };

  return (
    <motion.section
      id="vantagens"
      className="pt-20 pb-12 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-5">
        {/* Título */}
        <motion.div className="text-center mb-16" variants={titleVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {vantagensContent.title}
          </h2>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full"></div>
        </motion.div>
        {/* Desktop: Layout linear */}
        <motion.div
          className="hidden md:flex flex-row items-start justify-center gap-8 relative"
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center max-w-xs relative px-8"
              style={{ zIndex: 2 }}
              variants={itemVariants}
            >
              {/* Ícone em círculo */}
              <div
                className="w-28 h-28 flex items-center justify-center bg-[#120229] rounded-full text-white mb-6 transition-all duration-300 hover:scale-110 hover:bg-[#FFD027] hover:text-[#120229] hover:shadow-xl cursor-pointer group"
              >
                <div className="transition-transform duration-300 group-hover:rotate-12">
                  {React.cloneElement(step.icon, { className: "w-12 h-12" })}
                </div>
              </div>
              {/* Título e descrição */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {step.description}
              </p>
              {/* Linha de conexão (desktop) */}
              {index !== steps.length - 1 && (
                <div className="absolute top-12 left-[calc(100%-2rem)] w-16 h-[3px] bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile: Carrossel centralizado com linhas */}
        <div className="md:hidden relative overflow-hidden">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center min-w-full flex-shrink-0 px-8 snap-center relative"
                style={{ scrollSnapAlign: 'center' }}
              >
                {/* Ícone em círculo */}
                <div
                  className={`w-24 h-24 flex items-center justify-center rounded-full mb-6 transition-all duration-300 cursor-pointer group ${
                    selectedIcon === index 
                      ? 'bg-[#FFD027] text-[#120229] shadow-xl scale-110' 
                      : activeIcon === index 
                        ? 'scale-110 bg-[#FFD027] text-[#120229] shadow-xl' 
                        : 'bg-[#120229] text-white'
                  }`}
                  onTouchStart={() => handleIconTouchStart(index)}
                  onTouchEnd={handleIconTouchEnd}
                  onClick={() => handleIconClick(index)}
                >
                  <div className={`transition-transform duration-300 ${activeIcon === index || selectedIcon === index ? 'rotate-12' : ''} group-hover:rotate-12`}>
                    {React.cloneElement(step.icon, { className: "w-11 h-11" })}
                  </div>
                </div>
                {/* Título e descrição com quebra de linha */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 max-w-xs">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-xs">
                  {step.description}
                </p>

                {/* Linhas horizontais conectando as bolas (mobile) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 left-[calc(50%+60px)] w-[calc(100vw-160px)] h-[3px] bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                )}
                {index > 0 && (
                  <div className="absolute top-12 right-[calc(50%+60px)] w-[calc(100vw-160px)] h-[3px] bg-gradient-to-r from-gray-400 to-gray-300 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA para Ver Produtos */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/produtos"
            className="inline-flex items-center gap-3 bg-[#005563] text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:bg-[#003d47] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <Package size={24} weight="bold" />
            {vantagensContent.ctaText}
            <ArrowRight size={24} weight="bold" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Vantagens;
