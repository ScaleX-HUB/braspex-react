import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../contexts/SiteContentContext';
import { Mail, Phone, Globe, MapPin, Send, User, Building2, MessageCircle, CheckCircle } from 'lucide-react';
import { saveQuote } from '../data/quotesUtils';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Salvar cotação no sistema local
      const quoteData = {
        customer: {
          name: formData.nome,
          email: formData.email,
          phone: formData.telefone,
          company: formData.empresa,
          message: formData.mensagem
        },
        items: [], // Sem itens específicos, é um contato direto
        source: 'contact-form' // Identificar origem
      };
      
      saveQuote(quoteData);
      
      // Enviar para SheetDB
      await fetch('https://sheetdb.io/api/v1/5h8knwp5z36hw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              'Nome Completo': formData.nome,
              'Empresa': formData.empresa || '',
              'E-mail': formData.email,
              'Telefone': formData.telefone || '',
              'Mensagem': formData.mensagem,
            }
          ]
        }),
      });
      
      setIsSuccess(true);
      setFormData({
        nome: '',
        empresa: '',
        email: '',
        telefone: '',
        mensagem: ''
      });
      
      // Resetar após 3 segundos
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      alert(contatoContent.errorMessage);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
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
        <motion.form variants={formVariants} onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-900 mb-2">
                {contatoContent.nameLabel} {contatoContent.requiredMark}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300 bg-white text-gray-900"
                  placeholder={contatoContent.namePlaceholder}
                />
              </div>
            </div>
            <div>
              <label htmlFor="empresa" className="block text-sm font-medium text-gray-900 mb-2">
                {contatoContent.companyLabel}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300 bg-white text-gray-900"
                  placeholder={contatoContent.companyPlaceholder}
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                {contatoContent.emailLabel} {contatoContent.requiredMark}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300 bg-white text-gray-900"
                  placeholder={contatoContent.emailPlaceholder}
                />
              </div>
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-900 mb-2">
                {contatoContent.phoneLabel}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300 bg-white text-gray-900"
                  placeholder={contatoContent.phonePlaceholder}
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium text-gray-900 mb-2">
              {contatoContent.messageLabel} {contatoContent.requiredMark}
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-4 text-gray-600 w-5 h-5" />
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent transition-all duration-300 resize-none bg-white text-gray-900"
                placeholder={contatoContent.messagePlaceholder}
              />
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            className="w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 bg-[#005563] text-white hover:bg-[#007A8A]"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-white">{contatoContent.successTitle}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? contatoContent.submittingText : contatoContent.submitButtonText}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default Contato;
