import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkle, Target, Lightbulb } from 'phosphor-react';

const Sobre = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section id="sobre" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#005563] mb-4">
            Sobre a Braspex
          </h2>
          <div className="w-20 h-1 bg-[#FFD027] mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Conteúdo Textual */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-gray-700 leading-relaxed">
              A Braspex é uma empresa inovadora no setor de <strong className="text-[#005563]">soluções industrializadas para instalações prediais</strong>. Nascida da sólida experiência do <strong className="text-[#005563]">Grupo Protogás</strong>, atua com excelência na fabricação de kits hidráulicos, de gás e frigorígenos, oferecendo produtos que unem qualidade, padronização e eficiência.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-base md:text-lg text-gray-700 leading-relaxed">
              Com um modelo produtivo moderno e altamente controlado, a Braspex garante que suas soluções cheguem <strong className="text-[#005563]">prontas para a obra</strong>, simplificando as etapas de instalação e reduzindo significativamente prazos, custos e retrabalhos. Cada kit é desenvolvido com tecnologia de ponta e rigor técnico, assegurando desempenho superior e confiabilidade em todas as aplicações.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-base md:text-lg text-gray-700 leading-relaxed">
              Mais do que fornecer produtos, a Braspex entrega <strong className="text-[#005563]">praticidade, segurança e inovação</strong>, contribuindo para a evolução do setor e para o sucesso de cada projeto executado.
            </motion.p>
          </motion.div>

          {/* Diferenciais */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#FFD027]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#005563] rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-[#FFD027]" weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#005563] mb-2">Qualidade Certificada</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Produtos desenvolvidos com tecnologia de ponta e rigor técnico, garantindo desempenho superior.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#FFD027]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#005563] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-[#FFD027]" weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#005563] mb-2">Eficiência Garantida</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Soluções prontas para obra que reduzem prazos, custos e retrabalhos significativamente.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#FFD027]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#005563] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-[#FFD027]" weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#005563] mb-2">Inovação Constante</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Modelo produtivo moderno e altamente controlado, sempre buscando evoluir e inovar.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#FFD027]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#005563] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkle className="w-6 h-6 text-[#FFD027]" weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#005563] mb-2">Experiência Sólida</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Respaldados pela expertise do Grupo Protogás, líder no segmento de instalações de gás.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 md:mt-20"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#005563] mb-2">15+</div>
            <div className="text-sm md:text-base text-gray-600">Anos de Experiência</div>
          </motion.div>
          <motion.div variants={fadeInUp} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#005563] mb-2">500+</div>
            <div className="text-sm md:text-base text-gray-600">Projetos Entregues</div>
          </motion.div>
          <motion.div variants={fadeInUp} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#005563] mb-2">100%</div>
            <div className="text-sm md:text-base text-gray-600">Satisfação dos Clientes</div>
          </motion.div>
          <motion.div variants={fadeInUp} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#005563] mb-2">24h</div>
            <div className="text-sm md:text-base text-gray-600">Suporte Técnico</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Sobre;
