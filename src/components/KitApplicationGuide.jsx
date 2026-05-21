import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  Flame,
  Gauge,
  PackageCheck,
  RotateCcw,
  Snowflake,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';

const toneStyles = {
  blue: { Icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
  red: { Icon: Flame, color: 'text-red-600', bg: 'bg-red-50' },
  sky: { Icon: Snowflake, color: 'text-sky-700', bg: 'bg-sky-50' }
};

const defaultKitTypes = [
  { label: 'Agua fria', tone: 'blue' },
  { label: 'Agua quente', tone: 'red' },
  { label: 'Ar-condicionado', tone: 'sky' }
];

const defaultGuideSteps = [
  'Leitura do projeto executivo e separacao dos pontos de consumo.',
  'Montagem industrializada dos conjuntos em ambiente controlado.',
  'Entrega identificada para instalacao mais rapida e com menos retrabalho.'
];

const KitApplicationGuide = ({ compact = false }) => {
  const { content } = useSiteContent();
  const guideContent = content?.kitApplicationGuide || {};
  const [zoomIndex, setZoomIndex] = useState(0);

  const kitTypes = useMemo(() => {
    const parsed = safeJsonParse(guideContent.kitTypesJson, null);
    const source = Array.isArray(parsed) && parsed.length ? parsed : defaultKitTypes;

    return source.slice(0, 3).map((item, index) => {
      const tone = item?.tone || defaultKitTypes[index]?.tone || 'blue';
      return {
        label: item?.label || defaultKitTypes[index]?.label,
        ...(toneStyles[tone] || toneStyles.blue)
      };
    });
  }, [guideContent.kitTypesJson]);

  const guideSteps = useMemo(() => {
    const parsed = safeJsonParse(guideContent.guideStepsJson, null);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultGuideSteps;
  }, [guideContent.guideStepsJson]);

  const zoomStops = useMemo(
    () => [
      { label: guideContent.zoomGeneralLabel || 'Geral', scale: 1.02, origin: '50% 50%' },
      { label: guideContent.zoomPipesLabel || 'Tubulacoes', scale: 1.36, origin: '16% 36%' },
      { label: guideContent.zoomPointsLabel || 'Pontos', scale: 1.72, origin: '82% 42%' },
    ],
    [guideContent.zoomGeneralLabel, guideContent.zoomPipesLabel, guideContent.zoomPointsLabel]
  );

  const activeZoom = zoomStops[zoomIndex];
  const canZoomOut = zoomIndex > 0;
  const canZoomIn = zoomIndex < zoomStops.length - 1;

  const zoomOut = () => setZoomIndex((current) => Math.max(current - 1, 0));
  const zoomIn = () => setZoomIndex((current) => Math.min(current + 1, zoomStops.length - 1));
  const resetZoom = () => setZoomIndex(0);
  const cycleZoom = () => setZoomIndex((current) => (current + 1) % zoomStops.length);

  return (
    <section
      id="aplicacao-kits"
      className={compact ? 'bg-white py-12' : 'scroll-mt-28 bg-white py-16'}
      aria-labelledby="kit-application-title"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="space-y-7">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#007A86]">
                {guideContent.kicker || 'Aplicacao dos kits'}
              </p>
              <h2
                id="kit-application-title"
                className="max-w-3xl text-3xl font-bold leading-tight text-[#001f26] md:text-4xl"
              >
                {guideContent.title || 'Kits prontos para acelerar a instalacao hidraulica da obra'}
              </h2>
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              {guideContent.description ||
                'A BRASPEX transforma o projeto em conjuntos pre-montados para pontos de banheiro, cozinha, areas tecnicas e climatizacao. A obra recebe cada kit identificado, testado e pronto para encaixar no cronograma de instalacao.'}
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {kitTypes.map(({ label, Icon, color, bg }) => (
                <div key={label} className="border border-slate-200 bg-slate-50 p-4">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center ${bg}`}>
                    {React.createElement(Icon, {
                      className: `h-5 w-5 ${color}`,
                      strokeWidth: 2.3,
                      'aria-hidden': 'true'
                    })}
                  </div>
                  <p className="text-sm font-bold uppercase text-slate-800">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {guideSteps.map((step) => (
                <div key={step} className="flex gap-3 text-sm leading-relaxed text-slate-700 md:text-base">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#007A86]" aria-hidden="true" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {!compact && (
              <Link
                to="/produtos"
                className="inline-flex items-center gap-2 bg-[#005563] px-6 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-[#003d47]"
              >
                {guideContent.ctaButtonText || 'Ver produtos disponiveis'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>

          <div className="grid gap-4">
            <div className="relative min-h-[340px] overflow-hidden border border-slate-200 bg-[#f4f5f1] shadow-xl md:min-h-[450px]">
              <button
                type="button"
                onClick={cycleZoom}
                className="absolute inset-0 block h-full w-full overflow-hidden text-left"
                aria-label={guideContent.visualTourKicker || 'Alternar zoom do tour visual'}
              >
                <img
                  src="/BRASPEX_kit_hidraulico_industrial.jpg"
                  alt={guideContent.imageAlt || 'Aplicacao do kit hidraulico industrial em ambiente de banheiro'}
                  className="h-full w-full object-cover object-[45%_42%] transition-transform duration-700 ease-out"
                  style={{
                    transform: `scale(${activeZoom.scale})`,
                    transformOrigin: activeZoom.origin,
                  }}
                />
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-[#001f26]/14" />

              <div className="absolute left-5 top-5 border border-white/35 bg-white/92 px-4 py-3 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-5 w-5 text-[#007A86]" aria-hidden="true" />
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#001f26]">
                    {guideContent.imageBadge || 'Kit por ambiente'}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 max-w-[430px] border border-white/30 bg-[#001f26]/90 px-4 py-3 text-white shadow-xl backdrop-blur">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#FFD027]">
                      {guideContent.visualTourKicker || 'Tour visual'}
                    </p>
                    <p className="mt-1 text-sm text-white/78">{activeZoom.label}</p>
                  </div>
                  <button
                    type="button"
                    onClick={resetZoom}
                    className="flex h-9 w-9 items-center justify-center border border-white/18 text-white/80 transition-colors hover:border-[#FFD027] hover:text-[#FFD027]"
                    aria-label={guideContent.resetZoomLabel || 'Redefinir zoom'}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={zoomOut}
                    disabled={!canZoomOut}
                    className="flex h-10 w-10 items-center justify-center border border-white/18 text-white transition-colors hover:border-[#FFD027] hover:text-[#FFD027] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label={guideContent.zoomOutLabel || 'Diminuir zoom'}
                  >
                    <ZoomOut className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <div className="grid flex-1 grid-cols-3 gap-2">
                    {zoomStops.map((stop, index) => (
                      <button
                        key={stop.label}
                        type="button"
                        onClick={() => setZoomIndex(index)}
                        className={`h-10 border px-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
                          index === zoomIndex
                            ? 'border-[#FFD027] bg-[#FFD027] text-[#001f26]'
                            : 'border-white/18 text-white/78 hover:border-[#FFD027] hover:text-[#FFD027]'
                        }`}
                      >
                        {stop.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={zoomIn}
                    disabled={!canZoomIn}
                    className="flex h-10 w-10 items-center justify-center border border-white/18 text-white transition-colors hover:border-[#FFD027] hover:text-[#FFD027] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label={guideContent.zoomInLabel || 'Aumentar zoom'}
                  >
                    <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid items-center gap-5 border border-slate-200 bg-white p-4 shadow-md md:grid-cols-[1.15fr_0.85fr]">
              <img
                src="/BRASPEX_kit_tipos.png"
                alt={guideContent.secondaryImageAlt || 'Tipos de tubos Braspex para agua fria, agua quente e ar-condicionado'}
                className="aspect-[16/9] w-full bg-slate-50 object-cover object-center"
              />
              <div className="text-[#001f26]">
                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#FFD027]/18">
                  <Gauge className="h-5 w-5 text-[#005563]" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#007A86]">
                  {guideContent.secondaryKicker || 'Sistemas integrados'}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {guideContent.secondaryDescription || 'Linhas separadas por uso e cor para leitura rapida na obra.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KitApplicationGuide;
