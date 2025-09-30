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
      <div className="max-w-6xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Solicite uma Cotação Personalizada
          </h2>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Entre em contato conosco para receber uma proposta personalizada para seu projeto. 
            Nossa equipe técnica está pronta para atendê-lo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Informações de Contato
            </h3>
            
            <div className="space-y-6 mb-12">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 bg-[#005563] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                    <p className="text-lg text-gray-900 font-semibold">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-[#005563] to-[#007A8A] p-8 rounded-2xl text-white">
              <h4 className="text-xl font-bold mb-4">Por que escolher a BRASPEX?</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD027] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Experiência e credibilidade no mercado</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD027] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Kits personalizados para cada projeto</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD027] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Suporte técnico especializado</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FFD027] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Garantia de qualidade e prazo</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Envie sua Mensagem
            </h3>
            
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
        </div>
      </div>
    </section>
  );
};

export default Contato;
