import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Package, ShoppingCart } from 'phosphor-react';
import { Link } from 'react-router-dom';

const ProductsShowcase = () => {
  const featuredProducts = [
    {
      id: 'kit-chuveiro-ppr',
      name: 'Kit Chuveiro PPR',
      description: 'Sistema rígido unido por termofusão para instalações residenciais e comerciais',
      icon: '🚿',
      image: '/imagemppr.png',
      features: ['Resistente', 'Durável', 'Atóxico']
    },
    {
      id: 'kit-ar-condicionado',
      name: 'Kits Ar-Condicionado',
      description: 'Tubulação completa de cobre para sistemas de refrigeração de 9K a 48K BTU',
      icon: '❄️',
      image: '/multicamadaairtecno.png',
      features: ['Alta Performance', 'Isolamento Térmico', 'Múltiplas Capacidades']
    },
    {
      id: '1000-travessas',
      name: '1000 Travessas',
      description: 'Estruturas em aço galvanizado para suporte de tubulações industriais',
      icon: '🔧',
      image: '/chassismetalicos.png',
      features: ['Aço Galvanizado', 'Alta Carga', 'Durabilidade']
    }
  ];

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#005563] font-semibold text-lg mb-2 uppercase tracking-wide">
            Produtos em Destaque
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Soluções Completas em Tubulações
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Conheça nossos principais kits industriais desenvolvidos para máxima eficiência e durabilidade
          </p>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200"
            >
              {/* Product Image */}
              <div className="relative h-56 bg-gradient-to-br from-[#005563]/5 to-[#005563]/10 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 text-4xl">
                  {product.icon}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#005563] transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#005563]/5 text-[#005563] text-xs font-medium rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  to={`/produtos/${product.id}`}
                  className="inline-flex items-center gap-2 text-[#005563] font-semibold hover:text-[#003d47] transition-colors group/link mt-2"
                >
                  Ver Detalhes
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action - Ver Todos os Produtos */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/produtos"
            className="inline-flex items-center gap-3 bg-[#005563] text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:bg-[#003d47] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <Package size={24} weight="bold" />
            Ver Todos os Produtos
            <ArrowRight size={24} weight="bold" />
          </Link>
          <p className="mt-4 text-slate-600">
            Explore nossa linha completa de kits industriais
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsShowcase;
