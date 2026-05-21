import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Factory, Flame, Lock, PackageCheck, Snowflake, Target, Zap } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';

const defaultImages = [
  {
    id: 'kit-hidraulico',
    src: '/BRASPEX_kit_hidraulico_industrial.jpg',
    alt: 'Kit Hidráulico Industrial Braspex',
    title: 'Aplicação dos kits',
    description: 'Sistema industrializado aplicado em ambiente real de obra',
    badge: 'Aplicação'
  },
  {
    id: 'tipos-kits',
    src: '/BRASPEX_kit_tipos.png',
    alt: 'Tipos de Kits Braspex',
    title: 'Sistemas integrados',
    description: 'Água fria, água quente e ar-condicionado identificados por cor para leitura rápida',
    badge: 'Sistemas'
  }
];

const defaultFeatures = [
  { title: 'Água fria', description: 'Pontos hidráulicos com leitura rápida na obra', Icon: Droplets, color: 'text-blue-600' },
  { title: 'Água quente', description: 'Montagens preparadas para desempenho e segurança', Icon: Flame, color: 'text-red-600' },
  { title: 'Ar-condicionado', description: 'Soluções para instalação de climatização', Icon: Snowflake, color: 'text-sky-700' }
];

const defaultBenefits = [
  { title: 'Qualidade em fábrica', description: 'Montagem controlada, testada e padronizada antes da entrega.', Icon: Factory },
  { title: 'Rastreabilidade', description: 'Componentes identificados para leitura rápida e controle em obra.', Icon: Lock },
  { title: 'Agilidade', description: 'Instalação mais rápida e com menos retrabalho no cronograma.', Icon: Zap },
  { title: 'Suporte técnico', description: 'Acompanhamento do projeto à entrega com equipe especializada.', Icon: Target }
];

const legacySubtitle = 'Soluções completas e integradas para sistemas de água fria, água quente e ar-condicionado';

