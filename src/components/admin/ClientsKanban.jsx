import React, { useState, useEffect } from 'react';
import {
  User,
  Plus,
  X,
  FloppyDisk,
  Trash,
  PencilSimple,
  EnvelopeSimple,
  Phone,
  MapPin,
  Buildings,
  Calendar,
  ChartBar,
  FunnelSimple
} from 'phosphor-react';
import { 
  loadClients, 
  saveClients, 
  addClient, 
  updateClient, 
  deleteClient,
  useClientsSync,
  getClientsStats
} from '../../data/clientsUtils';

const ClientsKanban = () => {
  const [clients, setClients] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    stage: 'lead', // lead, prospect, client, inactive
    inactive: false
  });

  useEffect(() => {
    const loadedClients = loadClients();
    setClients(loadedClients);
  }, []);

  useClientsSync((updatedClients) => {
    setClients(updatedClients);
  });

  const stats = getClientsStats();

  const stages = [
    { id: 'lead', name: 'Leads', color: '#94A3B8', icon: User },
    { id: 'prospect', name: 'Prospects', color: '#3B82F6', icon: FunnelSimple },
    { id: 'client', name: 'Clientes', color: '#10B981', icon: Buildings },
    { id: 'inactive', name: 'Inativos', color: '#EF4444', icon: X }
  ];

  const handleNewClient = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      notes: '',
      stage: 'lead',
      inactive: false
    });
    setEditingClient(null);
    setIsEditing(true);
  };

  const handleEditClient = (client) => {
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || '',
      notes: client.notes || '',
      stage: client.stage || 'lead',
      inactive: client.inactive || false
    });
    setEditingClient(client);
    setIsEditing(true);
  };

  const handleSaveClient = () => {
    if (!formData.name || !formData.email) {
      alert('Por favor, preencha pelo menos o Nome e Email');
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, formData);
      alert('Cliente atualizado com sucesso!');
    } else {
      addClient(formData);
      alert('Cliente criado com sucesso!');
    }

    setIsEditing(false);
    const updatedClients = loadClients();
    setClients(updatedClients);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      deleteClient(clientId);
      const updatedClients = loadClients();
      setClients(updatedClients);
      alert('Cliente deletado com sucesso!');
    }
  };

  const handleMoveStage = (clientId, newStage) => {
    updateClient(clientId, { stage: newStage, inactive: newStage === 'inactive' });
    const updatedClients = loadClients();
    setClients(updatedClients);
  };

  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      client.name?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.company?.toLowerCase().includes(term) ||
      client.phone?.toLowerCase().includes(term)
    );
  });

  const getClientsByStage = (stage) => {
    return filteredClients.filter(c => c.stage === stage);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Nome e Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="joao@empresa.com"
              />
            </div>
          </div>

          {/* Telefone e Empresa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="(11) 98765-4321"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="Empresa Ltda"
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              placeholder="Rua Exemplo, 123"
            />
          </div>

          {/* Cidade, Estado e CEP */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="São Paulo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="SP"
                maxLength="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEP
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="01234-567"
              />
            </div>
          </div>

          {/* Estágio e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estágio
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="client">Cliente</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inactive}
                  onChange={(e) => setFormData({ ...formData, inactive: e.target.checked })}
                  className="w-4 h-4 text-[#005563] focus:ring-[#005563] border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Marcar como inativo</span>
              </label>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              placeholder="Notas sobre o cliente..."
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleSaveClient}
              className="flex-1 px-6 py-3 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <FloppyDisk size={20} weight="bold" />
              Salvar Cliente
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User size={28} weight="bold" className="text-[#005563]" />
              Gerenciar Clientes
            </h2>
            <p className="text-gray-600 mt-1">
              Gerencie seus leads, prospects e clientes
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <ChartBar size={20} weight="bold" />
              {viewMode === 'kanban' ? 'Lista' : 'Kanban'}
            </button>
            <button
              type="button"
              onClick={handleNewClient}
              className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center gap-2"
            >
              <Plus size={20} weight="bold" />
              Novo Cliente
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-blue-600 text-2xl font-bold">{stats.total}</div>
            <div className="text-blue-700 text-sm font-medium">Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-green-600 text-2xl font-bold">{stats.active}</div>
            <div className="text-green-700 text-sm font-medium">Ativos</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-red-600 text-2xl font-bold">{stats.inactive}</div>
            <div className="text-red-700 text-sm font-medium">Inativos</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-purple-600 text-2xl font-bold">{stats.today}</div>
            <div className="text-purple-700 text-sm font-medium">Hoje</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-yellow-600 text-2xl font-bold">{stats.thisWeek}</div>
            <div className="text-yellow-700 text-sm font-medium">Esta Semana</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="text-orange-600 text-2xl font-bold">{stats.thisMonth}</div>
            <div className="text-orange-700 text-sm font-medium">Este Mês</div>
          </div>
        </div>

        {/* Busca */}
        <div className="mt-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, email, empresa ou telefone..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
          />
        </div>
      </div>

      {/* Visualização Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-4 gap-4">
          {stages.map((stage) => {
            const stageClients = getClientsByStage(stage.id);
            const StageIcon = stage.icon;
            
            return (
              <div key={stage.id} className="bg-gray-50 rounded-xl p-4">
                <div 
                  className="flex items-center gap-2 mb-4 p-3 rounded-lg text-white font-bold"
                  style={{ backgroundColor: stage.color }}
                >
                  <StageIcon size={20} weight="bold" />
                  <span>{stage.name}</span>
                  <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">
                    {stageClients.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {stageClients.map((client) => (
                    <div
                      key={client.id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-sm mb-1">
                            {client.name}
                          </h3>
                          {client.company && (
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <Buildings size={12} weight="bold" />
                              {client.company}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-gray-600 mb-3">
                        {client.email && (
                          <div className="flex items-center gap-1">
                            <EnvelopeSimple size={12} weight="bold" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-1">
                            <Phone size={12} weight="bold" />
                            {client.phone}
                          </div>
                        )}
                        {(client.city || client.state) && (
                          <div className="flex items-center gap-1">
                            <MapPin size={12} weight="bold" />
                            {client.city}{client.city && client.state && ', '}{client.state}
                          </div>
                        )}
                      </div>

                      {/* Mover para outro estágio */}
                      <select
                        value={client.stage}
                        onChange={(e) => handleMoveStage(client.id, e.target.value)}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2 focus:ring-1 focus:ring-[#005563]"
                      >
                        {stages.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClient(client)}
                          className="flex-1 px-2 py-1 bg-[#005563] text-white text-xs rounded hover:bg-[#004450] transition-colors flex items-center justify-center gap-1"
                        >
                          <PencilSimple size={14} weight="bold" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClient(client.id)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageClients.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Nenhum cliente neste estágio
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Visualização em Lista */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estágio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => {
                  const stage = stages.find(s => s.id === client.stage);
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{client.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{client.company || '-'}</td>
                      <td className="px-6 py-4">
                        <span 
                          className="px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ backgroundColor: stage?.color }}
                        >
                          {stage?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleEditClient(client)}
                          className="text-[#005563] hover:text-[#004450] mr-3"
                        >
                          <PencilSimple size={18} weight="bold" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash size={18} weight="bold" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">Nenhum cliente encontrado</p>
              <p className="text-gray-400 mb-4">Comece adicionando seu primeiro cliente</p>
              <button
                type="button"
                onClick={handleNewClient}
                className="px-6 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} weight="bold" />
                Criar Primeiro Cliente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsKanban;
