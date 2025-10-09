import React from 'react';
import { useSiteContent } from '../contexts/SiteContentContext';
import parceiro1 from '../assets/parceiro1.png';
import parceiro2 from '../assets/parceiro2.png';
import parceria3 from '../assets/parceria3.png';
import parceria4 from '../assets/parceria4.png';
import parceria5 from '../assets/parceria5.png';

const Parceiros = () => {
  const { content } = useSiteContent();
  const parceirosContent = content?.parceiros || { title: 'Nossos Parceiros', subtitle: 'Trabalhamos com as melhores marcas' };
  
  // Estado para controlar o efeito de toque nas imagens no mobile
  const [activeImg, setActiveImg] = React.useState(null);
  
  // Carrossel infinito: quando chega ao fim, volta ao início
  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const scrollWidth = carousel.scrollWidth / 2;
    const handleScroll = () => {
      if (carousel.scrollLeft >= scrollWidth) {
        carousel.scrollLeft = carousel.scrollLeft - scrollWidth;
      } else if (carousel.scrollLeft <= 0) {
        carousel.scrollLeft = carousel.scrollLeft + scrollWidth;
      }
    };
    carousel.addEventListener('scroll', handleScroll);
    // Inicializa no meio para loop
    carousel.scrollLeft = scrollWidth;
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);
  const parceiros = [
    { src: parceiro1, alt: "Parceiro 1" },
    { src: parceiro2, alt: "Parceiro 2" },
    { src: parceria3, alt: "Parceiro 3" },
    { src: parceria4, alt: "Parceiro 4" },
    { src: parceria5, alt: "Parceiro 5" }
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
    document.querySelector('.animate-scroll').style.animationPlayState = 'paused';
  };
  const handleMouseLeave = () => {
    isDragging.current = false;
    carouselRef.current.classList.remove('dragging');
    // Retoma animação
    document.querySelector('.animate-scroll').style.animationPlayState = 'running';
  };
  const handleMouseUp = () => {
    isDragging.current = false;
    carouselRef.current.classList.remove('dragging');
    // Retoma animação
    document.querySelector('.animate-scroll').style.animationPlayState = 'running';
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2; // scroll speed
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Touch events
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.classList.add('dragging');
    // Pausa animação
    document.querySelector('.animate-scroll').style.animationPlayState = 'paused';
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
    carouselRef.current.classList.remove('dragging');
    // Retoma animação
    document.querySelector('.animate-scroll').style.animationPlayState = 'running';
  };
  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {parceirosContent.title}
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            {parceirosContent.subtitle}
          </p>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full"></div>
        </div>
        {/* Carousel Container com scroll manual, drag e animação */}
        <div
          className="relative overflow-x-auto scrollbar-hide"
          style={{WebkitOverflowScrolling:'touch'}}
          ref={carouselRef}
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
                className="flex-shrink-0 w-56 h-40 flex items-center justify-center p-4"
                onTouchStart={() => setActiveImg(index)}
                onTouchEnd={() => setTimeout(() => setActiveImg(null), 200)}
              >
                <img
                  src={parceiro.src}
                  alt={parceiro.alt}
                  draggable={false}
                  className={`max-w-full max-h-full object-contain filter transition-all duration-300 grayscale hover:grayscale-0 hover:scale-125 ${activeImg === index ? 'grayscale-0 scale-125 z-10' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg font-poppins">
            Trabalhamos com os melhores fornecedores do mercado para garantir a qualidade dos nossos produtos.
          </p>
        </div>
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
    </section>
  );
};

export default Parceiros;
