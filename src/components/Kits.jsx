import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Drop, Wind, Gear, CaretLeft, CaretRight } from 'phosphor-react';
// Imagens agora estão na pasta public
const kitsbraspex = "/kitsbraspex.png";
const imagemppr = "/imagemppr.png";
const imagempert = "/imagempert.png";
const multicamadaairtecno = "/multicamadaairtecno.png";
const chassismetalicos = "/chassismetalicos.png";

const Kits = () => {
  const [modalImage, setModalImage] = useState(null);

  const openModal = (image) => {
    setModalImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = 'auto';
  };

  // Estrutura de dados reorganizada para o novo layout
  const kitCategories = [
    {
      id: "kit-agua",
      icon: <Drop className="w-8 h-8 text-blue-500" />,
      title: "Kits de Água Fria e Quente",
      description: "Soluções completas com sistemas PPR e PERT (PEX), garantindo eficiência e segurança para chuveiros e pontos de consumo.",
      items: [
        {
          image: imagemppr,
          title: "Sistema PPR",
          description: "Sistema rígido unido por termofusão, ideal para pontos de consumo que exigem máxima segurança e durabilidade. Suas juntas se tornam uma peça única, eliminando o risco de vazamentos.",
          caption: "Kits em PPR - Polipropileno Copolímero Random",
          variations: [
            "Kit Chuveiro Tê Misturador",
            "Kit Chuveiro Monocomando"
          ]
        },
        {
          image: imagempert,
          title: "Sistema PERT (PEX)",
          description: "Sistema flexível que agiliza a instalação e reduz o número de conexões. Ideal para obras que buscam produtividade e versatilidade em instalações de água quente e fria.",
          caption: "Kits em PERT - Polyethylene of Raised Temperature",
          variations: [
            "Kit Chuveiro Tê Misturador com Registro",
            "Kit Chuveiro Tê Monocomando com Registro"
          ]
        }
      ]
    },
    {
      id: "kit-ar",
      icon: <Wind className="w-8 h-8 text-green-500" />,
      title: "Kits de Ar-Condicionado",
      description: "Sistemas de tubulação multicamada para instalações de ar-condicionado, oferecendo flexibilidade, resistência e facilidade de instalação para projetos residenciais e comerciais.",
      items: [
        {
          image: multicamadaairtecno,
          title: "AirTechno Multicamada",
          description: "Tubulação multicamada com cinco camadas especiais que combinam alumínio e polietileno, proporcionando alta resistência à pressão e flexibilidade para instalação em projetos de climatização.",
          caption: "Kit AirTechno - Sistema Multicamada",
          variations: [
            "Kit Ar-Condicionado 9000 BTUs",
            "Kit Ar-Condicionado 12000 BTUs"
          ]
        }
      ]
    },
    {
      id: "kit-chassis",
      icon: <Gear className="w-8 h-8 text-gray-600" />,
      title: "Chassis Metálicos Industriais",
      description: "Estruturas metálicas robustas e precisas, desenvolvidas para suporte de equipamentos hidráulicos e de climatização, garantindo segurança e durabilidade em instalações industriais e residenciais.",
      items: [
        {
          image: chassismetalicos,
          title: "Chassis Metálicos",
          description: "Estruturas fabricadas em aço galvanizado com tratamento anticorrosivo, projetadas para chuveiros, aquecedores e travessas industriais com acabamento premium e montagem precisa.",
          caption: "Chassis Metálicos Industriais",
          variations: [
            "Chassis para Chuveiros Residenciais",
            "Chassis para Aquecedores Industriais"
          ]
        }
      ]
    }
  ];

  // Carrossel horizontal de kits
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % kitCategories.length);
      }, 7000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [kitCategories.length, autoPlay]);

  const handleManualNavigation = (index) => {
    setAutoPlay(false);
    setActiveIndex(index);
  };

  const activeKit = kitCategories[activeIndex];

  return (
    <>
  <section id="kits" className="py-4 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nossos Kits Industrializados
            </h2>
            <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full mb-8"></div>
          </div>

          {/* Carrossel de Kits */}
          <div className="scroll-mt-24 relative group/carousel">
            {/* Setas de navegação - Desktop */}
            <button
              className="hidden lg:block absolute -left-12 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110"
              onClick={() => handleManualNavigation((activeIndex - 1 + kitCategories.length) % kitCategories.length)}
              aria-label="Anterior"
            >
              <CaretLeft className="w-8 h-8 text-[#FFD027] hover:text-yellow-500" />
            </button>
            <button
              className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110"
              onClick={() => handleManualNavigation((activeIndex + 1) % kitCategories.length)}
              aria-label="Próximo"
            >
              <CaretRight className="w-8 h-8 text-[#FFD027] hover:text-yellow-500" />
            </button>

            {/* Setas de navegação - Mobile */}
            <button
                className="lg:hidden absolute left-2 top-[40%] -translate-y-1/2 z-10 transition-all duration-300 active:scale-110"
                onClick={() => handleManualNavigation((activeIndex - 1 + kitCategories.length) % kitCategories.length)}
                aria-label="Anterior"
              >
                <CaretLeft className="w-6 h-6 text-[#FFD027] drop-shadow-lg" />
              </button>
              <button
                className="lg:hidden absolute right-2 top-[40%] -translate-y-1/2 z-10 transition-all duration-300 active:scale-110"
                onClick={() => handleManualNavigation((activeIndex + 1) % kitCategories.length)}
                aria-label="Próximo"
              >
                <CaretRight className="w-6 h-6 text-[#FFD027] drop-shadow-lg" />
              </button>
            
            {/* Layout Desktop */}
            <div className="hidden lg:flex group flex-row items-stretch gap-8" style={{minHeight:'520px'}}>
              {/* Imagem - sempre à esquerda */}
              <div className="w-1/2 flex items-center justify-center cursor-pointer" onClick={() => openModal(activeKit.items[0])}>
                <div className="border-2 border-[#120229] rounded-2xl p-1 bg-white transition-transform duration-300 hover:scale-105" style={{boxShadow:'0 18px 38px -4px rgba(0,0,0,0.28)'}}>
                  <img
                    src={activeKit.items[0].image}
                    alt={activeKit.items[0].title}
                    className="object-contain max-h-[450px] max-w-full rounded-xl"
                  />
                </div>
              </div>
              {/* Conteúdo - sempre à direita */}
              <div className="w-1/2 flex flex-col justify-start">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">{activeKit.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {activeKit.title}
                  </h3>
                </div>
                
                {activeKit.description && (
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    {activeKit.description}
                  </p>
                )}

                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {activeKit.items[0].title}
                </h4>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {activeKit.items[0].description}
                </p>
                
                {/* Renderiza as variações se existirem */}
                {activeKit.items[0].variations && (
                  <div>
                    <h5 className="text-xl font-semibold text-gray-800 mb-4">Modelos Disponíveis:</h5>
                    <ul className="space-y-3">
                      {activeKit.items[0].variations.map((variation, vIndex) => (
                        <li key={vIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-[#005563]" />
                          <span className="text-lg text-gray-700">{variation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Layout Mobile - Carrossel Vertical */}
            <div className="lg:hidden group flex flex-col px-12" style={{minHeight:'600px'}}>
              {/* Conteúdo - topo */}
              <div className="flex flex-col mb-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-3xl">{activeKit.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {activeKit.title}
                  </h3>
                </div>
                {/* Resumo dos textos para mobile */}
                {activeKit.id === "kit-agua" && (
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Kits completos para água fria e quente, com sistemas rígidos (PPR) ou flexíveis (PERT/PEX) para máxima segurança e agilidade.
                  </p>
                )}
                {activeKit.id === "kit-ar" && (
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Tubulação multicamada para ar-condicionado, flexível e resistente, ideal para projetos residenciais e comerciais.
                  </p>
                )}
                {activeKit.id === "kit-chassis" && (
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Chassis metálicos robustos para suporte de equipamentos hidráulicos e de climatização, com alta durabilidade.
                  </p>
                )}

                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {activeKit.items[0].title}
                </h4>
                {/* Resumo da descrição do produto para mobile */}
                {activeKit.id === "kit-agua" && activeKit.items[0].title === "Sistema PPR" && (
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Sistema rígido por termofusão, máxima segurança e durabilidade, elimina vazamentos.
                  </p>
                )}
                {activeKit.id === "kit-agua" && activeKit.items[0].title === "Sistema PERT (PEX)" && (
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Sistema flexível, instalação rápida e menos conexões, ideal para produtividade.
                  </p>
                )}
                {activeKit.id === "kit-ar" && (
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Cinco camadas combinam alumínio e polietileno, alta pressão e flexibilidade.
                  </p>
                )}
                {activeKit.id === "kit-chassis" && (
                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    Aço galvanizado anticorrosivo, montagem precisa e acabamento premium.
                  </p>
                )}

                {/* Renderiza as variações se existirem */}
                {activeKit.items[0].variations && (
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-800 mb-3">Modelos Disponíveis:</h5>
                    <ul className="space-y-2">
                      {activeKit.items[0].variations.map((variation, vIndex) => (
                        <li key={vIndex} className="flex items-center gap-2 justify-center">
                          <CheckCircle className="w-4 h-4 text-[#005563]" />
                          <span className="text-base text-gray-700">{variation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Imagem - embaixo no mobile */}
              <div className="flex items-center justify-center cursor-pointer" onClick={() => openModal(activeKit.items[0])}>
                <div className="border-2 border-[#120229] rounded-2xl p-1 bg-white transition-transform duration-300 active:scale-105" style={{boxShadow:'0 18px 38px -4px rgba(0,0,0,0.28)'}}>
                  <img
                    src={activeKit.items[0].image}
                    alt={activeKit.items[0].title}
                    className="object-contain max-h-[300px] w-full rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Bolinhas de navegação */}
            <div className="flex justify-center gap-4 mt-8">
              {kitCategories.map((cat, idx) => (
                <button
                  key={cat.id}
                  className={`w-4 h-4 rounded-full border-1 border-[#FFD027] transition-all duration-300 ${activeIndex === idx ? 'bg-[#FFD027] shadow-lg' : 'bg-white hover:bg-[#FFF7D1]'}`}
                  onClick={() => handleManualNavigation(idx)}
                  aria-label={cat.title}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalImage && (
         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors duration-200">
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <img src={modalImage.image} alt={modalImage.title} className="w-full h-auto max-h-[80vh] object-contain" />
            <div className="p-6 bg-white border-t">
              <h4 className="text-xl font-bold text-gray-900">{modalImage.caption}</h4>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Kits;