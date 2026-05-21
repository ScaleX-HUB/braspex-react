import React, { createContext, useContext, useState, useEffect } from 'react';
import { textsAPI } from '../services/textsAPI';
import { analyticsAPI } from '../services/analyticsAPI';

const SiteContentContext = createContext();

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};

const DEFAULT_CONTENT = {
  header: {
    logoAlt: "BRASPEX",
    navHome: "Home",
    navAbout: "Sobre",
    navProducts: "Nossos Kits",
    navKits: "Nossos Kits",
    navHowItWorks: "Como Trabalhamos",
    navContact: "Fale Conosco",
    navBlog: "Blog",
    navCatalogs: "Catálogos",
    navRequestQuote: "Orçamento",
    megaMenuViewAllTitle: "Ver Todos",
    megaMenuViewAllSubtitle: "os Kits",
    megaMenuMoreLabelTemplate: "+{count} mais",
    mobileViewAllProducts: "Ver Todos os Kits"
  },
  hero: {
    title: "Os melhores sistemas industrializados para obras de construção civil do Nordeste",
    subtitle: "Especialistas em sistemas de tubulação PPR, multicamada e chassis metálicos",
    description: "Especialistas em sistemas de tubulação PPR, multicamada e chassis metálicos.",
    buttonText: "Solicitar Cotação",
    videoButtonText: "Ver Vídeo",
    videoUrl: "https://www.youtube.com/watch?v=SEU_VIDEO_ID",
    featureCardTitle: "Qualidade Certificada",
    featureCardSubtitle: "Produtos homologados",
    featureCardItem1: "Sistema PPR Alemão",
    featureCardItem2: "Kits Ar-Condicionado",
    featureCardItem3: "Chassis Metálicos",
    featureCardButtonText: "Ver Produtos",
    scrollIndicatorText: "Role para explorar"
  },
  vantagens: {
    title: "Por que escolher os Kits BRASPEX?",
    subtitle: "Nosso diferencial está na combinação entre inovação, qualidade e eficiência",
    stepsJson: JSON.stringify([
      {
        title: "Qualidade em Fábrica",
        description: "Montagem controlada e testada antes da entrega"
      },
      {
        title: "Segurança e Rastreabilidade",
        description: "Todos os componentes são rastreáveis e seguros"
      },
      {
        title: "Agilidade",
        description: "Instalação até 3x mais rápida que sistemas convencionais"
      },
      {
        title: "Suporte Técnico",
        description: "Do projeto à entrega, com suporte completo"
      }
    ]),
    ctaText: "Conheça Nossos Kits Industriais"
  },
  productsShowcase: {
    kicker: "Produtos em Destaque",
    title: "Soluções Completas em Tubulações",
    subtitle:
      "Conheça nossos principais kits industriais desenvolvidos para máxima eficiência e durabilidade",
    detailsButtonText: "Ver Detalhes",
    priceFallback: "Sob Consulta",
    viewAllButtonText: "Ver Todos os Produtos",
    viewAllSubtitle: "Explore nossa linha completa de kits industriais"
  },
  kitsShowcase: {
    title: "Conheça Nossos Kits Industriais",
    subtitle:
      "Veja como a solução aplicada na obra se conecta às linhas de água fria, água quente e ar-condicionado apresentadas na página de produtos.",
    imagesJson: JSON.stringify([
      {
        id: "kit-hidraulico",
        src: "/BRASPEX_kit_hidraulico_industrial.jpg",
        alt: "Kit Hidráulico Industrial Braspex",
        title: "Aplicação dos kits",
        description:
          "Sistema industrializado aplicado em ambiente real de obra",
        badge: "Aplicação"
      },
      {
        id: "tipos-kits",
        src: "/BRASPEX_kit_tipos.png",
        alt: "Tipos de Kits Braspex",
        title: "Sistemas integrados",
        description:
          "Água fria, água quente e ar-condicionado identificados por cor para leitura rápida",
        badge: "Sistemas"
      }
    ]),
    featuresJson: JSON.stringify([
      {
        emoji: "💧",
        title: "Água Fria",
        description: "Sistemas eficientes de distribuição e climatização"
      },
      {
        emoji: "🔥",
        title: "Água Quente",
        description: "Aquecimento de alta performance e economia"
      },
      {
        emoji: "❄️",
        title: "Ar-Condicionado",
        description: "Climatização inteligente e sustentável"
      }
    ]),
    ctaButtonText: "Ver Todos os Kits Industriais",
    ctaSubtext:
      "Explore nossa linha completa de produtos e encontre a solução ideal para sua empresa"
  },
  kitApplicationGuide: {
    kicker: "Aplicacao dos kits",
    title: "Kits prontos para acelerar a instalacao hidraulica da obra",
    description:
      "A BRASPEX transforma o projeto em conjuntos pre-montados para pontos de banheiro, cozinha, areas tecnicas e climatizacao. A obra recebe cada kit identificado, testado e pronto para encaixar no cronograma de instalacao.",
    kitTypesJson: JSON.stringify([
      {
        label: "Agua fria",
        tone: "blue"
      },
      {
        label: "Agua quente",
        tone: "red"
      },
      {
        label: "Ar-condicionado",
        tone: "sky"
      }
    ]),
    guideStepsJson: JSON.stringify([
      "Leitura do projeto executivo e separacao dos pontos de consumo.",
      "Montagem industrializada dos conjuntos em ambiente controlado.",
      "Entrega identificada para instalacao mais rapida e com menos retrabalho."
    ]),
    imageAlt: "Aplicacao do kit hidraulico industrial em ambiente de banheiro",
    imageBadge: "Kit por ambiente",
    visualTourKicker: "Tour visual",
    zoomGeneralLabel: "Geral",
    zoomPipesLabel: "Tubulacoes",
    zoomPointsLabel: "Pontos",
    resetZoomLabel: "Redefinir zoom",
    zoomOutLabel: "Diminuir zoom",
    zoomInLabel: "Aumentar zoom",
    ctaButtonText: "Ver produtos disponiveis",
    secondaryImageAlt: "Tipos de tubos Braspex para agua fria, agua quente e ar-condicionado",
    secondaryKicker: "Sistemas integrados",
    secondaryDescription: "Linhas separadas por uso e cor para leitura rapida na obra."
  },
  sobre: {
    title: "Braspex no Nordeste",
    content:
      "A Braspex industrializa kits hidráulicos para obras de construção civil, com base em Pernambuco e atuação regional no Nordeste.",
    differentialsJson: JSON.stringify([
      {
        title: "Qualidade Certificada",
        description:
          "Produtos desenvolvidos com tecnologia de ponta e rigor técnico, garantindo desempenho superior."
      },
      {
        title: "Eficiência Garantida",
        description:
          "Soluções prontas para obra que reduzem prazos, custos e retrabalhos significativamente."
      },
      {
        title: "Inovação Constante",
        description:
          "Modelo produtivo moderno e altamente controlado, sempre buscando evoluir e inovar."
      },
      {
        title: "Experiência Sólida",
        description:
          "Respaldados pela expertise do Grupo Protogás, líder no segmento de instalações de gás."
      }
    ]),
    statsJson: JSON.stringify([
      { value: "15+", label: "Anos de Experiência" },
      { value: "500+", label: "Projetos Entregues" },
      { value: "100%", label: "Satisfação dos Clientes" },
      { value: "24h", label: "Suporte Técnico" }
    ])
  },
  parceiros: {
    kicker: "Parceiros de Confiança",
    title: "Nossos Parceiros de Confiança",
    subtitle: "Trabalhamos com as melhores marcas do mercado para garantir qualidade superior",
    bottomText:
      "Trabalhamos com os melhores fornecedores do mercado para garantir a qualidade dos nossos produtos.",
    partnersAltJson: JSON.stringify([
      "Parceiro 1",
      "Parceiro 2",
      "Parceiro 3",
      "Parceiro 4",
      "Parceiro 5"
    ])
  },
  comparacao: {
    title: "Comparação de Prazo",
    subtitle: "TRADICIONAL VS KITS BRASPEX",
    description: "Os Kits BRASPEX revolucionam a construção civil com processos industrializados que garantem maior eficiência, qualidade superior e redução significativa de custos e prazos.",
    imageAlt: "Comparação visual entre instalação tradicional e Kits BRASPEX",
    chartDataJson: JSON.stringify([
      {
        value: 40,
        label: "De economia de mão de obra",
        color: "bg-gradient-to-r from-green-400 to-green-600"
      },
      {
        value: 10,
        label: "Menos dias no cronograma",
        color: "bg-gradient-to-r from-blue-400 to-blue-600"
      },
      {
        value: 80,
        label: "De redução de perdas",
        color: "bg-gradient-to-r from-yellow-400 to-yellow-600"
      },
      {
        value: 90,
        label: "Menos retrabalho",
        color: "bg-gradient-to-r from-red-400 to-red-600"
      }
    ])
  },
  kits: {
    title: "Nossos Kits Industrializados",
    variationsTitle: "Modelos Disponíveis:",
    productsJson: JSON.stringify([
      {
        id: "sistema-ppr",
        title: "Sistema PPR",
        category: "Kits de Água Fria e Quente",
        description:
          "Sistema rígido unido por termofusão, ideal para pontos de consumo que exigem máxima segurança e durabilidade. Suas juntas se tornam uma peça única, eliminando o risco de vazamentos.",
        caption: "Kits em PPR - Polipropileno Copolímero Random",
        variations: ["Kit Chuveiro Tê Misturador", "Kit Chuveiro Monocomando"]
      },
      {
        id: "airtechno",
        title: "AirTechno Multicamada",
        category: "Kits de Ar-Condicionado",
        description:
          "Tubulação multicamada com cinco camadas especiais que combinam alumínio e polietileno, proporcionando alta resistência à pressão e flexibilidade para instalação em projetos de climatização.",
        caption: "Kit AirTechno - Sistema Multicamada",
        variations: ["Kit Ar-Condicionado 9000 BTUs", "Kit Ar-Condicionado 12000 BTUs"]
      },
      {
        id: "chassis",
        title: "Chassis Metálicos",
        category: "Chassis Metálicos Industriais",
        description:
          "Estruturas fabricadas em aço galvanizado com tratamento anticorrosivo, projetadas para chuveiros, aquecedores e travessas industriais com acabamento premium e montagem precisa.",
        caption: "Chassis Metálicos Industriais",
        variations: ["Chassis para Chuveiros Residenciais", "Chassis para Aquecedores Industriais"]
      }
    ])
  },
  fluxo: {
    title: "Como Trabalhamos",
    description: "Nosso processo é estruturado para garantir máxima qualidade e eficiência em cada etapa.",
    stepsJson: JSON.stringify([
      {
        id: 1,
        shortTitle: "Projeto",
        title: "Recebimento do Projeto Executivo",
        timeframe: "2-3 dias úteis",
        description:
          "Nossa equipe técnica realiza uma análise detalhada do projeto executivo para compreender todas as especificações, requisitos técnicos e particularidades da obra.",
        items: [
          "Análise completa do projeto hidráulico",
          "Identificação de pontos críticos",
          "Levantamento de materiais necessários",
          "Cronograma preliminar de execução"
        ]
      },
      {
        id: 2,
        shortTitle: "Compatibilização",
        title: "Compatibilização Técnica e Detalhamento",
        timeframe: "3-5 dias úteis",
        description:
          "Desenvolvimento personalizado dos kits conforme as necessidades específicas do projeto, garantindo total compatibilidade com os sistemas prediais.",
        items: [
          "Compatibilização com outros sistemas",
          "Detalhamento técnico dos kits",
          "Especificação de materiais",
          "Aprovação do cliente"
        ]
      },
      {
        id: 3,
        shortTitle: "Produção",
        title: "Produção em Fábrica",
        timeframe: "5-10 dias úteis",
        description:
          "Fabricação dos kits em ambiente controlado, seguindo rigorosos padrões de qualidade e utilizando equipamentos de última geração.",
        items: [
          "Ambiente controlado de produção",
          "Equipamentos de alta precisão",
          "Controle de qualidade contínuo",
          "Rastreabilidade de componentes"
        ]
      },
      {
        id: 4,
        shortTitle: "Testes",
        title: "Teste de Montagem e Checklist",
        timeframe: "1-2 dias úteis",
        description:
          "Verificação completa de todos os componentes e teste de montagem para garantir perfeito funcionamento antes da entrega.",
        items: [
          "Teste de pressão hidráulica",
          "Verificação de conexões",
          "Checklist de qualidade",
          "Documentação técnica"
        ]
      },
      {
        id: 5,
        shortTitle: "Entrega",
        title: "Entrega Rastreável e Pronta",
        timeframe: "Conforme logística",
        description:
          "Kits prontos para instalação imediata, com embalagem adequada e sistema de rastreamento completo para acompanhamento da entrega.",
        items: [
          "Embalagem protegida e identificada",
          "Sistema de rastreamento",
          "Documentação completa",
          "Manual de instalação"
        ]
      },
      {
        id: 6,
        shortTitle: "Suporte",
        title: "Suporte Técnico na Obra",
        timeframe: "Sob demanda",
        description:
          "Acompanhamento técnico especializado durante a instalação, quando necessário, garantindo a correta implementação dos kits.",
        items: [
          "Suporte técnico especializado",
          "Acompanhamento da instalação",
          "Resolução de dúvidas",
          "Garantia de funcionamento"
        ]
      }
    ])
  },
  contato: {
    title: "Entre em Contato",
    subtitle: "Pronto para transformar seu projeto?",
    description: "Nossa equipe está pronta para desenvolver a solução ideal para sua obra. Entre em contato e descubra como nossos kits podem otimizar seu projeto.",
    nameLabel: "Nome Completo",
    namePlaceholder: "Seu nome completo",
    companyLabel: "Empresa",
    companyPlaceholder: "Nome da empresa",
    emailLabel: "E-mail",
    emailPlaceholder: "seu@email.com",
    phoneLabel: "Telefone",
    phonePlaceholder: "(81) 9999-9999",
    messageLabel: "Mensagem",
    messagePlaceholder: "Descreva seu projeto e necessidades...",
    requiredMark: "*",
    submitButtonText: "Enviar Mensagem",
    submittingText: "Enviando...",
    successTitle: "Mensagem enviada!",
    successDescription: "Recebemos seu contato e retornaremos em breve.",
    errorMessage: "Erro ao enviar mensagem. Tente novamente.",
    contactInfoJson: JSON.stringify([
      {
        label: "E-mail",
        value: "braspexne@gmail.com",
        href: "mailto:braspexne@gmail.com"
      },
      {
        label: "Telefone",
        value: "(81) 3342-1022",
        href: "http://wa.me/5581986431000"
      },
      {
        label: "Website",
        value: "www.braspex.com.br",
        href: "https://www.braspexne.com.br"
      },
      {
        label: "Endereço",
        value: "Porta Larga – Jaboatão dos Guararapes/PE",
        href: "https://share.google/fuX1aRpit49zobeYR"
      }
    ])
  },
  whatsapp: {
    phone: "5581989635638",
    message: "Olá! Gostaria de solicitar uma cotação.",
    buttonTitle: "Fale Conosco pelo WhatsApp"
  },
  cartDrawer: {
    title: "Carrinho de Orçamento",
    itemSingular: "item",
    itemPlural: "itens",
    emptyTitle: "Carrinho Vazio",
    emptyDescription: "Adicione produtos para solicitar um orçamento",
    emptyButtonText: "Ver Produtos",
    removeTitle: "Remover",
    requestQuoteTemplate: "Enviar Orçamento ({count} {items})",
    clearCart: "Limpar Carrinho"
  },
  footer: {
    logoAlt: "BRASPEX Logo",
    description: "Líder em soluções industrializadas para construção civil, oferecendo kits hidráulicos e de climatização com máxima qualidade e eficiência.",
    slogan: "",
    contactTitle: "Contato",
    socialTitle: "Redes Sociais",
    developedByPrefix: "Desenvolvido por",
    developedByName: "ConverseIA Tech",
    developedByUrl: "https://www.linkedin.com/company/converseia",
    copyright: "© 2025 Braspex. Todos os direitos reservados.",
    adminTitle: "Painel Administrativo",
    email: "",
    phone: "",
    address: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: ""
  },
  productsPage: {
    breadcrumbHome: "Home",
    breadcrumbProducts: "Produtos",
    title: "Kits Hidráulicos Industriais",
    subtitle: "Soluções completas e pré-montadas para instalação rápida e eficiente",
    categoriesTitle: "Categorias",
    allProductsCategory: "Todos os Produtos",
    categoryFallback: "Kit",
    productsFoundSingular: "produto encontrado",
    productsFoundPlural: "produtos encontrados",
    addToCart: "Adicionar",
    inCart: "No Carrinho",
    kitGuideButtonText: "Entenda a aplicacao dos kits",
    emptyTitle: "Nenhum produto encontrado",
    emptyDescription: "Não há produtos nesta categoria no momento.",
    emptyButtonText: "Ver todos os produtos"
  },
  productDetailPage: {
    loadingText: "Carregando produto...",
    notFoundTitle: "Produto não encontrado",
    backToProducts: "Voltar para produtos",
    variationsTitle: "Variações Disponíveis:",
    addToBudget: "Adicionar ao Orçamento",
    inCart: "No Carrinho",
    requestQuote: "Solicitar Cotação",
    specsTitle: "Especificações Técnicas",
    specsEmpty: "Nenhuma especificação disponível",
    includesTitle: "O que está incluído:",
    specLabelsJson: JSON.stringify({
      material: "Material",
      acabamento: "Acabamento",
      capacity: "Capacidade",
      dimensions: "Dimensões",
      diametros: "Diâmetros",
      normas: "Normas"
    })
  },
  quoteCheckout: {
    cartEmptyTitle: "Carrinho Vazio",
    cartEmptyDescription: "Adicione produtos ao carrinho antes de solicitar um orçamento",
    cartEmptyButton: "Ver Produtos",
    successTitle: "Orçamento Enviado com Sucesso!",
    successDescription: "Recebemos sua solicitação e entraremos em contato em breve.",
    successRedirecting: "Redirecionando para a página inicial...",
    pageTitle: "Finalizar Orçamento",
    pageSubtitle: "Preencha seus dados para receber um orçamento personalizado",
    step01Label: "Passo 01",
    step01Title: "Confira e preencha a quantidade de cada produto adicionado",
    step02Label: "Passo 02",
    step02Title: "Preencha seus dados abaixo e envie o orçamento",
    requiredHint: "Os campos marcados com {required} são obrigatórios.",
    tableProducts: "Produtos",
    tableQuantity: "Quantidade",
    tableAction: "Ação",
    continueShopping: "Continuar Orçando",
    submitError: "Erro ao enviar cotação. Por favor, tente novamente.",
    nameLabel: "Nome Completo",
    emailLabel: "E-mail",
    companyLabel: "Empresa",
    dddLabel: "DDD",
    phoneLabel: "Telefone",
    dddPlaceholder: "11",
    phonePlaceholder: "99999-9999",
    addressLabel: "Endereço",
    complementLabel: "Complemento",
    neighborhoodLabel: "Bairro",
    cityLabel: "Cidade",
    zipLabel: "CEP",
    zipPlaceholder: "00000-000",
    stateLabel: "Estado",
    stateSelectPlaceholder: "Selecione",
    stateOptionsJson: JSON.stringify([
      { value: "SP", label: "São Paulo" },
      { value: "RJ", label: "Rio de Janeiro" },
      { value: "MG", label: "Minas Gerais" },
      { value: "ES", label: "Espírito Santo" },
      { value: "PR", label: "Paraná" },
      { value: "SC", label: "Santa Catarina" },
      { value: "RS", label: "Rio Grande do Sul" }
    ]),
    commentsLabel: "Comentários",
    commentsPlaceholder: "Informações adicionais sobre o orçamento...",
    receiveNewsText: "Aceito receber novidades e informações da Braspex.",
    submittingText: "Enviando...",
    submitButtonText: "Enviar Orçamento",
    commentTemplateJson: JSON.stringify({
      header: "\n\n=== PRODUTOS DO ORÇAMENTO ===\n\n",
      quantityLabel: "Quantidade",
      priceLabel: "Preço",
      materialLabel: "Material",
      capacityLabel: "Capacidade",
      totalItemsLabel: "TOTAL DE ITENS",
      footer: "================================\n"
    })
  },
  blogPage: {
    heroTitle: "Blog Braspex",
    heroSubtitle:
      "Conteúdos técnicos sobre tubulações industriais, manutenção e eficiência energética",
    searchPlaceholder: "Buscar artigos...",
    categoriesJson: JSON.stringify([
      "Todos",
      "Chuveiros Industriais",
      "Aquecedores",
      "Ar-Condicionado",
      "Chassis",
      "Manutenção",
      "Eficiência"
    ]),
    readMore: "Ler mais",
    emptyText: "Nenhum artigo encontrado com os filtros selecionados."
  },
  blogPostPage: {
    notFoundTitle: "Artigo não encontrado",
    backToBlog: "Voltar para o blog",
    shareLabel: "Compartilhar",
    copyLinkSuccess: "Link copiado para a área de transferência!",
    keywordsTitle: "Palavras-chave:",
    ctaTitle: "Precisa de uma solução personalizada?",
    ctaDescription:
      "Entre em contato com a Braspex e receba uma cotação gratuita para seu projeto.",
    ctaButton: "Solicitar Cotação",
    relatedTitle: "Artigos Relacionados"
  },
  catalogsPage: {
    title: "Catálogo Virtual",
    subtitle: "Acesse e baixe nossos catálogos em PDF",
    loadingText: "Carregando catálogos...",
    emptyTitle: "Nenhum catálogo publicado",
    emptyDescription: "Em breve adicionaremos novos catálogos por aqui.",
    catalogTitleFallback: "Catálogo",
    noCoverTitle: "Sem capa",
    noCoverSubtitle: "Clique para abrir o PDF",
    openPdfButton: "Abrir PDF",
    coverAltFallback: "Capa do catálogo",
    loadErrorFallback: "Erro ao carregar catálogos"
  }
};