const KitsShowcase = () => {
  const { content } = useSiteContent();
  const kitsShowcaseContent = content.kitsShowcase;
  const vantagensContent = content.vantagens || {};

  const parsedImages = safeJsonParse(kitsShowcaseContent?.imagesJson, null);
  const images = Array.isArray(parsedImages) && parsedImages.length ? parsedImages : defaultImages;
  const applicationImage = images.find((image) => image.id === 'kit-hidraulico') || images[0] || defaultImages[0];
  const typesImage = images.find((image) => image.id === 'tipos-kits') || images[1] || defaultImages[1];

  const parsedFeatures = safeJsonParse(kitsShowcaseContent?.featuresJson, null);
  const features = Array.isArray(parsedFeatures) && parsedFeatures.length
    ? parsedFeatures.slice(0, 3).map((feature, index) => ({
        ...defaultFeatures[index],
        ...feature,
        Icon: defaultFeatures[index]?.Icon || PackageCheck,
        color: defaultFeatures[index]?.color || 'text-[#007A86]'
      }))
    : defaultFeatures;
  const parsedBenefits = safeJsonParse(vantagensContent?.stepsJson, null);
  const benefits = Array.isArray(parsedBenefits) && parsedBenefits.length
    ? parsedBenefits.slice(0, 4).map((benefit, index) => ({
        ...defaultBenefits[index],
        title: benefit?.title || defaultBenefits[index]?.title,
        description: benefit?.description || defaultBenefits[index]?.description,
        Icon: defaultBenefits[index]?.Icon || PackageCheck,
      }))
    : defaultBenefits;
  const showcaseSubtitle =
    !kitsShowcaseContent?.subtitle || kitsShowcaseContent.subtitle === legacySubtitle
      ? 'Veja como a solução aplicada na obra se conecta às linhas de água fria, água quente e ar-condicionado apresentadas na página de produtos.'
      : kitsShowcaseContent.subtitle;
  const unifiedTitle = vantagensContent?.title || 'Por que escolher os Kits BRASPEX?';
  const unifiedSubtitle = vantagensContent?.subtitle || showcaseSubtitle;
  const applicationTitle =
    applicationImage.title === 'Kit Hidráulico Industrial' ? 'Aplicação dos kits' : applicationImage.title;
  const applicationDescription =
    applicationImage.description === 'Soluções robustas e eficientes para aplicações industriais de grande porte'
      ? 'Sistema industrializado aplicado em ambiente real de obra'
      : applicationImage.description;
  const applicationBadge = applicationImage.badge === 'Em Destaque' ? 'Aplicação' : applicationImage.badge;
  const typesTitle = typesImage.title === 'Variedade de Soluções' ? 'Sistemas integrados' : typesImage.title;
  const typesDescription =
    typesImage.description === 'Diferentes tipos de kits para atender todas as necessidades da sua empresa'
      ? 'Água fria, água quente e ar-condicionado identificados por cor para leitura rápida'
      : typesImage.description;
  const typesBadge = typesImage.badge === 'Versátil' ? 'Sistemas' : typesImage.badge;

  return (
    <section id="kits-showcase" className="bg-[#f6f8f8] py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#007A86]">
            Nossos Kits
          </p>
          <h2 className="text-3xl font-bold leading-tight text-[#001f26] md:text-5xl">
            {unifiedTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            {unifiedSubtitle}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map(({ title, description, Icon }) => (
              <div key={title} className="border border-[#007A86]/15 bg-white p-4 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#007A86]/8">
                  {React.createElement(Icon, {
                    className: 'h-5 w-5 text-[#005563]',
                    strokeWidth: 2.3,
                    'aria-hidden': 'true'
                  })}
                </div>
                <h3 className="text-sm font-bold uppercase text-[#001f26]">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-[#007A86]">
            Linhas de aplicação
          </p>
          <div className="mt-3 grid gap-3">
            {features.map(({ title, description, Icon, color }) => (
              <div key={title} className="flex gap-4 border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-slate-50">
                  {React.createElement(Icon, {
                    className: `h-5 w-5 ${color}`,
                    strokeWidth: 2.3,
                    'aria-hidden': 'true'
                  })}
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/produtos#aplicacao-kits"
              className="inline-flex items-center justify-center gap-3 bg-[#005563] px-8 py-4 text-sm font-bold uppercase text-white shadow-lg transition-colors hover:bg-[#003d47]"
            >
              Entender aplicação dos kits
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/produtos"
              className="inline-flex items-center justify-center gap-3 border border-[#005563]/20 bg-white px-8 py-4 text-sm font-bold uppercase text-[#005563] transition-colors hover:bg-[#005563]/5"
            >
              Ver página de produtos
            </Link>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[380px] overflow-hidden border border-slate-200 bg-white shadow-xl md:min-h-[500px] xl:min-h-[560px]">
            <img
              src={applicationImage.src}
              alt={applicationImage.alt}
              className="absolute inset-0 h-full w-full object-cover object-[45%_42%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#001f26]/46" />
            <div className="absolute left-5 top-5 flex items-center gap-2 bg-white/92 px-4 py-3 shadow-lg backdrop-blur">
              <PackageCheck className="h-5 w-5 text-[#007A86]" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#001f26]">
                {applicationBadge || 'Aplicação'}
              </span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="text-xl font-bold leading-tight">{applicationTitle}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/76">
                {applicationDescription}
              </p>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-4 shadow-lg xl:self-end">
            <img
              src={typesImage.src}
              alt={typesImage.alt}
              className="aspect-[4/3] w-full bg-slate-50 object-cover object-center"
            />
            <div className="pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#007A86]">
                {typesBadge || 'Sistemas'}
              </p>
              <h3 className="mt-1 text-lg font-bold leading-tight text-[#001f26]">{typesTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{typesDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KitsShowcase;
