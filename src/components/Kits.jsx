import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../contexts/SiteContentContext';
import { X, CheckCircle, Droplets, Wind, Settings } from 'lucide-react';
import { safeJsonParse } from '../lib/safeJson';
// Imagens agora estão na pasta public
const imagemppr = "/imagemppr.png";
const multicamadaairtecno = "/multicamadaairtecno.png";
const chassismetalicos = "/chassismetalicos.png";

const Kits = () => {
  const { content } = useSiteContent();
  const kitsContent = content.kits;
  
  const [modalImage, setModalImage] = useState(null);

  const openModal = (image) => {
    setModalImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = 'auto';
  };

  const defaultProducts = [
    {
      id: "sistema-ppr",
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      image: imagemppr,
      title: "Sistema PPR",
      category: "Kits de Água Fria e Quente",
      description:
        "Sistema rígido unido por termofusão, ideal para pontos de consumo que exigem máxima segurança e durabilidade. Suas juntas se tornam uma peça única, eliminando o risco de vazamentos.",
      caption: "Kits em PPR - Polipropileno Copolímero Random",
      variations: ["Kit Chuveiro Tê Misturador", "Kit Chuveiro Monocomando"]
    },
    {
      id: "airtechno",
      icon: <Wind className="w-8 h-8 text-green-500" />,
      image: multicamadaairtecno,
      title: "AirTechno Multicamada",
      category: "Kits de Ar-Condicionado",
      description:
        "Tubulação multicamada com cinco camadas especiais que combinam alumínio e polietileno, proporcionando alta resistência à pressão e flexibilidade para instalação em projetos de climatização.",
      caption: "Kit AirTechno - Sistema Multicamada",
      variations: ["Kit Ar-Condicionado 9000 BTUs", "Kit Ar-Condicionado 12000 BTUs"]
    },
    {
      id: "chassis",
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      image: chassismetalicos,
      title: "Chassis Metálicos",
      category: "Chassis Metálicos Industriais",
      description:
        "Estruturas fabricadas em aço galvanizado com tratamento anticorrosivo, projetadas para chuveiros, aquecedores e travessas industriais com acabamento premium e montagem precisa.",
      caption: "Chassis Metálicos Industriais",
      variations: ["Chassis para Chuveiros Residenciais", "Chassis para Aquecedores Industriais"]
    }
  ];

  const productsFromContent = safeJsonParse(kitsContent?.productsJson, null);
  const products = Array.isArray(productsFromContent)
    ? productsFromContent.map((p) => {
        const base = defaultProducts.find((d) => d.id === p.id) || defaultProducts[0];
        return {
          ...base,
          ...p
        };
      })
    : defaultProducts;

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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

  const productVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <>
      <motion.section
        id="kits"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-5">
          {/* Header */}
          <motion.div variants={titleVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {kitsContent.title}
            </h2>
            <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full mb-8"></div>
          </motion.div>

          {/* Lista de Produtos - Alternando layout */}
          <div className="space-y-20">
            {products.map((product, index) => {
              const isImageLeft = index % 2 === 0; // Par: imagem à esquerda, Ímpar: imagem à direita
              
              return (
                <motion.div 
                  key={product.id}
                  variants={productVariants}
                  className="scroll-mt-24"
                  id={product.id}
                >
                  {/* Layout Desktop */}
                  <div className={`hidden lg:flex items-stretch gap-12 ${!isImageLeft ? 'flex-row-reverse' : ''}`}>
                    {/* Imagem */}
                    <div className="w-1/2 flex items-center justify-center cursor-pointer" onClick={() => openModal(product)}>
                      <div className="border-2 border-[#120229] rounded-2xl p-1 bg-white transition-transform duration-300 hover:scale-105" style={{boxShadow:'0 18px 38px -4px rgba(0,0,0,0.28)'}}>
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-contain max-h-[450px] max-w-full rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="w-1/2 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-4xl">{product.icon}</div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">{product.category}</p>
                          <h3 className="text-3xl font-bold text-gray-900">
                            {product.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-lg text-gray-600 leading-relaxed mb-8">
                        {product.description}
                      </p>
                      
                      {/* Variações */}
                      {product.variations && product.variations.length > 0 && (
                        <div>
                          <h5 className="text-xl font-semibold text-gray-800 mb-4">
                            {kitsContent?.variationsTitle || 'Modelos Disponíveis:'}
                          </h5>
                          <ul className="space-y-3">
                            {product.variations.map((variation, vIndex) => (
                              <li key={vIndex} className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-[#005563] flex-shrink-0" />
                                <span className="text-lg text-gray-700">{variation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Layout Mobile */}
                  <div className="lg:hidden flex flex-col">
                    {/* Conteúdo - topo */}
                    <div className="flex flex-col mb-6 text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="text-3xl">{product.icon}</div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">{product.category}</p>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {product.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-base text-gray-600 leading-relaxed mb-6">
                        {product.description}
                      </p>

                      {/* Variações */}
                      {product.variations && product.variations.length > 0 && (
                        <div className="mb-6">
                          <h5 className="text-lg font-semibold text-gray-800 mb-3">
                            {kitsContent?.variationsTitle || 'Modelos Disponíveis:'}
                          </h5>
                          <ul className="space-y-2">
                            {product.variations.map((variation, vIndex) => (
                              <li key={vIndex} className="flex items-center gap-2 justify-center">
                                <CheckCircle className="w-4 h-4 text-[#005563] flex-shrink-0" />
                                <span className="text-base text-gray-700">{variation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Imagem - embaixo no mobile */}
                    <div className="flex items-center justify-center cursor-pointer" onClick={() => openModal(product)}>
                      <div className="border-2 border-[#120229] rounded-2xl p-1 bg-white transition-transform duration-300 active:scale-105" style={{boxShadow:'0 18px 38px -4px rgba(0,0,0,0.28)'}}>
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-contain max-h-[300px] w-full rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Linha divisória entre produtos (exceto no último) */}
                  {index < products.length - 1 && (
                    <div className="mt-20 border-b-2 border-gray-200"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

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
