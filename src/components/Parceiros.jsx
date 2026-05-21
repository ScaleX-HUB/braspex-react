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
        {/* Carousel Container com loop infinito contínuo */}
        <motion.div
          className="relative overflow-hidden"
          variants={carouselVariants}
        >
          <div className="partner-marquee flex w-max">
            {[0, 1].map((setIndex) => (
              <div
                key={setIndex}
                className="flex shrink-0 gap-12 pr-12"
                aria-hidden={setIndex > 0}
              >
                {parceiros.map((parceiro, index) => {
                  const activeKey = `${setIndex}-${index}`;
                  return (
                    <div
                      key={activeKey}
                      className="flex h-40 w-56 flex-shrink-0 items-center justify-center rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl"
                      onTouchStart={() => setActiveImg(activeKey)}
                      onTouchEnd={() => setTimeout(() => setActiveImg(null), 200)}
                    >
                      <img
                        src={parceiro.src}
                        alt={parceiro.alt}
                        draggable={false}
                        className={`max-h-full max-w-full object-contain transition-all duration-300 hover:scale-110 ${activeImg === activeKey ? 'scale-110' : ''}`}
                      />
                    </div>
                  );
                })}
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
      <style>{`
        @keyframes partner-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .partner-marquee {
          animation: partner-marquee 28s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-marquee {
            animation-duration: 80s;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default Parceiros;
