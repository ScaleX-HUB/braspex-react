import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Mail, Phone, MapPin, Package, Calendar } from 'lucide-react';

const ClientsSection = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar clientes do localStorage ou Supabase
    loadClients();
  }, []);

  useEffect(() => {
    // Filtrar clientes
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(client => 
        client.interests?.includes(filterCategory)
      );
    }

    setFilteredClients(filtered);
  }, [searchTerm, filterCategory, clients]);

  const loadClients = () => {
    setLoading(true);
    try {
      // Simular dados de clientes (na prática virá do Supabase)
      const mockClients = [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao.silva@empresa.com.br',
          phone: '(11) 98765-4321',
          company: 'Construtora ABC',
          address: 'São Paulo, SP',
          interests: ['Kit PPR Água Quente/Fria', 'Kit Ar-Condicionado'],
          registeredAt: '2025-10-10T14:30:00',
          message: 'Interessado em orçamento para obra residencial de 50 apartamentos'
        },
        {
          id: 2,
          name: 'Maria Santos',
          email: 'maria@industrias.com',
          phone: '(21) 97654-3210',
          company: 'Indústrias XYZ',
          address: 'Rio de Janeiro, RJ',
          interests: ['Chassis Metálicos'],
          registeredAt: '2025-10-12T09:15:00',
          message: 'Preciso de chassis para climatização industrial'
        },
        {
          id: 3,
          name: 'Pedro Oliveira',
          email: 'pedro.oliveira@email.com',
          phone: '(48) 99876-5432',
          company: null,
          address: 'Florianópolis, SC',
          interests: ['Kit PPR Água Quente/Fria'],
          registeredAt: '2025-10-13T16:45:00',
          message: 'Reforma residencial - 3 banheiros e 1 cozinha'
        }
      ];

      setClients(mockClients);
      setFilteredClients(mockClients);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Empresa', 'Endereço', 'Interesses', 'Data Cadastro', 'Mensagem'].join(','),
      ...filteredClients.map(client => [
        client.name,
        client.email,
        client.phone,
        client.company || '-',
        client.address,
        client.interests?.join('; ') || '-',
        new Date(client.registeredAt).toLocaleDateString('pt-BR'),
        `"${client.message}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clientes_braspex_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005563]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={32} />
            Clientes Cadastrados
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredClients.length} de {clients.length} clientes
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download size={20} />
          Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, email ou empresa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
            />
          </div>

          {/* Filtro por interesse */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
          >
            <option value="all">Todos os Interesses</option>
            <option value="Kit PPR Água Quente/Fria">Kit PPR Água Quente/Fria</option>
            <option value="Kit Ar-Condicionado">Kit Ar-Condicionado</option>
            <option value="Chassis Metálicos">Chassis Metálicos</option>
          </select>
        </div>
      </div>

      {/* Cards de Clientes */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Nenhum cliente encontrado</p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna 1: Informações Básicas */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="flex-shrink-0" />
                      <a href={`mailto:${client.email}`} className="hover:text-[#005563]">
                        {client.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="flex-shrink-0" />
                      <a href={`tel:${client.phone.replace(/\D/g, '')}`} className="hover:text-[#005563]">
                        {client.phone}
                      </a>
                    </div>

                    {client.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} className="flex-shrink-0" />
                        <span>{client.company}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span>{client.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="flex-shrink-0" />
                      <span>
                        {new Date(client.registeredAt).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(client.registeredAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Interesses */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Package size={16} />
                    Produtos de Interesse
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {client.interests?.map((interest, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#005563] text-white"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coluna 3: Mensagem */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Mensagem</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {client.message || 'Sem mensagem adicional'}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                <a
                  href={`mailto:${client.email}`}
                  className="flex-1 px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors text-center text-sm font-medium"
                >
                  Enviar Email
                </a>
                <a
                  href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
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

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-1">Total de Cadastros</div>
          <div className="text-2xl font-bold text-blue-700">{clients.length}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm font-medium text-green-900 mb-1">Novos (últimos 7 dias)</div>
          <div className="text-2xl font-bold text-green-700">
            {clients.filter(c => {
              const diff = Date.now() - new Date(c.registeredAt).getTime();
              return diff < 7 * 24 * 60 * 60 * 1000;
            }).length}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm font-medium text-purple-900 mb-1">Com Empresa</div>
          <div className="text-2xl font-bold text-purple-700">
            {clients.filter(c => c.company).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsSection;
