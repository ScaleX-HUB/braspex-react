import { useState, useEffect } from 'react';
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
  
  // Estados locais para cada seção (não salva automaticamente)
  const [localHero, setLocalHero] = useState(content.hero || {});
  const [localVantagens, setLocalVantagens] = useState(content.vantagens || {});
  const [localSobre, setLocalSobre] = useState(content.sobre || {});
  const [localParceiros, setLocalParceiros] = useState(content.parceiros || {});
  const [localContato, setLocalContato] = useState(content.contato || {});
  const [localFooter, setLocalFooter] = useState(content.footer || {});
  const [localWhatsapp, setLocalWhatsapp] = useState(content.whatsapp || {});

  // Atualiza estado local quando content muda
  useEffect(() => {
    setLocalHero(content.hero || {});
    setLocalVantagens(content.vantagens || {});
    setLocalSobre(content.sobre || {});
    setLocalParceiros(content.parceiros || {});
    setLocalContato(content.contato || {});
    setLocalFooter(content.footer || {});
    setLocalWhatsapp(content.whatsapp || {});
  }, [content]);

  // Funções para atualizar estado local (não salva automaticamente)
  const handleHeroChange = (field, value) => {
    setLocalHero(prev => ({ ...prev, [field]: value }));
  };

  const handleVantagensChange = (field, value) => {
    setLocalVantagens(prev => ({ ...prev, [field]: value }));
  };

  const handleSobreChange = (field, value) => {
    setLocalSobre(prev => ({ ...prev, [field]: value }));
  };

  const handleParceirosChange = (field, value) => {
    setLocalParceiros(prev => ({ ...prev, [field]: value }));
  };

  const handleContatoChange = (field, value) => {
    setLocalContato(prev => ({ ...prev, [field]: value }));
  };
  const handleFooterChange = (field, value) => {
    setLocalFooter(prev => ({ ...prev, [field]: value }));
  };

  const handleWhatsappChange = (field, value) => {
    setLocalWhatsapp(prev => ({ ...prev, [field]: value }));
  };

  // Função para salvar todas as alterações de uma seção
  const saveSection = async (sectionName, sectionData) => {
    setSaving(true);
    setSaveMessage('');
    try {
      // Salva todos os campos da seção
      for (const [field, value] of Object.entries(sectionData)) {
        await updateContent(sectionName, field, value);
      }
      setSaveMessage('✅ Salvo com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('❌ Erro ao salvar');
      console.error(`Erro ao salvar ${sectionName}:`, error);
    }
    setSaving(false);
  };

  // Funções específicas de save por seção
  const saveHero = () => saveSection('hero', localHero);
  const saveVantagens = () => saveSection('vantagens', localVantagens);
  const saveSobre = () => saveSection('sobre', localSobre);
  const saveParceiros = () => saveSection('parceiros', localParceiros);
  const saveContato = () => saveSection('contato', localContato);
  const saveFooter = () => saveSection('footer', localFooter);
  const saveWhatsapp = () => saveSection('whatsapp', localWhatsapp);

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
          {[
            { id: 'hero', label: 'Home' },
            { id: 'vantagens', label: 'Vantagens' },
            { id: 'sobre', label: 'Sobre' },
            { id: 'parceiros', label: 'Parceiros' },
            { id: 'contato', label: 'Contato' },
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'footer', label: 'Rodapé' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#005563] text-[#005563]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {/* HOME (HERO) */}
        {activeTab === 'hero' && (
          <Card>
            <CardHeader>
              <CardTitle>Seção Home (Banner Principal)</CardTitle>
              <CardDescription>
                Textos da primeira seção que os visitantes veem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Título Principal</Label>
                <Input
                  id="hero-title"
                  value={localHero.title || ''}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hero-subtitle">Subtítulo</Label>
                <Input
                  id="hero-subtitle"
                  value={localHero.subtitle || ''}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hero-description">Descrição</Label>
                <Textarea
                  id="hero-description"
                  value={localHero.description || ''}
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
                  value={localHero.buttonText || ''}
                  onChange={(e) => handleHeroChange('buttonText', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hero-videoUrl">Link do Vídeo (YouTube, Vimeo, etc.)</Label>
                <Input
                  id="hero-videoUrl"
                  value={localHero.videoUrl || ''}
                  onChange={(e) => handleHeroChange('videoUrl', e.target.value)}
                  disabled={saving}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Cole o link do vídeo para o botão "Ver Vídeo"
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={saveHero}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
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
                  value={localVantagens.title || ''}
                  onChange={(e) => handleVantagensChange('title', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="vantagens-subtitle">Subtítulo</Label>
                <Textarea
                  id="vantagens-subtitle"
                  value={localVantagens.subtitle || ''}
                  onChange={(e) => handleVantagensChange('subtitle', e.target.value)}
                  disabled={saving}
                  rows={2}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={saveVantagens}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SOBRE (QUEM SOMOS) */}
        {activeTab === 'sobre' && (
          <Card>
            <CardHeader>
              <CardTitle>Seção Sobre (Quem Somos)</CardTitle>
              <CardDescription>
                Informações sobre a Braspex - História e propósito da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sobre-title">Título</Label>
                <Input
                  id="sobre-title"
                  value={localSobre.title || ''}
                  onChange={(e) => handleSobreChange('title', e.target.value)}
                  disabled={saving}
                  placeholder="Sobre a Braspex"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="sobre-content">Texto Completo "Quem Somos"</Label>
                <Textarea
                  id="sobre-content"
                  value={localSobre.content || ''}
                  onChange={(e) => handleSobreChange('content', e.target.value)}
                  disabled={saving}
                  rows={12}
                  placeholder="A Braspex é uma empresa inovadora no setor de soluções industrializadas para instalações prediais. Nascida da sólida experiência do Grupo Protogás, atua com excelência na fabricação de kits hidráulicos, de gás e frigorígenos, oferecendo produtos que unem qualidade, padronização e eficiência.

Com um modelo produtivo moderno e altamente controlado, a Braspex garante que suas soluções cheguem prontas para a obra, simplificando as etapas de instalação e reduzindo significativamente prazos, custos e retrabalhos. Cada kit é desenvolvido com tecnologia de ponta e rigor técnico, assegurando desempenho superior e confiabilidade em todas as aplicações.

Mais do que fornecer produtos, a Braspex entrega praticidade, segurança e inovação, contribuindo para a evolução do setor e para o sucesso de cada projeto executado."
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Cole ou edite o texto completo sobre a empresa
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={saveSobre}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
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
                  value={localParceiros.title || ''}
                  onChange={(e) => handleParceirosChange('title', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="parceiros-subtitle">Subtítulo</Label>
                <Textarea
                  id="parceiros-subtitle"
                  value={localParceiros.subtitle || ''}
                  onChange={(e) => handleParceirosChange('subtitle', e.target.value)}
                  disabled={saving}
                  rows={2}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={saveParceiros}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
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
                  value={localContato.title || ''}
                  onChange={(e) => handleContatoChange('title', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contato-subtitle">Subtítulo</Label>
                <Textarea
                  id="contato-subtitle"
                  value={localContato.subtitle || ''}
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
                  value={localContato.phone || ''}
                  onChange={(e) => handleContatoChange('phone', e.target.value)}
                  disabled={saving}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contato-email">E-mail</Label>
                <Input
                  id="contato-email"
                  value={localContato.email || ''}
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
                  value={localContato.address || ''}
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
                  value={localContato.whatsapp || ''}
                  onChange={(e) => handleContatoChange('whatsapp', e.target.value)}
                  disabled={saving}
                  placeholder="+55 11 99999-9999"
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={saveContato}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* WHATSAPP */}
        {activeTab === 'whatsapp' && (
          <Card>
            <CardHeader>
              <CardTitle>Botão Flutuante do WhatsApp</CardTitle>
              <CardDescription>
                Configure o número e a mensagem padrão do botão flutuante de WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whatsapp-phone">Número do WhatsApp</Label>
                <Input
                  id="whatsapp-phone"
                  value={localWhatsapp.phone || ''}
                  onChange={(e) => handleWhatsappChange('phone', e.target.value)}
                  disabled={saving}
                  placeholder="5581989635638"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formato: código do país + DDD + número (sem espaços, parênteses ou traços)
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Exemplo: 5581989635638 = +55 (81) 98963-5638
                </p>
              </div>

              <div>
                <Label htmlFor="whatsapp-message">Mensagem Padrão</Label>
                <Textarea
                  id="whatsapp-message"
                  value={localWhatsapp.message || ''}
                  onChange={(e) => handleWhatsappChange('message', e.target.value)}
                  disabled={saving}
                  rows={3}
                  placeholder="Olá! Gostaria de solicitar uma cotação."
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Mensagem que aparecerá automaticamente quando o visitante clicar no botão
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={saveWhatsapp}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* RODAPÉ */}
        {activeTab === 'footer' && (
          <Card>
            <CardHeader>
              <CardTitle>Rodapé</CardTitle>
              <CardDescription>
                Informações de contato, textos e redes sociais do rodapé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações da Empresa */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Informações da Empresa</h3>
                
                <div>
                  <Label htmlFor="footer-companyName">Nome da Empresa</Label>
                  <Input
                    id="footer-companyName"
                    value={localFooter.companyName || ''}
                    onChange={(e) => handleFooterChange('companyName', e.target.value)}
                    disabled={saving}
                    placeholder="Braspex"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="footer-slogan">Slogan</Label>
                  <Input
                    id="footer-slogan"
                    value={localFooter.slogan || ''}
                    onChange={(e) => handleFooterChange('slogan', e.target.value)}
                    disabled={saving}
                    placeholder="Soluções Industrializadas em Instalações Prediais"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="footer-description">Descrição</Label>
                  <Textarea
                    id="footer-description"
                    value={localFooter.description || ''}
                    onChange={(e) => handleFooterChange('description', e.target.value)}
                    disabled={saving}
                    rows={3}
                    placeholder="Fornecemos soluções completas..."
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Informações de Contato</h3>
                
                <div>
                  <Label htmlFor="footer-phone">Telefone</Label>
                  <Input
                    id="footer-phone"
                    value={localFooter.phone || ''}
                    onChange={(e) => handleFooterChange('phone', e.target.value)}
                    disabled={saving}
                    placeholder="(11) 1234-5678"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="footer-email">E-mail</Label>
                  <Input
                    id="footer-email"
                    value={localFooter.email || ''}
                    onChange={(e) => handleFooterChange('email', e.target.value)}
                    disabled={saving}
                    placeholder="contato@braspex.com.br"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="footer-address">Endereço</Label>
                  <Textarea
                    id="footer-address"
                    value={localFooter.address || ''}
                    onChange={(e) => handleFooterChange('address', e.target.value)}
                    disabled={saving}
                    rows={2}
                    placeholder="Rua Exemplo, 123 - Bairro - Cidade/UF"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Redes Sociais</h3>
                <p className="text-sm text-gray-600">Cole os links completos das redes sociais</p>
                
                <div>
                  <Label htmlFor="footer-facebook">Facebook</Label>
                  <Input
                    id="footer-facebook"
                    value={localFooter.facebook || ''}
                    onChange={(e) => handleFooterChange('facebook', e.target.value)}
                    disabled={saving}
                    placeholder="https://facebook.com/braspex"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="footer-instagram">Instagram</Label>
                  <Input
                    id="footer-instagram"
                    value={localFooter.instagram || ''}
                    onChange={(e) => handleFooterChange('instagram', e.target.value)}
                    disabled={saving}
                    placeholder="https://instagram.com/braspex"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="footer-linkedin">LinkedIn</Label>
                  <Input
                    id="footer-linkedin"
                    value={localFooter.linkedin || ''}
                    onChange={(e) => handleFooterChange('linkedin', e.target.value)}
                    disabled={saving}
                    placeholder="https://linkedin.com/company/braspex"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="footer-youtube">YouTube</Label>
                  <Input
                    id="footer-youtube"
                    value={localFooter.youtube || ''}
                    onChange={(e) => handleFooterChange('youtube', e.target.value)}
                    disabled={saving}
                    placeholder="https://youtube.com/@braspex"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Copyright */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Copyright</h3>
                
                <div>
                  <Label htmlFor="footer-copyright">Texto de Copyright</Label>
                  <Input
                    id="footer-copyright"
                    value={localFooter.copyright || ''}
                    onChange={(e) => handleFooterChange('copyright', e.target.value)}
                    disabled={saving}
                    placeholder="© 2025 Braspex. Todos os direitos reservados."
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={saveFooter}
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aviso Importante */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg mt-6">
          <Save className="w-4 h-4" />
          <p>
            <strong>Importante:</strong> Clique no botão "Salvar Alterações" em cada seção para aplicar as mudanças no site.
          </p>
        </div>
      </div>
    </div>
  );
}
