import { useEffect, useMemo, useState } from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { RefreshCw, Save, Search } from 'lucide-react';

const SECTION_ORDER = [
  'header',
  'hero',
  'productsShowcase',
  'kitsShowcase',
  'kitApplicationGuide',
  'sobre',
  'fluxo',
  'vantagens',
  'comparacao',
  'parceiros',
  'contato',
  'whatsapp',
  'cartDrawer',
  'footer',
  'productsPage',
  'productDetailPage',
  'quoteCheckout',
  'blogPage',
  'blogPostPage',
  'catalogsPage'
];

const SECTION_LABELS = {
  header: 'Cabecalho',
  hero: 'Home',
  productsShowcase: 'Produtos em Destaque',
  kitsShowcase: 'Nossos Kits',
  kitApplicationGuide: 'Aplicacao dos Kits',
  sobre: 'Sobre',
  fluxo: 'Como Trabalhamos',
  vantagens: 'Vantagens dos Kits',
  comparacao: 'Comparacao de Prazo',
  parceiros: 'Parceiros',
  contato: 'Contato',
  whatsapp: 'WhatsApp',
  cartDrawer: 'Carrinho',
  footer: 'Rodape',
  productsPage: 'Pagina de Produtos',
  productDetailPage: 'Detalhe do Produto',
  quoteCheckout: 'Checkout de Orcamento',
  blogPage: 'Blog',
  blogPostPage: 'Post do Blog',
  catalogsPage: 'Catalogo Virtual'
};

const stringifyValue = (value) => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
};

const formatFieldLabel = (field) =>
  field
    .replace(/Json$/, ' JSON')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (char) => char.toUpperCase());

const isLongField = (field, value) => {
  const text = stringifyValue(value);
  return field.toLowerCase().includes('json') || text.length > 90 || text.includes('\n');
};

export default function TextsManager() {
  const { content, updateContent, loading, refreshContent } = useSiteContent();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeSection, setActiveSection] = useState('hero');
  const [localContent, setLocalContent] = useState(content || {});
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLocalContent(content || {});
  }, [content]);

  useEffect(() => {
    if (!content?.[activeSection]) {
      setActiveSection('hero');
    }
  }, [content, activeSection]);

  const sections = useMemo(() => {
    const keys = Object.keys(localContent || {}).filter(
      (section) => localContent?.[section] && typeof localContent[section] === 'object'
    );

    return keys.sort((a, b) => {
      const orderA = SECTION_ORDER.indexOf(a);
      const orderB = SECTION_ORDER.indexOf(b);

      if (orderA === -1 && orderB === -1) return a.localeCompare(b);
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;
      return orderA - orderB;
    });
  }, [localContent]);

  const activeData = localContent?.[activeSection] || {};

  const visibleFields = useMemo(() => {
    const query = search.trim().toLowerCase();
    return Object.entries(activeData).filter(([field, value]) => {
      if (!query) return true;

      return (
        field.toLowerCase().includes(query) ||
        stringifyValue(value).toLowerCase().includes(query)
      );
    });
  }, [activeData, search]);

  const handleChange = (section, field, value) => {
    setLocalContent((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value
      }
    }));
  };

  const setTimedMessage = (message) => {
    setSaveMessage(message);
    window.setTimeout(() => setSaveMessage(''), 3200);
  };

  const saveField = async (section, field) => {
    setSaving(true);
    try {
      await updateContent(section, field, stringifyValue(localContent?.[section]?.[field]));
      setTimedMessage('Salvo com sucesso.');
    } catch (error) {
      console.error(`Erro ao salvar ${section}.${field}:`, error);
      setTimedMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async () => {
    setSaving(true);
    try {
      const entries = Object.entries(localContent?.[activeSection] || {});
      for (const [field, value] of entries) {
        await updateContent(activeSection, field, stringifyValue(value));
      }
      setTimedMessage('Secao salva com sucesso.');
    } catch (error) {
      console.error(`Erro ao salvar ${activeSection}:`, error);
      setTimedMessage('Erro ao salvar a secao.');
    } finally {
      setSaving(false);
    }
  };

  const reloadContent = async () => {
    if (!refreshContent) return;

    setSaving(true);
    try {
      const ok = await refreshContent();
      setTimedMessage(ok ? 'Conteudo recarregado.' : 'Nao foi possivel recarregar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        <p className="ml-3 text-gray-600">Carregando textos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Textos do Site</h2>
          <p className="mt-1 text-gray-600">
            Edite qualquer texto ou campo JSON usado no site, incluindo as novas secoes.
          </p>
        </div>
        <Button onClick={reloadContent} variant="outline" className="gap-2 self-start lg:self-auto" disabled={saving}>
          <RefreshCw className="h-4 w-4" />
          Recarregar
        </Button>
      </div>

      {saveMessage && (
        <div
          className={`rounded-lg p-4 text-sm font-medium ${
            saveMessage.toLowerCase().includes('erro') || saveMessage.toLowerCase().includes('nao')
              ? 'bg-red-50 text-red-800'
              : 'bg-green-50 text-green-800'
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Secoes</CardTitle>
            <CardDescription>{sections.length} areas editaveis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map((section) => {
              const isActive = section === activeSection;
              const fieldCount = Object.keys(localContent?.[section] || {}).length;

              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => {
                    setActiveSection(section);
                    setSearch('');
                  }}
                  className={`w-full rounded-lg px-3 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-[#005563] text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="block text-sm font-bold">
                    {SECTION_LABELS[section] || section}
                  </span>
                  <span className={`mt-1 block text-xs ${isActive ? 'text-white/72' : 'text-gray-500'}`}>
                    {fieldCount} campos
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>{SECTION_LABELS[activeSection] || activeSection}</CardTitle>
              <CardDescription>
                Campos da secao <span className="font-mono">{activeSection}</span>
              </CardDescription>
            </div>
            <Button onClick={saveSection} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Salvando...' : 'Salvar Secao'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar campo ou texto nesta secao..."
                className="pl-9"
                disabled={saving}
              />
            </div>

            <div className="grid gap-5">
              {visibleFields.map(([field, value]) => {
                const textValue = stringifyValue(value);
                const useTextarea = isLongField(field, value);

                return (
                  <div key={field} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Label htmlFor={`${activeSection}-${field}`}>
                          {formatFieldLabel(field)}
                        </Label>
                        <p className="mt-1 font-mono text-xs text-gray-400">{field}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {field.toLowerCase().includes('json') && (
                          <span className="rounded-full bg-[#005563]/10 px-2 py-1 text-xs font-bold text-[#005563]">
                            JSON
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => saveField(activeSection, field)}
                          disabled={saving}
                        >
                          Salvar campo
                        </Button>
                      </div>
                    </div>

                    {useTextarea ? (
                      <Textarea
                        id={`${activeSection}-${field}`}
                        value={textValue}
                        onChange={(event) => handleChange(activeSection, field, event.target.value)}
                        disabled={saving}
                        rows={field.toLowerCase().includes('json') ? 10 : 4}
                        className={`mt-2 ${field.toLowerCase().includes('json') ? 'font-mono text-sm' : ''}`}
                      />
                    ) : (
                      <Input
                        id={`${activeSection}-${field}`}
                        value={textValue}
                        onChange={(event) => handleChange(activeSection, field, event.target.value)}
                        disabled={saving}
                        className="mt-2"
                      />
                    )}
                  </div>
                );
              })}

              {visibleFields.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
                  Nenhum campo encontrado nesta secao.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
