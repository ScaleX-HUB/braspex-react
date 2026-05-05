import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Save } from 'lucide-react';
import { useSectionOrder } from '../../contexts/SectionOrderContext';

const SectionOrderManager = () => {
  const { 
    sectionOrder, 
    moveSectionUp, 
    moveSectionDown, 
    toggleSectionEnabled,
    saveSectionOrder 
  } = useSectionOrder();
  
  const [saveMessage, setSaveMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      await saveSectionOrder();
      setSaveMessage('✅ Ordem salva com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Erro ao salvar');
      console.error('Erro ao salvar ordem:', error);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ordem das Seções da Página Principal
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Use as setas para reordenar as seções. Clique no olho para ativar/desativar.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-sm font-medium ${saveMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? 'Salvando...' : 'Salvar Ordem'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Nome da Seção</div>
          <div className="col-span-3 text-center">Componente</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-center">Ações</div>
        </div>

        <div className="divide-y divide-gray-200">
          {sectionOrder.map((section, index) => (
            <div
              key={section.id}
              className={`grid grid-cols-12 gap-4 px-4 py-4 items-center transition-colors ${
                !section.enabled ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
              }`}
            >
              {/* Número da ordem */}
              <div className="col-span-1 text-center font-semibold text-gray-700">
                {index + 1}
              </div>

              {/* Nome da seção */}
              <div className="col-span-5">
                <div className="font-medium text-gray-900">{section.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">ID: {section.id}</div>
              </div>

              {/* Componente */}
              <div className="col-span-3 text-center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {section.component}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2 text-center">
                <button
                  onClick={() => toggleSectionEnabled(section.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    section.enabled
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {section.enabled ? (
                    <>
                      <Eye size={14} />
                      Ativa
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} />
                      Inativa
                    </>
                  )}
                </button>
              </div>

              {/* Ações */}
              <div className="col-span-1 flex items-center justify-center gap-1">
                <button
                  onClick={() => moveSectionUp(index)}
                  disabled={index === 0}
                  className={`p-1.5 rounded transition-colors ${
                    index === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                  title="Mover para cima"
                >
                  <ArrowUp size={20} />
                </button>
                <button
                  onClick={() => moveSectionDown(index)}
                  disabled={index === sectionOrder.length - 1}
                  className={`p-1.5 rounded transition-colors ${
                    index === sectionOrder.length - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                  title="Mover para baixo"
                >
                  <ArrowDown size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview da ordem */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Eye size={20} />
          Preview da Ordem Atual
        </h4>
        <div className="space-y-1">
          {sectionOrder
            .filter(s => s.enabled)
            .map((section, index) => (
              <div key={section.id} className="text-sm text-blue-800">
                {index + 1}. {section.name}
              </div>
            ))}
        </div>
        {sectionOrder.filter(s => s.enabled).length === 0 && (
          <p className="text-sm text-blue-600 italic">
            Nenhuma seção ativa. Ative pelo menos uma seção para exibir na página.
          </p>
        )}
      </div>

      {/* Aviso */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Atenção:</strong> Clique em "Salvar Ordem" para aplicar as alterações na página principal. 
          Seções desativadas não serão exibidas para os visitantes.
        </p>
      </div>
    </div>
  );
};

export default SectionOrderManager;
