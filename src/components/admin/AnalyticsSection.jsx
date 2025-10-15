import React from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { Eye, Users, Calendar, ChartBar } from 'phosphor-react';

const AnalyticsSection = () => {
  const { analytics, loading } = useSiteContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005563]"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Visualizações Totais',
      value: analytics?.totalViews || 0,
      icon: <Eye className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Visitantes Únicos',
      value: analytics?.uniqueVisitors || 0,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      title: 'Média Diária',
      value: analytics?.averageDaily || 0,
      icon: <Calendar className="w-8 h-8" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Taxa de Conversão',
      value: `${analytics?.conversionRate || 0}%`,
      icon: <ChartBar className="w-8 h-8" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics do Site</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Gráficos - Placeholder */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Visualizações nos Últimos 30 Dias
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-400">Gráfico em desenvolvimento</p>
        </div>
      </div>

      {/* Seção de Páginas Mais Visitadas */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Páginas Mais Visitadas
        </h3>
        <div className="space-y-3">
          {analytics?.topPages?.map((page, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-700">{page.path}</span>
              <span className="font-semibold text-[#005563]">{page.views} views</span>
            </div>
          )) || (
            <p className="text-gray-400 text-center py-4">Nenhum dado disponível</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
