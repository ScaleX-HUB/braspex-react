import React from 'react';
import { PlayCircle, Buildings, Wrench, Wind } from 'phosphor-react';
import heroImage from '../assets/hero-bg.jpg';

const Hero = () => {
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

  // Hover/touch effect nos ícones para mobile
  const [activeIcon, setActiveIcon] = React.useState(null);

  const handleIconTouchStart = (idx) => setActiveIcon(idx);
  const handleIconTouchEnd = () => setTimeout(() => setActiveIcon(null), 200);

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center px-2 md:px-5 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
    <div className="relative z-20 w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center pt-8 md:pt-20 px-2 md:px-0">
  <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white drop-shadow-lg font-montserrat animate-fade-in-up px-2 md:px-0">
          <span className="block text-[#FFD027] mb-2">Soluções Industrializadas</span>
          <span className="block">para Construção Civil</span>
        </h1>
        <div className="flex justify-center gap-3 md:gap-6 mb-6 md:mb-8 animate-fade-in-up delay-200 px-2 md:px-0">
          <div
            className={`flex flex-col items-center group hero-icon-group transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg ${activeIcon === 0 ? 'scale-110 shadow-lg' : ''}`}
            onTouchStart={() => handleIconTouchStart(0)}
            onTouchEnd={handleIconTouchEnd}
          >
            <Buildings className="w-9 h-9 md:w-10 md:h-10 text-[#FFD027] mb-2" />
            <span className="text-white text-sm md:text-base font-poppins-medium">Projetos Personalizados</span>
          </div>
          <div
            className={`flex flex-col items-center group hero-icon-group transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg ${activeIcon === 1 ? 'scale-110 shadow-lg' : ''}`}
            onTouchStart={() => handleIconTouchStart(1)}
            onTouchEnd={handleIconTouchEnd}
          >
            <Wrench className="w-9 h-9 md:w-10 md:h-10 text-[#FFD027] mb-2" />
            <span className="text-white text-sm md:text-base font-poppins-medium">Kits Hidráulicos</span>
          </div>
          <div
            className={`flex flex-col items-center group hero-icon-group transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg ${activeIcon === 2 ? 'scale-110 shadow-lg' : ''}`}
            onTouchStart={() => handleIconTouchStart(2)}
            onTouchEnd={handleIconTouchEnd}
          >
            <Wind className="w-9 h-9 md:w-10 md:h-10 text-[#FFD027] mb-2" />
            <span className="text-white text-sm md:text-base font-poppins-medium">Climatização Eficiente</span>
          </div>
        </div>
  <p className="text-base md:text-xl text-white/80 mb-6 md:mb-8 font-poppins animate-fade-in-up delay-400 max-w-xs md:max-w-xl mx-auto px-2 md:px-0">
          Da engenharia ao resultado final: kits prontos para instalação, qualidade garantida e agilidade para sua obra.
        </p>
        <div className="flex justify-center gap-3 md:gap-4 animate-fade-in-up delay-600 px-2 md:px-0">
          <button
            onClick={() => scrollToSection('contato')}
            className="bg-[#FFD027] text-[#005563] rounded-lg font-bold text-base md:text-lg shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FFD027]/40 transition-all duration-300 px-3 md:px-8 py-3 md:py-4"
          >
            Solicitar Cotação
          </button>
          <button
            onClick={() => window.open('https://www.youtube.com/@braspexoficial', '_blank')}
            className="flex items-center bg-transparent border-2 border-white text-white rounded-lg font-bold text-base md:text-lg hover:bg-white hover:text-[#005563] transition-all duration-300 px-3 md:px-8 py-3 md:py-4"
          >
            <PlayCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
            Ver Vídeo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;