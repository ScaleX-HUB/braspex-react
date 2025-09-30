import React, { useState } from 'react';
import { Envelope, Phone, Globe, MapPin, PaperPlaneTilt, User, Buildings, ChatCircle } from 'phosphor-react';

const Contato = () => {
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

  return (
    <section id="contato" className="py-20 bg-white">
  <div className="max-w-3xl mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Solicite uma Cotação Personalizada
          </h2>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full mb-8"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <button
            type="submit"
            className="w-full bg-[#005563] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#007A8A] transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-0.5"
          >
            <PaperPlaneTilt className="w-5 h-5" />
            Enviar Mensagem
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contato;
