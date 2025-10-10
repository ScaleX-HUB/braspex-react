import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Envelope, Phone, Globe, MapPin, PaperPlaneTilt, User, Buildings, ChatCircle } from 'phosphor-react';

const Contato = () => {
  const { content } = useSiteContent();
  const contatoContent = content.contato;
  
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    mensagem: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica de envio do formulário
    console.log('Dados do formulário:', formData);
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    
    // Limpar formulário
    setFormData({
      nome: '',
      empresa: '',
      email: '',
      telefone: '',
      mensagem: ''
    });
  };

  const contactInfo = [
    {
      icon: <Envelope className="w-6 h-6" />,
      label: "E-mail",
      value: "braspexne@gmail.com ",
      href: "mailto:braspexne@gmail.com "
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: "Telefone",
      value: "(81) 3342-1022",
      href: "http://wa.me/5581986431000"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: "Website",
      value: "www.braspex.com.br",
      href: "https://www.braspexne.com.br"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: "Endereço",
      value: "Porta Larga – Jaboatão dos Guararapes/PE",
      href: "https://share.google/fuX1aRpit49zobeYR"
    }
  ];

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.section
      id="contato"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="py-20 bg-white"
    >
      <div className="max-w-3xl mx-auto px-5">
        <motion.div variants={titleVariants} className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {contatoContent.title}
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            {contatoContent.subtitle}
          </p>
          <p className="text-gray-600 mb-6">
            {contatoContent.description}
          </p>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full mb-8"></div>
        </motion.div>
        <motion.form variants={formVariants} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>
            <div>
              <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <div className="relative">
                <Buildings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300"
                  placeholder="Nome da empresa"
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail *
              </label>
              <div className="relative">
                <Envelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300"
                  placeholder="(81) 9999-9999"
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem *
            </label>
            <div className="relative">
              <ChatCircle className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Descreva seu projeto e necessidades..."
              />
            </div>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#005563] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#007A8A] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <PaperPlaneTilt className="w-5 h-5" />
            Enviar Mensagem
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default Contato;
