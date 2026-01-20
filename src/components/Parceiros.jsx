import React from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';
import parceiro1 from '../assets/parceiro1.png';
import parceiro2 from '../assets/parceiro2.png';
import parceria3 from '../assets/parceria3.png';
import parceria4 from '../assets/parceria4.png';
import parceria5 from '../assets/parceria5.png';

const Parceiros = () => {
  const { content } = useSiteContent();
  const parceirosContent = content?.parceiros || { title: 'Nossos Parceiros', subtitle: 'Trabalhamos com as melhores marcas' };
  const alts = safeJsonParse(parceirosContent.partnersAltJson, null);
  const partnerAlts = Array.isArray(alts) ? alts : ["Parceiro 1", "Parceiro 2", "Parceiro 3", "Parceiro 4", "Parceiro 5"];
  
  // Estado para controlar o efeito de toque nas imagens no mobile
  const [activeImg, setActiveImg] = React.useState(null);
  
  // Carrossel infinito: quando chega ao fim, volta ao início
  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    // Espera o layout para garantir scrollWidth correto
    const setInitialScroll = () => {
      // scrollWidth pode ser zero se o layout não estiver pronto
      const scrollWidth = carousel.scrollWidth / 2;
      if (scrollWidth > 0) {
        carousel.scrollLeft = scrollWidth;
      } else {
        // Tenta novamente após um pequeno delay
        setTimeout(setInitialScroll, 50);
      }
    };
    setInitialScroll();
    const handleScroll = () => {
      const scrollWidth = carousel.scrollWidth / 2;
      if (carousel.scrollLeft >= scrollWidth) {
        carousel.scrollLeft = carousel.scrollLeft - scrollWidth;
      } else if (carousel.scrollLeft <= 0) {
        carousel.scrollLeft = carousel.scrollLeft + scrollWidth;
      }
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

  const carouselVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.4
      }
    }
  };
  
  const parceiros = [
    { src: parceiro1, alt: partnerAlts[0] || "Parceiro 1" },
    { src: parceiro2, alt: partnerAlts[1] || "Parceiro 2" },
    { src: parceria3, alt: partnerAlts[2] || "Parceiro 3" },
    { src: parceria4, alt: partnerAlts[3] || "Parceiro 4" },
    { src: parceria5, alt: partnerAlts[4] || "Parceiro 5" }
  ];

  // Duplicar os parceiros para criar o efeito de loop infinito
  const duplicatedParceiros = [...parceiros, ...parceiros];

  // Drag-to-scroll logic
  const carouselRef = React.useRef(null);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);

  // Mouse events
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.classList.add('dragging');
    // Pausa animação
    const scrollEl = document.querySelector('.animate-scroll');
    if (scrollEl) scrollEl.style.animationPlayState = 'paused';
  };
  const handleMouseLeave = () => {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.classList.remove('dragging');
    // Retoma animação
    const scrollEl = document.querySelector('.animate-scroll');
    if (scrollEl) scrollEl.style.animationPlayState = 'running';
  };
  const handleMouseUp = () => {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.classList.remove('dragging');
    // Retoma animação
    const scrollEl = document.querySelector('.animate-scroll');
    if (scrollEl) scrollEl.style.animationPlayState = 'running';
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2; // scroll speed
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Touch events
  const handleTouchStart = (e) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.classList.add('dragging');
    // Pausa animação
    const scrollEl = document.querySelector('.animate-scroll');
    if (scrollEl) scrollEl.style.animationPlayState = 'paused';
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.classList.remove('dragging');
    // Retoma animação
    const scrollEl = document.querySelector('.animate-scroll');
    if (scrollEl) scrollEl.style.animationPlayState = 'running';
  };
  const handleTouchMove = (e) => {
    if (!isDragging.current || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <motion.section
      className="py-20 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-5">
        <motion.div className="text-center mb-16" variants={titleVariants}>
          <p className="text-[#005563] font-semibold text-lg mb-2 uppercase tracking-wide">
            {parceirosContent.kicker}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#005563] mb-4">
            {parceirosContent.title}
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            {parceirosContent.subtitle}
          </p>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full"></div>
        </motion.div>
        {/* Carousel Container com scroll manual, drag e animação */}
        <motion.div
          className="relative overflow-x-auto scrollbar-hide"
          style={{WebkitOverflowScrolling:'touch'}}
          ref={carouselRef}
          variants={carouselVariants}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          <div className="flex animate-scroll space-x-12 min-w-max" style={{gap:'3rem'}}>
            {duplicatedParceiros.map((parceiro, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-56 h-40 flex items-center justify-center p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                onTouchStart={() => setActiveImg(index)}
                onTouchEnd={() => setTimeout(() => setActiveImg(null), 200)}
              >
                <img
                  src={parceiro.src}
                  alt={parceiro.alt}
                  draggable={false}
                  className={`max-w-full max-h-full object-contain transition-all duration-300 hover:scale-110 ${activeImg === index ? 'scale-110' : ''}`}
                />
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div className="text-center mt-12" variants={carouselVariants}>
          <p className="text-gray-600 text-lg font-poppins">
            {parceirosContent.bottomText}
          </p>
        </motion.div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .dragging {
          cursor: grabbing !important;
          user-select: none;
        }
      `}</style>
    </motion.section>
  );
};

export default Parceiros;
