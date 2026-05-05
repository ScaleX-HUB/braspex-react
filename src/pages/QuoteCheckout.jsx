import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingCart, Check, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useSiteContent } from '../contexts/SiteContentContext';
import { saveQuote } from '../data/quotesUtils';
import { safeJsonParse } from '../lib/safeJson';

const QuoteCheckout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, getCartCount } = useCart();
  const cartCount = getCartCount();
  const { content } = useSiteContent();
  const quoteContent = content.quoteCheckout;

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    empresa: '',
    ddd: '',
    telefone: '',
    endereco: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    estado: '',
    receberNovidades: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatProductsForComment = () => {
    const template = safeJsonParse(quoteContent?.commentTemplateJson, null);
    const header = template?.header || '\n\n=== PRODUTOS DO ORÇAMENTO ===\n\n';
    const quantityLabel = template?.quantityLabel || 'Quantidade';
    const priceLabel = template?.priceLabel || 'Preço';
    const materialLabel = template?.materialLabel || 'Material';
    const capacityLabel = template?.capacityLabel || 'Capacidade';
    const totalItemsLabel = template?.totalItemsLabel || 'TOTAL DE ITENS';
    const footer = template?.footer || '================================\n';

    let productsText = header;
    
    cartItems.forEach((item, index) => {
      productsText += `${index + 1}. ${item.name}\n`;
      productsText += `   ${quantityLabel}: ${item.quantity}\n`;
      productsText += `   ${priceLabel}: ${item.price}\n`;
      if (item.material) productsText += `   ${materialLabel}: ${item.material}\n`;
      if (item.capacity) productsText += `   ${capacityLabel}: ${item.capacity}\n`;
      productsText += `\n`;
    });
    
    productsText += `\n${totalItemsLabel}: ${cartCount}\n`;
    productsText += footer;
    
    return productsText;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Preparar dados da cotação
    const quoteData = {
      customer: {
        name: formData.nomeCompleto,
        email: formData.email,
        phone: `(${formData.ddd}) ${formData.telefone}`,
        company: formData.empresa,
        address: formData.endereco,
        complement: formData.complemento,
        neighborhood: formData.bairro,
        city: formData.cidade,
        state: formData.estado,
        zipCode: formData.cep,
        receiveNews: formData.receberNovidades,
        message: formatProductsForComment()
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        material: item.material,
        capacity: item.capacity,
        image: item.image
      })),
      source: 'cart' // Identificar origem da cotação
    };

    // Salvar cotação
    const savedQuote = saveQuote(quoteData);

    if (savedQuote) {
      console.log('✅ Cotação salva com sucesso:', savedQuote);
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Limpar carrinho após sucesso
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 3000);
    } else {
      console.error('❌ Erro ao salvar cotação');
      setIsSubmitting(false);
      alert(quoteContent?.submitError || 'Erro ao enviar cotação. Por favor, tente novamente.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCart size={80} className="text-slate-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {quoteContent?.cartEmptyTitle || 'Carrinho Vazio'}
            </h2>
            <p className="text-slate-600 mb-8">
              {quoteContent?.cartEmptyDescription || 'Adicione produtos ao carrinho antes de solicitar um orçamento'}
            </p>
            <button
              onClick={() => navigate('/produtos')}
              className="bg-[#005563] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#003d47] transition-colors"
            >
              {quoteContent?.cartEmptyButton || 'Ver Produtos'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {quoteContent?.successTitle || 'Orçamento Enviado com Sucesso!'}
            </h2>
            <p className="text-slate-600 mb-4">
              {quoteContent?.successDescription || 'Recebemos sua solicitação e entraremos em contato em breve.'}
            </p>
            <p className="text-sm text-slate-500">
              {quoteContent?.successRedirecting || 'Redirecionando para a página inicial...'}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {quoteContent?.pageTitle || 'Finalizar Orçamento'}
          </h1>
          <p className="text-slate-600">
            {quoteContent?.pageSubtitle || 'Preencha seus dados para receber um orçamento personalizado'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Passo 01 - Produtos */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-[#005563] text-white px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="bg-white text-[#005563] px-3 py-1 rounded text-sm font-bold">
                  {quoteContent?.step01Label || 'Passo 01'}
                </span>
                {quoteContent?.step01Title || 'Confira e preencha a quantidade de cada produto adicionado'}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 pb-2 border-b border-slate-200 text-sm font-semibold text-slate-700">
                  <div className="col-span-6">{quoteContent?.tableProducts || 'Produtos'}</div>
                  <div className="col-span-3 text-center">{quoteContent?.tableQuantity || 'Quantidade'}</div>
                  <div className="col-span-3 text-center">{quoteContent?.tableAction || 'Ação'}</div>
                </div>
                
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-slate-100">
                    <div className="col-span-6 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain bg-slate-50 rounded p-1"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.material || item.capacity || ''}</p>
                      </div>
                    </div>
                    <div className="col-span-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        readOnly
                        className="w-20 px-3 py-2 border border-slate-300 rounded text-center font-semibold"
                      />
                    </div>
                    <div className="col-span-3 text-center">
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={() => navigate('/produtos')}
                className="mt-6 text-[#005563] font-semibold hover:text-[#003d47] transition-colors"
              >
                {quoteContent?.continueShopping || 'Continuar Orçando'}
              </button>
            </div>
          </div>

          {/* Passo 02 - Dados */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-[#005563] text-white px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="bg-white text-[#005563] px-3 py-1 rounded text-sm font-bold">
                  {quoteContent?.step02Label || 'Passo 02'}
                </span>
                {quoteContent?.step02Title || 'Preencha seus dados abaixo e envie o orçamento'}
              </h2>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6">
                {(() => {
                  const raw = quoteContent?.requiredHint || 'Os campos marcados com {required} são obrigatórios.';
                  const parts = String(raw).split('{required}');
                  if (parts.length === 1) return raw;
                  return (
                    <>
                      {parts[0]}
                      <span className="text-red-500">*</span>
                      {parts.slice(1).join('{required}')}
                    </>
                  );
                })()}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome Completo */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {quoteContent?.nameLabel || 'Nome Completo'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  />
                </div>

                {/* E-mail */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {quoteContent?.emailLabel || 'E-mail'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  />
                </div>

                {/* Empresa */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {quoteContent?.companyLabel || 'Empresa'}
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  />
                </div>

                {/* Telefone */}
                <div className="md:col-span-1 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {quoteContent?.dddLabel || 'DDD'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ddd"
                      value={formData.ddd}
                      onChange={handleChange}
                      required
                      maxLength="3"
                      placeholder={quoteContent?.dddPlaceholder || '11'}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {quoteContent?.phoneLabel || 'Telefone'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      placeholder={quoteContent?.phonePlaceholder || '99999-9999'}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {quoteContent?.addressLabel || 'Endereço'}
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  />
                </div>

                {/* Complemento */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {quoteContent?.complementLabel || 'Complemento'}
                  </label>
                  <input
                    type="text"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  />
                </div>

                {/* Bairro */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {quoteContent?.neighborhoodLabel || 'Bairro'}
                  </label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  />
                </div>

                {/* Cidade */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {quoteContent?.cityLabel || 'Cidade'}
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  />
                </div>

                {/* CEP */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {quoteContent?.zipLabel || 'CEP'}
                  </label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder={quoteContent?.zipPlaceholder || '00000-000'}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  />
                </div>

                {/* Estado */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {quoteContent?.stateLabel || 'Estado'}
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  >
                    <option value="">{quoteContent?.stateSelectPlaceholder || 'Selecione'}</option>
                    {(() => {
                      const parsed = safeJsonParse(quoteContent?.stateOptionsJson, null);
                      const options = Array.isArray(parsed)
                        ? parsed
                        : [
                            { value: 'SP', label: 'São Paulo' },
                            { value: 'RJ', label: 'Rio de Janeiro' },
                            { value: 'MG', label: 'Minas Gerais' },
                            { value: 'ES', label: 'Espírito Santo' },
                            { value: 'PR', label: 'Paraná' },
                            { value: 'SC', label: 'Santa Catarina' },
                            { value: 'RS', label: 'Rio Grande do Sul' }
                          ];
                      return options
                        .filter((opt) => opt && typeof opt === 'object')
                        .map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ));
                    })()}
                  </select>
                </div>
              </div>

              {/* Comentários */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {quoteContent?.commentsLabel || 'Comentários'}
                </label>
                <textarea
                  name="comentarios"
                  rows="5"
                  placeholder={quoteContent?.commentsPlaceholder || 'Informações adicionais sobre o orçamento...'}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent resize-none"
                  defaultValue={formatProductsForComment()}
                ></textarea>
              </div>

              {/* Checkbox */}
              <div className="mt-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="receberNovidades"
                    checked={formData.receberNovidades}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span className="text-sm text-slate-600">
                    {quoteContent?.receiveNewsText || 'Aceito receber novidades e informações da Braspex.'}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>{quoteContent?.submittingText || 'Enviando...'}</>
                  ) : (
                    <>
                      <Package size={24} />
                      {quoteContent?.submitButtonText || 'Enviar Orçamento'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteCheckout;
