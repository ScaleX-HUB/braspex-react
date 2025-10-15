import React, { useState, useEffect } from 'react';
import { 
  EnvelopeSimple, 
  Phone, 
  User, 
  MapPin, 
  Calendar,
  Clock,
  ShoppingCart,
  Package,
  Trash,
  CheckCircle,
  XCircle,
  ChatCircle,
  Funnel,
  MagnifyingGlass,
  Download
} from 'phosphor-react';
import { loadQuotes, updateQuoteStatus, deleteQuote, useQuotesSync, getQuotesStats } from '../../data/quotesUtils';
import { addClient, findClientByEmail } from '../../data/clientsUtils';

const QuotesManager = () => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadQuotesData();
  }, []);

  useEffect(() => {
    filterQuotes();
  }, [selectedStatus, searchTerm, quotes]);

  // Sincronizar quando cotações forem atualizadas
  useQuotesSync((updatedQuotes) => {
    setQuotes(updatedQuotes);
    updateStats();
  });

  const loadQuotesData = () => {
    const data = loadQuotes();
    setQuotes(data);
    updateStats();
  };

  const updateStats = () => {
    const newStats = getQuotesStats();
    setStats(newStats);
  };

  const filterQuotes = () => {
    let filtered = quotes;

    // Filtrar por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(q => q.status === selectedStatus);
    }

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(q => 
        q.customer?.name?.toLowerCase().includes(term) ||
        q.customer?.email?.toLowerCase().includes(term) ||
        q.customer?.phone?.toLowerCase().includes(term) ||
        q.customer?.company?.toLowerCase().includes(term)
      );
    }

    setFilteredQuotes(filtered);
  };

  const handleStatusChange = (quoteId, newStatus) => {
    if (updateQuoteStatus(quoteId, newStatus)) {
      // Se o status for "converted", criar automaticamente um cliente
      if (newStatus === 'converted') {
        const quotes = loadQuotes();
        const quote = quotes.find(q => q.id === quoteId);
        
        if (quote && quote.customer) {
          // Verificar se cliente já existe
          const existingClient = findClientByEmail(quote.customer.email);
          
          if (!existingClient) {
            // Criar novo cliente com os dados da cotação
            const clientData = {
              name: quote.customer.name,
              email: quote.customer.email,
              phone: quote.customer.phone || '',
              company: quote.customer.company || '',
              address: quote.customer.address || '',
              city: quote.customer.city || '',
              state: quote.customer.state || '',
              zipCode: quote.customer.zipCode || '',
              notes: `Cliente criado automaticamente da cotação #${quote.id}\n\n${quote.customer.message || ''}`,
              stage: 'client',
              inactive: false
            };
            
            addClient(clientData);
            alert('Status atualizado e cliente cadastrado automaticamente com sucesso!');
          } else {
            alert('Status atualizado! Cliente já existe no cadastro.');
          }
        }
      } else {
        alert('Status atualizado com sucesso!');
      }
      
      loadQuotesData();
    }
  };

  const handleDelete = (quoteId) => {
    if (window.confirm('Tem certeza que deseja excluir esta cotação?')) {
      if (deleteQuote(quoteId)) {
        alert('Cotação excluída com sucesso!');
        loadQuotesData();
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      contacted: 'bg-blue-100 text-blue-800 border-blue-300',
      converted: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendente',
      contacted: 'Contatado',
      converted: 'Convertido',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  const exportToCSV = () => {
    const headers = ['Data', 'Cliente', 'Email', 'Telefone', 'Empresa', 'Status', 'Produtos', 'Mensagem'];
    const rows = filteredQuotes.map(q => [
      formatDate(q.createdAt),
      q.customer?.name || '-',
      q.customer?.email || '-',
      q.customer?.phone || '-',
      q.customer?.company || '-',
      getStatusLabel(q.status),
      q.items?.length || 0,
      q.customer?.message || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cotacoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <EnvelopeSimple size={28} weight="bold" className="text-[#005563]" />
              Cotações Recebidas
            </h2>
            <p className="text-gray-600 mt-1">
              Gerencie as solicitações de orçamento dos clientes
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center gap-2"
          >
            <Download size={20} weight="bold" />
            Exportar CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stats.total || 0}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">{stats.pending || 0}</div>
            <div className="text-sm text-yellow-700">Pendentes</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-800">{stats.contacted || 0}</div>
            <div className="text-sm text-blue-700">Contatados</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-800">{stats.converted || 0}</div>
            <div className="text-sm text-green-700">Convertidos</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-800">{stats.cancelled || 0}</div>
            <div className="text-sm text-red-700">Cancelados</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-2xl font-bold text-purple-800">{stats.today || 0}</div>
            <div className="text-sm text-purple-700">Hoje</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <div className="text-2xl font-bold text-indigo-800">{stats.thisWeek || 0}</div>
            <div className="text-sm text-indigo-700">Esta Semana</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MagnifyingGlass size={16} weight="bold" className="inline mr-1" />
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome, email, telefone ou empresa..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
            />
          </div>

          {/* Filtro de Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Funnel size={16} weight="bold" className="inline mr-1" />
              Filtrar por Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="contacted">Contatado</option>
              <option value="converted">Convertido</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Cotações */}
      <div className="space-y-4">
        {filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
            <EnvelopeSimple size={48} weight="light" className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {quotes.length === 0 ? 'Nenhuma cotação recebida ainda' : 'Nenhuma cotação encontrada com os filtros aplicados'}
            </p>
          </div>
        ) : (
          filteredQuotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {quote.customer?.name || 'Cliente sem nome'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    <span>{formatDate(quote.createdAt)}</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <select
                    value={quote.status}
                    onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                  >
                    <option value="pending">Pendente</option>
                    <option value="contacted">Contatado</option>
                    <option value="converted">Convertido</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                  <button
                    onClick={() => handleDelete(quote.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Informações do Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <EnvelopeSimple size={18} className="text-[#005563]" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <a href={`mailto:${quote.customer?.email}`} className="text-sm font-medium text-[#005563] hover:underline">
                      {quote.customer?.email || '-'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-[#005563]" />
                  <div>
                    <div className="text-xs text-gray-500">Telefone</div>
                    <a href={`tel:${quote.customer?.phone}`} className="text-sm font-medium text-gray-900">
                      {quote.customer?.phone || '-'}
                    </a>
                  </div>
                </div>

                {quote.customer?.company && (
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-[#005563]" />
                    <div>
                      <div className="text-xs text-gray-500">Empresa</div>
                      <div className="text-sm font-medium text-gray-900">{quote.customer.company}</div>
                    </div>
                  </div>
                )}

                {quote.customer?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#005563]" />
                    <div>
                      <div className="text-xs text-gray-500">Localização</div>
                      <div className="text-sm font-medium text-gray-900">
                        {quote.customer.city}{quote.customer.state ? `, ${quote.customer.state}` : ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Produtos Solicitados */}
              {quote.items && quote.items.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <ShoppingCart size={16} weight="bold" />
                    Produtos Solicitados ({quote.items.length})
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="space-y-2">
                      {quote.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-900">{item.name}</span>
                          <span className="text-gray-500">{item.price || 'Sob Consulta'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mensagem */}
              {quote.customer?.message && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <ChatCircle size={16} weight="bold" />
                    Mensagem
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{quote.customer.message}</p>
                  </div>
                </div>
              )}

              {/* Ações Rápidas */}
              <div className="mt-4 pt-4 border-t flex gap-3">
                <a
                  href={`mailto:${quote.customer?.email}?subject=Cotação Braspex - ${quote.id}`}
                  className="flex-1 px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors text-center text-sm font-medium"
                >
                  Enviar Email
                </a>
                <a
                  href={`https://wa.me/55${quote.customer?.phone?.replace(/\D/g, '')}?text=Olá ${quote.customer?.name}, recebemos sua solicitação de cotação!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuotesManager;