const mergeContentWithDefaults = (source = {}) => {
  const mergedContent = { ...DEFAULT_CONTENT };

  Object.keys(source || {}).forEach((section) => {
    if (mergedContent[section]) {
      mergedContent[section] = {
        ...mergedContent[section],
        ...source[section],
      };
    } else {
      mergedContent[section] = source[section];
    }
  });

  return mergedContent;
};

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    dailyViews: 0,
    visitors: []
  });
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Carregar conteúdo do Supabase na inicialização
  useEffect(() => {
    const loadContent = async () => {
      try {
        const supabaseContent = await textsAPI.getAllFormatted();
        if (supabaseContent && Object.keys(supabaseContent).length > 0) {
          // Merge: usar Supabase mas manter defaults para campos não encontrados
          const mergedContent = { ...DEFAULT_CONTENT };
          Object.keys(supabaseContent).forEach(section => {
            if (mergedContent[section]) {
              mergedContent[section] = {
                ...mergedContent[section],
                ...supabaseContent[section]
              };
            } else {
              mergedContent[section] = supabaseContent[section];
            }
          });
          setContent(mergedContent);
          setIsSupabaseConnected(true);
          console.log('✅ Conteúdo carregado do Supabase (merged com defaults)');
        } else {
          // Fallback para conteúdo local se Supabase não estiver disponível
          console.log('⚠️ Usando conteúdo DEFAULT - Supabase vazio ou não configurado');
          const saved = localStorage.getItem('siteContent');
          if (saved) {
            setContent(mergeContentWithDefaults(JSON.parse(saved)));
          } else {
            setContent(DEFAULT_CONTENT);
          }
          setIsSupabaseConnected(false);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar conteúdo do Supabase:', error);
        // Fallback para localStorage ou DEFAULT
        const saved = localStorage.getItem('siteContent');
        if (saved) {
          console.log('📦 Usando conteúdo do localStorage');
          setContent(mergeContentWithDefaults(JSON.parse(saved)));
        } else {
          console.log('📦 Usando conteúdo DEFAULT');
          setContent(DEFAULT_CONTENT);
        }
        setIsSupabaseConnected(false);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Carregar analytics do Supabase
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        if (isSupabaseConnected) {
          const supabaseAnalytics = await analyticsAPI.getStats();
          if (supabaseAnalytics) {
            setAnalytics(supabaseAnalytics);
          }
        } else {
          // Fallback para localStorage
          const saved = localStorage.getItem('siteAnalytics');
          if (saved) {
            setAnalytics(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar analytics do Supabase:', error);
      }
    };

    if (!loading) {
      loadAnalytics();
      
      // Registrar visita
      if (isSupabaseConnected) {
        analyticsAPI.trackView({
          page: window.location.pathname,
          userAgent: navigator.userAgent
        });
      } else {
        // Fallback para localStorage
        const today = new Date().toISOString().split('T')[0];
        const visitor = {
          date: new Date().toISOString(),
          userAgent: navigator.userAgent
        };

        setAnalytics(prev => {
          const newAnalytics = {
            ...prev,
            totalViews: prev.totalViews + 1,
            dailyViews: prev.visitors.filter(v => v.date.startsWith(today)).length + 1,
            visitors: [...prev.visitors, visitor].slice(-100)
          };
          
          localStorage.setItem('siteAnalytics', JSON.stringify(newAnalytics));
          return newAnalytics;
        });
      }

      // Atualizar analytics a cada 30 segundos se conectado ao Supabase
      if (isSupabaseConnected) {
        const interval = setInterval(loadAnalytics, 30000);
        return () => clearInterval(interval);
      }
    }
  }, [loading, isSupabaseConnected]);

  const updateContent = async (section, field, value) => {
    try {
      // ATUALIZAR ESTADO IMEDIATAMENTE para responsividade
      setContent(prev => {
        const nextContent = {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };

        if (!isSupabaseConnected) {
          localStorage.setItem('siteContent', JSON.stringify(nextContent));
        }

        return nextContent;
      });

      // SALVAR EM BACKGROUND (não bloqueia o input)
      if (isSupabaseConnected) {
        // Salvar no Supabase sem bloquear
        textsAPI.updateByField(section, field, value).catch(error => {
          console.error('❌ Erro ao salvar no Supabase:', error);
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error);
      return false;
    }
  };

  const resetContent = async () => {
    try {
      if (isSupabaseConnected) {
        // Em Supabase, precisamos resetar campo por campo
        for (const section of Object.keys(DEFAULT_CONTENT)) {
          for (const field of Object.keys(DEFAULT_CONTENT[section])) {
            await textsAPI.updateByField(section, field, DEFAULT_CONTENT[section][field]);
          }
        }
        setContent(DEFAULT_CONTENT);
        return true;
      } else {
        // Fallback para localStorage
        setContent(DEFAULT_CONTENT);
        localStorage.setItem('siteContent', JSON.stringify(DEFAULT_CONTENT));
        return true;
      }
    } catch (error) {
      console.error('Erro ao resetar conteúdo:', error);
      return false;
    }
  };

  const refreshContent = async () => {
    setLoading(true);
    try {
      const supabaseContent = await textsAPI.getAllFormatted();
      if (supabaseContent && Object.keys(supabaseContent).length > 0) {
        setContent(mergeContentWithDefaults(supabaseContent));
        setIsSupabaseConnected(true);
      } else {
        const saved = localStorage.getItem('siteContent');
        setContent(saved ? mergeContentWithDefaults(JSON.parse(saved)) : DEFAULT_CONTENT);
        setIsSupabaseConnected(false);
      }
      return true;
    } catch (error) {
      console.error('Erro ao recarregar conteudo:', error);
      const saved = localStorage.getItem('siteContent');
      setContent(saved ? mergeContentWithDefaults(JSON.parse(saved)) : DEFAULT_CONTENT);
      setIsSupabaseConnected(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    content,
    analytics,
    updateContent,
    resetContent,
    refreshContent,
    loading,
    isSupabaseConnected
  };

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};
