import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../contexts/SiteContentContext';
import comparacaoImg from '../assets/comparacao-tradicionalxprazo.png';

const Comparacao = () => {
  const { content } = useSiteContent();
  const comparacaoContent = content.comparacao;
  
  // Estado para hover/touch nos cards e imagem no mobile
  const [activeCard, setActiveCard] = useState(null);
  const [activeImg, setActiveImg] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const chartData = [
    {
      value: 40,
      label: "De economia de mão de obra",
      color: "bg-gradient-to-r from-green-400 to-green-600"
    },
    {
      value: 10,
      label: "Menos dias no cronograma",
      color: "bg-gradient-to-r from-blue-400 to-blue-600"
    },
    {
      value: 80,
      label: "De redução de perdas",
      color: "bg-gradient-to-r from-yellow-400 to-yellow-600"
    },
    {
      value: 90,
      label: "Menos retrabalho",
      color: "bg-gradient-to-r from-red-400 to-red-600"
    }
  ].reverse();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
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

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const chartItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <motion.div variants={titleVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {comparacaoContent.title}
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold">
            {comparacaoContent.subtitle}
          </h3>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Comparação lado a lado */}
        <div className="flex flex-col lg:flex-row items-stretch gap-12 mb-16">
          {/* Charts - Esquerda */}
          <motion.div variants={contentVariants} className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="space-y-6 h-full flex flex-col justify-center">
              {chartData.map((item, index) => (
                <motion.div
                  key={index}
                  variants={chartItemVariants}
                  className={`flex-1 min-h-[50px] flex flex-col justify-center transition-all duration-300 cursor-pointer font-montserrat
                    ${activeCard === index ? 'scale-105' : ''}
                  `}
                  onTouchStart={() => setActiveCard(index)}
                  onTouchEnd={() => setTimeout(() => setActiveCard(null), 200)}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-bold text-[#005563] transition-transform duration-300 mr-2 font-montserrat ${activeCard === index ? 'scale-110' : ''}`}>
                      {item.value}%
                    </span>
                    <h4 className={`text-lg font-semibold text-gray-900 transition-colors duration-300 font-montserrat ${activeCard === index ? 'text-[#FFD027]' : ''}`}>
                      {item.label}
                    </h4>
                  </div>
                  <div className={`relative w-full h-3 bg-gray-200 rounded-full overflow-hidden transition-all duration-300 ${activeCard === index ? 'h-4' : ''}`}>
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out ${activeCard === index ? 'brightness-110' : ''}`}
                      style={{
                        width: isVisible ? `${item.value}%` : '0%',
                        transitionDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Comparison - Direita */}
          <motion.div variants={imageVariants} className="w-full lg:w-1/2 flex items-center justify-center">
            <div
              className={`bg-white transition-transform duration-300 rounded-2xl overflow-hidden ${activeImg ? 'scale-105' : ''}`}
              style={{boxShadow:'0 18px 38px -4px rgba(0,0,0,0.28)'}}
              onTouchStart={() => setActiveImg(true)}
              onTouchEnd={() => setTimeout(() => setActiveImg(false), 200)}
                onMouseEnter={() => setActiveImg(true)}
                onMouseLeave={() => setActiveImg(false)}
            >
              <img
                src={comparacaoImg}
                alt="Comparação visual entre instalação tradicional e Kits BRASPEX"
                className="object-contain max-h-[450px] max-w-full border-2 border-[#FFD027] rounded-2xl"
              />
            </div>
          </motion.div>
        </div>

        {/* Texto explicativo */}
        <motion.div variants={contentVariants} className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed font-montserrat">
            {comparacaoContent.description}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Comparacao;
