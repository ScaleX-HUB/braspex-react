import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroImage from '../assets/hero-bg.jpg';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 84;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const heroCards = [
    {
      title: 'Sobre',
      description: 'Industrialização, engenharia e controle técnico para acelerar obras com padrão Braspex.',
      action: 'Conhecer a história',
      target: 'sobre'
    },
    {
      title: 'Nossos Kits',
      description: 'Kits produzidos em ambiente controlado, com rastreabilidade e montagem precisa.',
      action: 'Ver kits',
      target: 'kits-showcase'
    },
    {
      title: 'Como Trabalhamos',
      description: 'Processo técnico do projeto à entrega para manter qualidade, prazo e previsibilidade.',
      action: 'Ver processo',
      target: 'fluxo'
    }
  ];

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#001f26]">
      <Motion.div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: `url(${heroImage})`, backgroundPosition: 'center 44%' }}
        initial={{ opacity: 0.92, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 5.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/34 via-[#001f26]/18 to-black/72" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/58 via-black/16 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pb-12 pt-28 md:px-12 lg:px-16 lg:pb-44 lg:pt-32">
        <div className="max-w-4xl">
          <Motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="font-display font-bold text-white"
          >
            <span className="block max-w-3xl text-xl leading-tight sm:text-2xl md:text-[1.9rem] lg:text-[2.2rem]">
              Os melhores sistemas industrializados para obras de construção civil do
            </span>
            <span className="mt-2 block text-[3.65rem] leading-[0.9] text-[#FFD027] sm:text-[4.8rem] md:text-[5.7rem] lg:text-[6.65rem]">
              NORDESTE
            </span>
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-5 max-w-xl text-sm leading-relaxed text-white/72 md:text-base"
          >
            Especialistas em sistemas de tubulação PPR, multicamada e chassis metálicos.
          </Motion.p>
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.38 }}
          className="mt-14 grid gap-4 md:grid-cols-3 lg:absolute lg:bottom-9 lg:left-16 lg:right-16 lg:mt-0"
        >
          {heroCards.map((card) => (
            <button
              key={card.title}
              onClick={() => scrollToSection(card.target)}
              className="border border-white/14 bg-black/48 p-5 text-left text-white shadow-2xl backdrop-blur-sm transition-colors hover:border-[#FFD027]/70 hover:bg-black/60"
            >
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-white">
                {card.title}
              </span>
              <span className="mt-3 block text-sm leading-relaxed text-white/76">
                {card.description}
              </span>
              <span className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFD027]">
                {card.action}
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          ))}
        </Motion.div>
      </div>
    </section>
  );
};

export default Hero;
