import React from 'react';
import { 
  Lock, 
  Lightning, 
  Factory, 
  Target 
} from 'phosphor-react';

const Vantagens = () => {
  const steps = [
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

  return (
    <section id="vantagens" className="pt-20 pb-12 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Vantagens dos Kits Braspex
          </h2>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full"></div>
        </div>
        {/* Desktop: Layout linear */}
        <div className="hidden md:flex flex-row items-start justify-center gap-8 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center max-w-xs relative px-8"
              style={{ zIndex: 2 }}
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
            </div>
          ))}
        </div>

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
      </div>
    </section>
  );
};

export default Vantagens;
