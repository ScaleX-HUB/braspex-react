import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Check, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { getProductById, useProductsSync } from '../data/productsUtils';
import { safeJsonParse } from '../lib/safeJson';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { content } = useSiteContent();
  const productDetailContent = content.productDetailPage;
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar produto
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const prod = await getProductById(id);
      setProduct(prod);
      setLoading(false);
      if (prod) document.title = `${prod.name} | Braspex`;
    };
    loadProduct();
  }, [id]);

  // Sincronizar quando produtos forem atualizados
  useProductsSync(async () => {
    const prod = await getProductById(id);
    setProduct(prod);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005563] mx-auto mb-4"></div>
            <p className="text-gray-600">{productDetailContent?.loadingText || 'Carregando produto...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{productDetailContent?.notFoundTitle || 'Produto não encontrado'}</h1>
            <Link 
              to="/produtos" 
              className="inline-flex items-center gap-2 text-[#005563] hover:text-[#003d47] transition-colors"
            >
              <ArrowLeft size={20} />
              {productDetailContent?.backToProducts || 'Voltar para produtos'}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Preparar especificações para exibição
  const specifications = product.specifications || {};
  const specLabels = safeJsonParse(productDetailContent?.specLabelsJson, null);
  const getSpecLabel = (key, fallback) => {
    if (specLabels && typeof specLabels === 'object' && typeof specLabels[key] === 'string' && specLabels[key].trim()) {
      return specLabels[key].trim();
    }
    return fallback;
  };
  const specsArray = [];
  
  if (specifications.material) specsArray.push(`${getSpecLabel('material', 'Material')}: ${specifications.material}`);
  if (specifications.acabamento) specsArray.push(`${getSpecLabel('acabamento', 'Acabamento')}: ${specifications.acabamento}`);
  if (specifications.capacity) specsArray.push(`${getSpecLabel('capacity', 'Capacidade')}: ${specifications.capacity}`);
  if (specifications.dimensions) specsArray.push(`${getSpecLabel('dimensions', 'Dimensões')}: ${specifications.dimensions}`);
  if (specifications.diametros && specifications.diametros.length > 0) {
    specsArray.push(`${getSpecLabel('diametros', 'Diâmetros')}: ${specifications.diametros.join(', ')}`);
  }
  if (specifications.normas && specifications.normas.length > 0) {
    specsArray.push(`${getSpecLabel('normas', 'Normas')}: ${specifications.normas.join(', ')}`);
  }

  // Preparar imagens (usar product.image se images não existir)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : ['/placeholder-product.png'];

  const handleAddToCart = () => {
    addToCart(product);
  };

  const openImageModal = (index) => {
    setSelectedImage(index);
    setImageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              to="/produtos" 
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#005563] transition-colors"
            >
              <ArrowLeft size={16} />
              {productDetailContent?.backToProducts || 'Voltar para produtos'}
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <div 
                  className="aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openImageModal(0)}
                >
                  <img 
                    src={productImages[0]} 
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                  />
                </div>
              </div>

              {/* Thumbnail Gallery (if multiple images) */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {productImages.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => openImageModal(index)}
                      className={`aspect-square bg-white rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedImage === index ? 'border-[#005563]' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt={`${product.name} - ${index + 1}`} className="w-full h-full object-contain p-2" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold text-slate-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-[#005563]">{product.price}</span>
              </div>

              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Variations */}
              {product.variations && product.variations.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">{productDetailContent?.variationsTitle || 'Variações Disponíveis:'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variations.map((variation, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm border border-slate-200"
                      >
                        {variation}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart(product.id)}
                  className={`flex-1 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                    isInCart(product.id)
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-[#005563] text-white hover:bg-[#003d47] hover:shadow-lg'
                  }`}
                >
                  {isInCart(product.id) ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={24} />
                      {productDetailContent?.inCart || 'No Carrinho'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart size={24} />
                      {productDetailContent?.addToBudget || 'Adicionar ao Orçamento'}
                    </span>
                  )}
                </button>

                <Link
                  to="/#contato"
                  className="px-8 py-4 bg-white border-2 border-[#005563] text-[#005563] rounded-xl font-semibold text-lg hover:bg-[#005563] hover:text-white transition-all text-center"
                >
                  {productDetailContent?.requestQuote || 'Solicitar Cotação'}
                </Link>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{productDetailContent?.specsTitle || 'Especificações Técnicas'}</h3>
                <ul className="space-y-2">
                  {specsArray.map((spec, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-700">
                      <span className="text-[#005563] mt-1">•</span>
                      <span className="text-sm">{spec}</span>
                    </li>
                  ))}
                  {specsArray.length === 0 && (
                    <li className="text-sm text-gray-500">{productDetailContent?.specsEmpty || 'Nenhuma especificação disponível'}</li>
                  )}
                </ul>
              </div>

              {/* What's Included */}
              {product.includes && product.includes.length > 0 && (
                <div className="bg-gradient-to-br from-[#005563] to-[#003d47] rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">{productDetailContent?.includesTitle || 'O que está incluído:'}</h3>
                  <ul className="space-y-2">
                    {product.includes.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check size={20} className="text-[#FFD027] mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {imageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#FFD027] transition-colors"
          >
            <X size={32} />
          </button>
          <img 
            src={productImages[selectedImage]} 
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
