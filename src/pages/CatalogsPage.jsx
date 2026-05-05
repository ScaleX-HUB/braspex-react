import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { catalogsAPI } from '../services/catalogsAPI';
import { FileText } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';

const CatalogsPage = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { content } = useSiteContent();
  const catalogsContent = content.catalogsPage;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await catalogsAPI.getAll(false);
        setCatalogs(items || []);
      } catch (e) {
        setError(e.message || catalogsContent?.loadErrorFallback || 'Erro ao carregar catálogos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [catalogsContent?.loadErrorFallback]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold text-gray-900">{catalogsContent?.title || 'Catálogo Virtual'}</h1>
          <p className="text-lg text-gray-600 mt-2">
            {catalogsContent?.subtitle || 'Acesse e baixe nossos catálogos em PDF'}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-600">
            {catalogsContent?.loadingText || 'Carregando catálogos...'}
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 rounded-xl border border-red-200 p-8 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && catalogs.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#005563]/10 flex items-center justify-center mb-4">
              <FileText size={32} className="text-[#005563]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{catalogsContent?.emptyTitle || 'Nenhum catálogo publicado'}</h2>
            <p className="text-gray-600 mt-1">
              {catalogsContent?.emptyDescription || 'Em breve adicionaremos novos catálogos por aqui.'}
            </p>
          </div>
        )}

        {!loading && !error && catalogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {catalogs.map((cat) => (
              <a
                key={cat.id}
                href={cat.pdf_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden hover:shadow-xl transition-all">
                  <div className="p-6">
                    <h3 className="text-2xl font-serif text-red-600 text-center mb-6 group-hover:text-red-700 transition-colors">
                      {cat.title || catalogsContent?.catalogTitleFallback || 'Catálogo'}
                    </h3>
                    <div className="aspect-[3/4] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                      {cat.cover_url ? (
                        <img
                          src={cat.cover_url}
                          alt={cat.title || catalogsContent?.coverAltFallback || 'Capa do catálogo'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center text-gray-500 p-8">
                          <FileText size={48} className="mx-auto mb-3 text-[#005563]" />
                          <div className="font-semibold">{catalogsContent?.noCoverTitle || 'Sem capa'}</div>
                          <div className="text-sm">{catalogsContent?.noCoverSubtitle || 'Clique para abrir o PDF'}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="w-full text-center bg-[#005563] text-white font-bold py-3 rounded-xl group-hover:bg-[#004450] transition-colors">
                      {catalogsContent?.openPdfButton || 'Abrir PDF'}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CatalogsPage;
