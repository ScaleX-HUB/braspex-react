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
      items: [
        {
          image: multicamadaairtecno,
          title: "AirTechno Multicamada",
          description: "Para máquinas de 9000 Btus até 48000 Btus (com bitolas de 14mm a 20 mm).",
          caption: "Kit AirTechno - Sistema Multicamada"
        }
      ]
    },
    {
      id: "kit-chassis",
      icon: <Gear className="w-8 h-8 text-gray-600" />,
      title: "Chassis Metálicos Industriais",
      items: [
        {
          image: chassismetalicos,
          title: "Chassis Metálicos",
          description: "Estruturas para chuveiros, aquecedores e travessas industriais, com acabamento premium e montagem precisa.",
          caption: "Chassis Metálicos Industriais"
        }
      ]
    }
  ];

  // Carrossel horizontal de kits
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % kitCategories.length);
    }, 7000);
    return () => clearInterval(intervalRef.current);
  }, [kitCategories.length]);

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
          <div className="scroll-mt-24 relative">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-4xl">{activeKit.icon}</div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {activeKit.title}
                </h3>
              </div>
              {activeKit.description && (
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {activeKit.description}
                </p>
              )}
            </div>

            {/* Setas laterais */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-colors duration-200 border border-gray-200"
              style={{marginLeft: '-32px'}}
              onClick={() => setActiveIndex((activeIndex - 1 + kitCategories.length) % kitCategories.length)}
              aria-label="Anterior"
            >
              <CaretLeft className="w-6 h-6 text-gray-500" />
            </button>
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col md:flex-row items-center" style={{minHeight:'360px', height:'360px'}}>
              {/* Imagem */}
              <div className="w-full md:w-1/2 flex items-center justify-center cursor-pointer bg-gray-50" style={{height:'360px', minHeight:'360px'}} onClick={() => openModal(activeKit.items[0])}>
                <img
                  src={activeKit.items[0].image}
                  alt={activeKit.items[0].title}
                  className="object-contain w-full h-full max-h-[320px] max-w-[320px] mx-auto transition-transform duration-300 group-hover:scale-105"
                  style={{height:'320px', width:'320px', maxHeight:'320px', maxWidth:'320px'}}
                />
              </div>
              {/* Conteúdo */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center" style={{height:'360px', minHeight:'360px'}}>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  {activeKit.items[0].title}
                </h4>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {activeKit.items[0].description}
                </p>
                {/* Renderiza as variações se existirem */}
                {activeKit.items[0].variations && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Modelos Disponíveis:</h5>
                    <ul className="space-y-2">
                      {activeKit.items[0].variations.map((variation, vIndex) => (
                        <li key={vIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-[#005563]" />
                          <span className="text-gray-700">{variation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-colors duration-200 border border-gray-200"
              style={{marginRight: '-32px'}}
              onClick={() => setActiveIndex((activeIndex + 1) % kitCategories.length)}
              aria-label="Próximo"
            >
              <CaretRight className="w-6 h-6 text-gray-500" />
            </button>

            {/* Bolinhas de navegação */}
            <div className="flex justify-center gap-4 mt-8">
              {kitCategories.map((cat, idx) => (
                <button
                  key={cat.id}
                  className={`w-4 h-4 rounded-full border-2 border-[#FFD027] transition-all duration-300 ${activeIndex === idx ? 'bg-[#FFD027] shadow-lg' : 'bg-white hover:bg-[#FFF7D1]'}`}
                  onClick={() => setActiveIndex(idx)}
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