import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Buildings, Wrench, Wind } from 'phosphor-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import heroImage from '../assets/hero-bg.jpg';

const Hero = () => {
  const { content } = useSiteContent();
  const heroContent = content.hero;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 96; // Ajuste para a altura do header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Hover/touch effect nos ícones para mobile e desktop
  const [activeIcon, setActiveIcon] = React.useState(null);

  const handleIconTouchStart = (idx) => setActiveIcon(idx);
  const handleIconTouchEnd = () => setTimeout(() => setActiveIcon(null), 200);
  const handleIconMouseEnter = (idx) => setActiveIcon(idx);
  const handleIconMouseLeave = () => setActiveIcon(null);

  // Framer Motion variants para animações sofisticadas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  // Stagger para ícones
  const iconsRowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.7 // começa após o título
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
        ease: [0.4, 0, 0.2, 1],
        delay: 0.1
      }
    }
  };
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 30 },
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
  const descVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
        delay: 1.3 // após ícones
      }
    }
  };
  // Exclusivo para o grupo de botões
  const buttonsGroupVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
        delay: 1.5 // aparece após descrição
      }
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <motion.section
      id="home"
      className="relative h-screen flex items-center justify-center px-2 md:px-5 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed'
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="relative z-20 w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center pt-8 md:pt-20 px-2 md:px-0"
        variants={containerVariants}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white drop-shadow-lg font-montserrat px-2 md:px-0"
          variants={titleVariants}
        >
          <motion.span className="block text-[#FFD027] mb-2" variants={titleVariants}>{heroContent.title}</motion.span>
          <motion.span className="block" variants={titleVariants}>{heroContent.subtitle}</motion.span>
        </motion.h1>
        <motion.div
          className="flex justify-center gap-3 md:gap-6 mb-6 md:mb-8 px-2 md:px-0"
          initial="hidden"
          animate="visible"
          variants={iconsRowVariants}
        >
          <motion.div
            className={`flex flex-col items-center group hero-icon-group transition-transform duration-300 ${activeIcon === 0 ? 'scale-110 shadow-lg' : ''}`}
            onTouchStart={() => handleIconTouchStart(0)}
            onTouchEnd={handleIconTouchEnd}
            onMouseEnter={() => handleIconMouseEnter(0)}
            onMouseLeave={handleIconMouseLeave}
            variants={iconVariants}
            // ...sem whileHover, hover será feito via CSS
          >
            <Buildings className="w-9 h-9 md:w-10 md:h-10 text-[#FFD027] mb-2" />
            <span className="text-white text-sm md:text-base font-poppins-medium">Projetos Personalizados</span>
          </motion.div>
          <motion.div
            className={`flex flex-col items-center group hero-icon-group transition-transform duration-300 ${activeIcon === 1 ? 'scale-110 shadow-lg' : ''}`}
            onTouchStart={() => handleIconTouchStart(1)}
            onTouchEnd={handleIconTouchEnd}
            onMouseEnter={() => handleIconMouseEnter(1)}
            onMouseLeave={handleIconMouseLeave}
            variants={iconVariants}
            // ...sem whileHover, hover será feito via CSS
          >
            <Wrench className="w-9 h-9 md:w-10 md:h-10 text-[#FFD027] mb-2" />
            <span className="text-white text-sm md:text-base font-poppins-medium">Kits Hidráulicos</span>
          </motion.div>
          <motion.div
            className={`flex flex-col items-center group hero-icon-group transition-transform duration-300 ${activeIcon === 2 ? 'scale-110 shadow-lg' : ''}`}
            onTouchStart={() => handleIconTouchStart(2)}
            onTouchEnd={handleIconTouchEnd}
            onMouseEnter={() => handleIconMouseEnter(2)}
            onMouseLeave={handleIconMouseLeave}
            variants={iconVariants}
            // ...sem whileHover, hover será feito via CSS
          >
            <Wind className="w-9 h-9 md:w-10 md:h-10 text-[#FFD027] mb-2" />
            <span className="text-white text-sm md:text-base font-poppins-medium">Climatização Eficiente</span>
          </motion.div>
        </motion.div>
        <motion.p
          className="text-base md:text-xl text-white/80 mb-6 md:mb-8 font-poppins max-w-xs md:max-w-xl mx-auto px-2 md:px-0"
          variants={descVariants}
        >
          {heroContent.description}
        </motion.p>
        <motion.div
          className="flex justify-center gap-3 md:gap-4 px-2 md:px-0"
          initial="hidden"
          animate="visible"
          variants={buttonsGroupVariants}
        >
          <motion.button
            onClick={() => scrollToSection('contato')}
            className="bg-[#FFD027] text-[#005563] rounded-lg font-bold text-base md:text-lg shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FFD027]/40 transition-all duration-300 px-3 md:px-8 py-3 md:py-4"
            whileHover={{ scale: 1.07, boxShadow: '0 4px 24px #FFD02755' }}
          >
            {heroContent.buttonText}
          </motion.button>
          <motion.button
            onClick={() => window.open('https://www.youtube.com/@braspexoficial', '_blank')}
            className="flex items-center bg-transparent border-2 border-white text-white rounded-lg font-bold text-base md:text-lg hover:bg-white hover:text-[#005563] transition-all duration-300 px-3 md:px-8 py-3 md:py-4"
            whileHover={{ scale: 1.07, backgroundColor: '#fff', color: '#005563' }}
          >
            <PlayCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
            {heroContent.videoButtonText}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;