import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Eye, Upload, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { catalogsAPI } from '../../services/catalogsAPI';
import { generateUUID } from '../../lib/uuid';

const DEFAULT_PDF_MAX_SIZE_MB = 45;
const DEFAULT_COVER_MAX_SIZE_MB = 10;
const PDF_MAX_SIZE_MB = Number(import.meta.env.VITE_CATALOGS_MAX_PDF_MB || DEFAULT_PDF_MAX_SIZE_MB);
const COVER_MAX_SIZE_MB = Number(import.meta.env.VITE_CATALOGS_MAX_COVER_MB || DEFAULT_COVER_MAX_SIZE_MB);
const PDF_MAX_SIZE_BYTES = (Number.isFinite(PDF_MAX_SIZE_MB) ? PDF_MAX_SIZE_MB : DEFAULT_PDF_MAX_SIZE_MB) * 1024 * 1024;
const COVER_MAX_SIZE_BYTES = (Number.isFinite(COVER_MAX_SIZE_MB) ? COVER_MAX_SIZE_MB : DEFAULT_COVER_MAX_SIZE_MB) * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';

  const units = ['bytes', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const precision = value >= 10 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
};

const CatalogsManager = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [currentCatalog, setCurrentCatalog] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    active: true,
    order_index: 0,
    pdf_url: '',
    pdf_path: '',
    cover_url: '',
    cover_path: ''
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const coverPreview = useMemo(() => {
    if (coverFile) return URL.createObjectURL(coverFile);
    return formData.cover_url || '';
  }, [coverFile, formData.cover_url]);

  useEffect(() => {
    return () => {
      if (coverFile) {
        try {
          URL.revokeObjectURL(coverPreview);
        } catch {
          // noop
        }
      }
    };
  }, [coverFile, coverPreview]);

  const loadCatalogs = async () => {
    setLoading(true);
    try {
      const items = await catalogsAPI.getAll(true);
      setCatalogs(items || []);
    } catch (e) {
      console.error('❌ Erro ao carregar catálogos:', e);
      alert('Erro ao carregar catálogos: ' + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const handleNew = () => {
    setCurrentCatalog(null);
    setPdfFile(null);
    setCoverFile(null);
    setFormData({
      title: '',
      active: true,
      order_index: catalogs.length,
      pdf_url: '',
      pdf_path: '',
      cover_url: '',
      cover_path: ''
    });
    setIsEditing(true);
  };

  const handleEdit = (catalog) => {
    setCurrentCatalog(catalog);
    setPdfFile(null);
    setCoverFile(null);
    setFormData({
      title: catalog.title || '',
      active: catalog.active !== false,
      order_index: catalog.order_index ?? 0,
      pdf_url: catalog.pdf_url || '',
      pdf_path: catalog.pdf_path || '',
      cover_url: catalog.cover_url || '',
      cover_path: catalog.cover_path || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este catálogo?')) return;
    try {
      await catalogsAPI.delete(id);
      await loadCatalogs();
      alert('Catálogo excluído com sucesso!');
    } catch (e) {
      console.error('❌ Erro ao excluir catálogo:', e);
      alert('Erro ao excluir catálogo: ' + (e.message || e));
    }
  };

  const validateFileSize = (file, label, maxBytes) => {
    if (file.size <= maxBytes) return true;

    alert(
      `${label} muito grande para upload.\n\n` +
        `Limite: ${formatFileSize(maxBytes)}\n` +
        `Arquivo: ${formatFileSize(file.size)}`
    );
    return false;
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setCoverFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Selecione uma imagem válida para a capa.');
      e.target.value = '';
      return;
    }

    if (!validateFileSize(file, 'Imagem de capa', COVER_MAX_SIZE_BYTES)) {
      e.target.value = '';
      return;
    }

    setCoverFile(file);
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setPdfFile(null);
      return;
    }

    const looksLikePdf = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');
    if (!looksLikePdf) {
      alert('Selecione um arquivo PDF válido.');
      e.target.value = '';
      return;
    }

    if (!validateFileSize(file, 'PDF do catálogo', PDF_MAX_SIZE_BYTES)) {
      e.target.value = '';
      return;
    }

    setPdfFile(file);
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert('Informe o título do catálogo');
      return;
    }

    // Para catálogo novo, exigir PDF
    if (!currentCatalog && !pdfFile) {
      alert('Selecione o PDF do catálogo');
      return;
    }

    let createdCatalogId = null;

    try {
      const isNew = !currentCatalog;
      const id = currentCatalog?.id || generateUUID();

      let nextData = {
        id,
        title: formData.title,
        active: formData.active !== false,
        order_index: Number.isFinite(Number(formData.order_index)) ? Number(formData.order_index) : 0,
        pdf_url: formData.pdf_url || null,
        pdf_path: formData.pdf_path || null,
        cover_url: formData.cover_url || null,
        cover_path: formData.cover_path || null
      };

      // Para evitar arquivo órfão no Storage: cria o registro primeiro.
      // Depois faz upload e atualiza com pdf_url/cover_url.
      if (isNew) {
        await catalogsAPI.create(nextData);
        createdCatalogId = id;
      }

      // Upload de arquivos (opcional em edição)
      if (coverFile) {
        const uploaded = await catalogsAPI.uploadCoverImage(coverFile, id);
        nextData.cover_url = uploaded.url;
        nextData.cover_path = uploaded.path;
      }

      if (pdfFile) {
        const uploaded = await catalogsAPI.uploadPdf(pdfFile, id);
        nextData.pdf_url = uploaded.url;
        nextData.pdf_path = uploaded.path;
      }

      if (!isNew) {
        await catalogsAPI.update(id, nextData);
        alert('Catálogo atualizado com sucesso!');
      } else {
        await catalogsAPI.update(id, nextData);
        alert('Catálogo criado com sucesso!');
      }

      setIsEditing(false);
      setCurrentCatalog(null);
      setPdfFile(null);
      setCoverFile(null);
      await loadCatalogs();
    } catch (e) {
      console.error('❌ Erro ao salvar catálogo:', e);

      if (createdCatalogId) {
        try {
          await catalogsAPI.delete(createdCatalogId);
        } catch (cleanupError) {
          console.warn('Erro ao remover catálogo incompleto após falha no upload:', cleanupError);
        }
      }

      const msg = String(e?.message || e || 'Erro desconhecido');
      const normalizedMsg = msg.toLowerCase();
      const looksLikePayloadTooLarge =
        msg.includes('413') ||
        normalizedMsg.includes('request entity too large') ||
        normalizedMsg.includes('payload too large') ||
        normalizedMsg.includes('limite de upload');
      const looksLikePermission =
        msg.includes('permission denied') ||
        msg.includes('42501') ||
        msg.includes('401 Unauthorized') ||
        msg.includes('403 Forbidden');

      if (looksLikePayloadTooLarge) {
        alert(
          'Erro ao salvar catálogo: arquivo recusado pelo servidor por limite de upload.\n\n' +
            'O deploy agora configura o nginx/Dokku para aceitar uploads de até 50 MB. Depois de publicar esta alteração, tente novamente.\n\n' +
            'Detalhes técnicos:\n' +
            msg
        );
      } else if (looksLikePermission) {
        alert(
          'Erro ao salvar catálogo: permissão negada no Supabase.\n\n' +
            'Isso acontece quando a role anon/authenticated não tem GRANT e/ou a tabela está com RLS sem policy para INSERT/UPDATE.\n\n' +
            'Veja o passo a passo em docs/catalogs-setup.md (seção de GRANT/RLS) ou use o proxy com SERVICE_ROLE no servidor.\n\n' +
            'Detalhes técnicos:\n' +
            msg
        );
      } else {
        alert('Erro ao salvar catálogo: ' + msg);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentCatalog(null);
    setPdfFile(null);
    setCoverFile(null);
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentCatalog ? 'Editar Catálogo' : 'Novo Catálogo'}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              {currentCatalog ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Catálogo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              placeholder="Ex.: Linha Pex Braspex"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capa (imagem)
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                  <Upload size={18} />
                  Selecionar imagem
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverFileChange}
                  />
                </label>
                {formData.cover_url && !coverFile && (
                  <a
                    href={formData.cover_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#005563] hover:underline"
                  >
                    Ver capa atual
                  </a>
                )}
              </div>

              <div className="mt-4 aspect-[3/4] border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                {coverPreview ? (
                  <img src={coverPreview} alt="Prévia da capa" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-500 p-6">
                    <ImageIcon size={40} className="mx-auto mb-2" />
                    <div className="font-semibold">Sem capa</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF do Catálogo {currentCatalog ? '' : '*'}
              </label>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                  <Upload size={18} />
                  Selecionar PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handlePdfFileChange}
                  />
                </label>

                {(pdfFile || formData.pdf_url) && (
                  <a
                    href={pdfFile ? '#' : formData.pdf_url}
                    onClick={(e) => {
                      if (pdfFile) {
                        e.preventDefault();
                        const url = URL.createObjectURL(pdfFile);
                        window.open(url, '_blank', 'noreferrer');
                        setTimeout(() => URL.revokeObjectURL(url), 10000);
                      }
                    }}
                    target={pdfFile ? undefined : '_blank'}
                    rel={pdfFile ? undefined : 'noreferrer'}
                    className="text-sm text-[#005563] hover:underline"
                  >
                    {pdfFile ? 'Pré-visualizar PDF' : 'Ver PDF atual'}
                  </a>
                )}
              </div>

              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FileText size={28} className="text-[#005563]" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {pdfFile ? pdfFile.name : (formData.pdf_url ? 'PDF atual configurado' : 'Nenhum PDF selecionado')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {pdfFile ? formatFileSize(pdfFile.size) : (formData.pdf_url ? 'Clique em ver PDF atual' : 'Selecione um arquivo .pdf')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordem</label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData((p) => ({ ...p, order_index: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Menor aparece primeiro</p>
            </div>

            <div className="flex items-center gap-3 mt-7">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, active: !p.active }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors border ${
                  formData.active
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                }`}
              >
                {formData.active ? (
                  <>
                    <CheckCircle size={20} />
                    Ativo
                  </>
                ) : (
                  <>
                    <XCircle size={20} />
                    Inativo
                  </>
                )}
              </button>
              <div className="text-sm text-gray-600">Catálogos inativos não aparecem no site.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Catálogos</h2>
          <p className="text-gray-600 mt-1">
            {loading ? 'Carregando...' : `${catalogs.length} catálogos cadastrados`}
          </p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Catálogo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {catalogs.map((cat) => (
            <div key={cat.id} className="p-4 flex items-center gap-4">
              <div className="w-16 h-20 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {cat.cover_url ? (
                  <img src={cat.cover_url} alt={cat.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={28} className="text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 truncate">{cat.title}</h3>
                  {cat.active !== false ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Ativo</span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Inativo</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">Ordem: {cat.order_index ?? 0}</div>
              </div>

              <div className="flex items-center gap-2">
                {cat.pdf_url && (
                  <a
                    href={cat.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Abrir PDF"
                  >
                    <Eye size={20} />
                  </a>
                )}
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {!loading && catalogs.length === 0 && (
            <div className="p-10 text-center text-gray-600">
              Nenhum catálogo cadastrado.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={loadCatalogs}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Upload size={18} />
        Recarregar
      </button>
    </div>
  );
};

export default CatalogsManager;
