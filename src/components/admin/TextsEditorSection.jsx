import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, MessageCircle } from 'lucide-react';

const TextsEditorSection = () => {
  const [texts, setTexts] = useState(() => {
    // Carregar do localStorage
    const saved = localStorage.getItem('braspex_site_texts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar textos:', e);
      }
    }
    
    // Valores padrão
    return {
      hero: {
        title: 'Soluções Completas em Sistemas Hidráulicos',
        subtitle: 'Kits industriais pré-montados com garantia e suporte técnico especializado',
        buttonText: 'Ver Produtos'
      },
      sobre: {
        title: 'Sobre a BRASPEX',
        description: 'Especializada em sistemas hidráulicos industrializados...'
      },
      vantagens: {
        title: 'Por que escolher os Kits BRASPEX?',
        items: [
          { title: 'Instalação Rápida', description: 'Até 70% mais rápido' },
          { title: 'Economia Garantida', description: 'Redução de custos' },
          { title: 'Qualidade Certificada', description: 'Normas técnicas' }
        ]
      },
      parceiros: {
        title: 'Parceiros de Confiança',
        subtitle: 'Nossos Parceiros de Confiança'
      },
      comparacao: {
        title: 'Comparação de Sistemas',
        subtitle: 'Veja as vantagens'
      },
      fluxo: {
        title: 'Fluxo de Execução',
        subtitle: 'Como funciona nosso processo'
      },
      contato: {
        title: 'Entre em Contato',
        subtitle: 'Fale com nossos especialistas',
        email: 'contato@braspex.com.br',
        phone: '(11) 99999-9999',
        address: 'São Paulo, SP'
      },
      whatsapp: {
        phoneNumber: '5511999999999', // Número no formato internacional sem símbolos
        message: 'Olá! Gostaria de mais informações sobre os produtos BRASPEX.'
      }
    };
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const handleChange = (section, field, value) => {
    setTexts(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
    setSaved(false);
  };

  const handleVantagemChange = (index, field, value) => {
    setTexts(prev => ({
      ...prev,
      vantagens: {
        ...prev.vantagens,
        items: prev.vantagens.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
    setUnsavedChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem('braspex_site_texts', JSON.stringify(texts));
      setUnsavedChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'hero', name: 'Hero Principal' },
    { id: 'sobre', name: 'Sobre Nós' },
    { id: 'vantagens', name: 'Vantagens' },
    { id: 'parceiros', name: 'Parceiros' },
    { id: 'comparacao', name: 'Comparação' },
    { id: 'fluxo', name: 'Fluxo de Execução' },
    { id: 'contato', name: 'Contato' },
    { id: 'whatsapp', name: 'WhatsApp' }
  ];

  const renderSectionEditor = () => {
    switch (activeSection) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={texts.hero.title}
                onChange={(e) => handleChange('hero', 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={texts.hero.subtitle}
                onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Texto do Botão
              </label>
              <input
                type="text"
                value={texts.hero.buttonText}
                onChange={(e) => handleChange('hero', 'buttonText', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'sobre':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título da Seção
              </label>
              <input
                type="text"
                value={texts.sobre.title}
                onChange={(e) => handleChange('sobre', 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={texts.sobre.description}
                onChange={(e) => handleChange('sobre', 'description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'vantagens':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título da Seção
              </label>
              <input
                type="text"
                value={texts.vantagens.title}
                onChange={(e) => handleChange('vantagens', 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-800 mb-4">Itens de Vantagens</h4>
              {texts.vantagens.items.map((item, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-700 mb-3">Vantagem #{index + 1}</div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleVantagemChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Descrição
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleVantagemChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'parceiros':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={texts.parceiros.title}
                onChange={(e) => handleChange('parceiros', 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={texts.parceiros.subtitle}
                onChange={(e) => handleChange('parceiros', 'subtitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'comparacao':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={texts.comparacao.title}
                onChange={(e) => handleChange('comparacao', 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={texts.comparacao.subtitle}
                onChange={(e) => handleChange('comparacao', 'subtitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'fluxo':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={texts.fluxo.title}
                onChange={(e) => handleChange('fluxo', 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={texts.fluxo.subtitle}
                onChange={(e) => handleChange('fluxo', 'subtitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'contato':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={texts.contato.title}
                onChange={(e) => handleChange('contato', 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={texts.contato.subtitle}
                onChange={(e) => handleChange('contato', 'subtitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={texts.contato.email}
                onChange={(e) => handleChange('contato', 'email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={texts.contato.phone}
                onChange={(e) => handleChange('contato', 'phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                value={texts.contato.address}
                onChange={(e) => handleChange('contato', 'address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <MessageCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Configuração do WhatsApp</h4>
                  <p className="text-sm text-green-700">
                    Configure o número e a mensagem padrão que aparecerá quando os visitantes clicarem no botão flutuante do WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número do WhatsApp
                <span className="text-xs font-normal text-gray-500 ml-2">
                  (formato internacional sem símbolos, ex: 5511999999999)
                </span>
              </label>
              <input
                type="text"
                value={texts.whatsapp.phoneNumber}
                onChange={(e) => handleChange('whatsapp', 'phoneNumber', e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent font-mono"
                placeholder="5511999999999"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: Código do país (55) + DDD + Número (sem espaços ou símbolos)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensagem Padrão
              </label>
              <textarea
                value={texts.whatsapp.message}
                onChange={(e) => handleChange('whatsapp', 'message', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="Olá! Gostaria de mais informações..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Esta mensagem será pré-preenchida quando o visitante abrir o WhatsApp
              </p>
            </div>

            {/* Preview do Link */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Preview do Link</h4>
              <div className="bg-white p-3 rounded border border-gray-300 break-all text-sm font-mono text-gray-600">
                https://wa.me/{texts.whatsapp.phoneNumber}?text={encodeURIComponent(texts.whatsapp.message)}
              </div>
              <a
                href={`https://wa.me/${texts.whatsapp.phoneNumber}?text=${encodeURIComponent(texts.whatsapp.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <MessageCircle size={20} />
                Testar Link
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Editar Textos da Página Principal</h2>
          <p className="text-gray-600 mt-1">
            Personalize todos os textos que aparecem no site
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!unsavedChanges || saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : unsavedChanges
              ? 'bg-[#005563] text-white hover:bg-[#004450]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle size={20} />
              Salvo!
            </>
          ) : (
            <>
              <Save size={20} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </>
          )}
        </button>
      </div>

      {/* Tabs de Seções */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#005563] text-white border-b-2 border-[#005563]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo da Seção */}
        <div className="p-6">
          {renderSectionEditor()}
        </div>
      </div>

      {/* Aviso de Alterações */}
      {unsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Atenção:</strong> Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicar as mudanças.
          </p>
        </div>
      )}
    </div>
  );
};

export default TextsEditorSection;
