import { useState } from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Save, RefreshCw } from 'lucide-react';

/**
 * Componente para editar textos do site no painel admin
 * Integra com SiteContentContext que já sincroniza com Supabase
 */
export default function TextsManager() {
  const { content, updateContent, loading, refreshContent } = useSiteContent();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  // Hero Section
  const handleHeroChange = async (field, value) => {
    setSaving(true);
    setSaveMessage('');
    try {
      await updateContent('hero', field, value);
      setSaveMessage('✅ Salvo com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Erro ao salvar');
      console.error('Erro ao salvar hero:', error);
    }
    setSaving(false);
  };

  // Vantagens Section
  const handleVantagensChange = async (field, value) => {
    setSaving(true);
    setSaveMessage('');
    try {
      await updateContent('vantagens', field, value);
      setSaveMessage('✅ Salvo com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Erro ao salvar');
      console.error('Erro ao salvar vantagens:', error);
    }
    setSaving(false);
  };

  // Sobre Section
  const handleSobreChange = async (field, value) => {
    setSaving(true);
    setSaveMessage('');
    try {
      await updateContent('sobre', field, value);
      setSaveMessage('✅ Salvo com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Erro ao salvar');
      console.error('Erro ao salvar sobre:', error);
    }
    setSaving(false);
  };

  // Parceiros Section
  const handleParceirosChange = async (field, value) => {
    setSaving(true);
    setSaveMessage('');
    try {
      await updateContent('parceiros', field, value);
      setSaveMessage('✅ Salvo com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Erro ao salvar');
      console.error('Erro ao salvar parceiros:', error);
    }
    setSaving(false);
  };

  // Contato Section
  const handleContatoChange = async (field, value) => {
    setSaving(true);
    setSaveMessage('');
    try {
      await updateContent('contato', field, value);
      setSaveMessage('✅ Salvo com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Erro ao salvar');
      console.error('Erro ao salvar contato:', error);
    }
    setSaving(false);
  };

  // Footer Section
  const handleFooterChange = async (field, value) => {
    setSaving(true);
    setSaveMessage('');
    try {
      await updateContent('footer', field, value);
      setSaveMessage('✅ Salvo com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Erro ao salvar');
      console.error('Erro ao salvar footer:', error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        <p className="ml-3 text-gray-600">Carregando textos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Textos do Site</h2>
          <p className="text-gray-600 mt-1">
            Edite os textos que aparecem nas seções do site
          </p>
        </div>
        <Button
          onClick={refreshContent}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Recarregar
        </Button>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg ${saveMessage.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {saveMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          {['hero', 'vantagens', 'sobre', 'parceiros', 'contato', 'footer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#005563] text-[#005563]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {/* HERO */}
        {activeTab === 'hero' && (
          <Card>
            <CardHeader>
              <CardTitle>Seção Hero (Banner Principal)</CardTitle>
              <CardDescription>
                Textos da primeira seção que os visitantes veem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Título Principal</Label>
                <Input
                  id="hero-title"
                  value={content.hero?.title || ''}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hero-subtitle">Subtítulo</Label>
                <Input
                  id="hero-subtitle"
                  value={content.hero?.subtitle || ''}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hero-description">Descrição</Label>
                <Textarea
                  id="hero-description"
                  value={content.hero?.description || ''}
                  onChange={(e) => handleHeroChange('description', e.target.value)}
                  disabled={saving}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hero-buttonText">Texto do Botão</Label>
                <Input
                  id="hero-buttonText"
                  value={content.hero?.buttonText || ''}
                  onChange={(e) => handleHeroChange('buttonText', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hero-imageUrl">URL da Imagem</Label>
                <Input
                  id="hero-imageUrl"
                  value={content.hero?.imageUrl || ''}
                  onChange={(e) => handleHeroChange('imageUrl', e.target.value)}
                  disabled={saving}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* VANTAGENS */}
        {activeTab === 'vantagens' && (
          <Card>
            <CardHeader>
              <CardTitle>Seção Vantagens</CardTitle>
              <CardDescription>
                Títulos e subtítulos da seção de vantagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vantagens-title">Título</Label>
                <Input
                  id="vantagens-title"
                  value={content.vantagens?.title || ''}
                  onChange={(e) => handleVantagensChange('title', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="vantagens-subtitle">Subtítulo</Label>
                <Textarea
                  id="vantagens-subtitle"
                  value={content.vantagens?.subtitle || ''}
                  onChange={(e) => handleVantagensChange('subtitle', e.target.value)}
                  disabled={saving}
                  rows={2}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* SOBRE */}
        {activeTab === 'sobre' && (
          <Card>
            <CardHeader>
              <CardTitle>Seção Sobre Nós</CardTitle>
              <CardDescription>
                Informações sobre a empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sobre-title">Título</Label>
                <Input
                  id="sobre-title"
                  value={content.sobre?.title || ''}
                  onChange={(e) => handleSobreChange('title', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="sobre-description">Descrição</Label>
                <Textarea
                  id="sobre-description"
                  value={content.sobre?.description || ''}
                  onChange={(e) => handleSobreChange('description', e.target.value)}
                  disabled={saving}
                  rows={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="sobre-mission">Missão</Label>
                <Textarea
                  id="sobre-mission"
                  value={content.sobre?.mission || ''}
                  onChange={(e) => handleSobreChange('mission', e.target.value)}
                  disabled={saving}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="sobre-vision">Visão</Label>
                <Textarea
                  id="sobre-vision"
                  value={content.sobre?.vision || ''}
                  onChange={(e) => handleSobreChange('vision', e.target.value)}
                  disabled={saving}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="sobre-values">Valores</Label>
                <Textarea
                  id="sobre-values"
                  value={content.sobre?.values || ''}
                  onChange={(e) => handleSobreChange('values', e.target.value)}
                  disabled={saving}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* PARCEIROS */}
        {activeTab === 'parceiros' && (
          <Card>
            <CardHeader>
              <CardTitle>Seção Parceiros</CardTitle>
              <CardDescription>
                Títulos da seção de parceiros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="parceiros-title">Título</Label>
                <Input
                  id="parceiros-title"
                  value={content.parceiros?.title || ''}
                  onChange={(e) => handleParceirosChange('title', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="parceiros-subtitle">Subtítulo</Label>
                <Textarea
                  id="parceiros-subtitle"
                  value={content.parceiros?.subtitle || ''}
                  onChange={(e) => handleParceirosChange('subtitle', e.target.value)}
                  disabled={saving}
                  rows={2}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* CONTATO */}
        {activeTab === 'contato' && (
          <Card>
            <CardHeader>
              <CardTitle>Seção Contato</CardTitle>
              <CardDescription>
                Informações de contato e formulário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contato-title">Título</Label>
                <Input
                  id="contato-title"
                  value={content.contato?.title || ''}
                  onChange={(e) => handleContatoChange('title', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contato-subtitle">Subtítulo</Label>
                <Textarea
                  id="contato-subtitle"
                  value={content.contato?.subtitle || ''}
                  onChange={(e) => handleContatoChange('subtitle', e.target.value)}
                  disabled={saving}
                  rows={2}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contato-phone">Telefone</Label>
                <Input
                  id="contato-phone"
                  value={content.contato?.phone || ''}
                  onChange={(e) => handleContatoChange('phone', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contato-email">E-mail</Label>
                <Input
                  id="contato-email"
                  value={content.contato?.email || ''}
                  onChange={(e) => handleContatoChange('email', e.target.value)}
                  disabled={saving}
                  type="email"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contato-address">Endereço</Label>
                <Textarea
                  id="contato-address"
                  value={content.contato?.address || ''}
                  onChange={(e) => handleContatoChange('address', e.target.value)}
                  disabled={saving}
                  rows={2}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contato-whatsapp">WhatsApp</Label>
                <Input
                  id="contato-whatsapp"
                  value={content.contato?.whatsapp || ''}
                  onChange={(e) => handleContatoChange('whatsapp', e.target.value)}
                  disabled={saving}
                  placeholder="+55 11 99999-9999"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* FOOTER */}
        {activeTab === 'footer' && (
          <Card>
            <CardHeader>
              <CardTitle>Rodapé</CardTitle>
              <CardDescription>
                Informações que aparecem no rodapé do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="footer-companyName">Nome da Empresa</Label>
                <Input
                  id="footer-companyName"
                  value={content.footer?.companyName || ''}
                  onChange={(e) => handleFooterChange('companyName', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="footer-slogan">Slogan</Label>
                <Input
                  id="footer-slogan"
                  value={content.footer?.slogan || ''}
                  onChange={(e) => handleFooterChange('slogan', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="footer-description">Descrição</Label>
                <Textarea
                  id="footer-description"
                  value={content.footer?.description || ''}
                  onChange={(e) => handleFooterChange('description', e.target.value)}
                  disabled={saving}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="footer-copyright">Copyright</Label>
                <Input
                  id="footer-copyright"
                  value={content.footer?.copyright || ''}
                  onChange={(e) => handleFooterChange('copyright', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <Save className="w-4 h-4" />
        <p>
          As alterações são salvas automaticamente no Supabase quando você edita os campos.
        </p>
      </div>
    </div>
  );
}
