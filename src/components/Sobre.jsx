import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkle, Target, Lightbulb } from 'phosphor-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';

const Sobre = () => {
  const { content } = useSiteContent();
  const sobreContent = content?.sobre || {};

  const defaultDifferentials = [
    {
      icon: <CheckCircle className="w-6 h-6 text-[#FFD027]" weight="bold" />,
      title: 'Qualidade Certificada',
      description: 'Produtos desenvolvidos com tecnologia de ponta e rigor técnico, garantindo desempenho superior.'
    },
    {
      icon: <Target className="w-6 h-6 text-[#FFD027]" weight="bold" />,
      title: 'Eficiência Garantida',
      description: 'Soluções prontas para obra que reduzem prazos, custos e retrabalhos significativamente.'
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-[#FFD027]" weight="bold" />,
      title: 'Inovação Constante',
      description: 'Modelo produtivo moderno e altamente controlado, sempre buscando evoluir e inovar.'
    },
    {
      icon: <Sparkle className="w-6 h-6 text-[#FFD027]" weight="bold" />,
      title: 'Experiência Sólida',
      description: 'Respaldados pela expertise do Grupo Protogás, líder no segmento de instalações de gás.'
    }
  ];

  const parsedDifferentials = safeJsonParse(sobreContent.differentialsJson, null);
  const differentials = Array.isArray(parsedDifferentials)
    ? parsedDifferentials.map((d, idx) => ({
        icon: defaultDifferentials[idx]?.icon,
        title: d?.title ?? defaultDifferentials[idx]?.title,
        description: d?.description ?? defaultDifferentials[idx]?.description
      }))
    : defaultDifferentials;

  const defaultStats = [
    { value: '15+', label: 'Anos de Experiência' },
    { value: '500+', label: 'Projetos Entregues' },
    { value: '100%', label: 'Satisfação dos Clientes' },
    { value: '24h', label: 'Suporte Técnico' }
  ];
  const parsedStats = safeJsonParse(sobreContent.statsJson, null);
  const stats = Array.isArray(parsedStats) ? parsedStats : defaultStats;

  const paragraphs = (sobreContent.content || '').split('\n\n').filter(Boolean);
  
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
            {sobreContent.title}
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
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={fadeInUp}
                className="text-base md:text-lg text-gray-700 leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          {/* Diferenciais */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {differentials.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#FFD027]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#005563] rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#005563] mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#005563] mb-2">{stat.value}</div>
              <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Sobre;
