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
  hero: {
    title: "Soluções Industrializadas",
    subtitle: "para Construção Civil",
    description: "Da engenharia ao resultado final: kits prontos para instalação, qualidade garantida e agilidade para sua obra.",
    buttonText: "Solicitar Cotação",
    videoButtonText: "Ver Vídeo"
  },
  vantagens: {
    title: "Por que escolher os Kits BRASPEX?",
    subtitle: "Nosso diferencial está na combinação entre inovação, qualidade e eficiência"
  },
  parceiros: {
    title: "Nossos Parceiros de Confiança",
    subtitle: "Trabalhamos com as melhores marcas do mercado para garantir qualidade superior"
  },
  comparacao: {
    title: "Comparação de Prazo",
    subtitle: "TRADICIONAL VS KITS BRASPEX",
    description: "Os Kits BRASPEX revolucionam a construção civil com processos industrializados que garantem maior eficiência, qualidade superior e redução significativa de custos e prazos."
  },
  kits: {
    title: "Nossos Kits Industrializados"
  },
  fluxo: {
    title: "Como Trabalhamos",
    description: "Nosso processo é estruturado para garantir máxima qualidade e eficiência em cada etapa."
  },
  contato: {
    title: "Entre em Contato",
    subtitle: "Pronto para transformar seu projeto?",
    description: "Nossa equipe está pronta para desenvolver a solução ideal para sua obra. Entre em contato e descubra como nossos kits podem otimizar seu projeto."
  },
  footer: {
    description: "Líder em soluções industrializadas para construção civil, oferecendo kits hidráulicos e de climatização com máxima qualidade e eficiência.",
    copyright: "© 2024 BRASPEX. Todos os direitos reservados."
  }
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
          setContent(supabaseContent);
          setIsSupabaseConnected(true);
        } else {
          // Fallback para conteúdo local se Supabase não estiver disponível
          console.log('Usando conteúdo local - Supabase não configurado');
          const saved = localStorage.getItem('siteContent');
          if (saved) {
            setContent(JSON.parse(saved));
          }
          setIsSupabaseConnected(false);
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo do Supabase:', error);
        // Fallback para localStorage
        const saved = localStorage.getItem('siteContent');
        if (saved) {
          setContent(JSON.parse(saved));
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
      if (isSupabaseConnected) {
        await textsAPI.updateByField(section, field, value);
        setContent(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }));
        return true;
      } else {
        // Fallback para localStorage se Supabase não estiver disponível
        const newContent = {
          ...content,
          [section]: {
            ...content[section],
            [field]: value
          }
        };
        setContent(newContent);
        localStorage.setItem('siteContent', JSON.stringify(newContent));
        return true;
      }
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

  const value = {
    content,
    analytics,
    updateContent,
    resetContent,
    loading,
    isSupabaseConnected
  };

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};