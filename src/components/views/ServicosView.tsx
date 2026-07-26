import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, Clock, DollarSign, Check, X, ArrowUpDown, Sparkles, Layers, HelpCircle } from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServicosViewProps {
  services: ServiceItem[];
  onAddService: (newService: Omit<ServiceItem, 'id'>) => void;
  onUpdateService: (service: ServiceItem) => void;
  onDeleteService: (serviceId: string) => void;
}

export const ServicosView: React.FC<ServicosViewProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('40.00');
  const [formDuration, setFormDuration] = useState<string>('30');
  const [formCategory, setFormCategory] = useState<ServiceItem['category']>('cabelo');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formOrder, setFormOrder] = useState<string>('1');
  const [formActive, setFormActive] = useState<boolean>(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const openAddModal = () => {
    setEditingService(null);
    setFormName('');
    setFormPrice('40.00');
    setFormDuration('30');
    setFormCategory('cabelo');
    setFormDescription('');
    setFormOrder((services.length + 1).toString());
    setFormActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormName(service.name);
    setFormPrice(service.price.toString());
    setFormDuration(service.durationMin.toString());
    setFormCategory(service.category);
    setFormDescription(service.description || '');
    setFormOrder((service.order || 1).toString());
    setFormActive(service.active);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedPrice = parseFloat(formPrice) || 0;
    const parsedDuration = parseInt(formDuration, 10) || 30;
    const parsedOrder = parseInt(formOrder, 10) || 1;

    if (editingService) {
      onUpdateService({
        ...editingService,
        name: formName.trim(),
        price: parsedPrice,
        durationMin: parsedDuration,
        category: formCategory,
        description: formDescription.trim(),
        order: parsedOrder,
        active: formActive,
      });
    } else {
      onAddService({
        name: formName.trim(),
        price: parsedPrice,
        durationMin: parsedDuration,
        category: formCategory,
        description: formDescription.trim(),
        order: parsedOrder,
        active: formActive,
      });
    }

    setIsModalOpen(false);
  };

  const filteredServices = services
    .filter((s) => {
      const matchesCat = filterCategory === 'all' || s.category === filterCategory;
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  return (
    <div className="space-[#141414] space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Tag className="w-5 h-5 stroke-[2.5]" />
            <span className="text-xs font-extrabold uppercase tracking-widest">Catálogo de Atendimento</span>
          </div>
          <h1 className="text-xl font-black uppercase text-white mt-1">Gestão de Serviços</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1 max-w-2xl">
            Cadastre e ajuste valores, tempos de corte e ordem de exibição. Mudanças recalculam a agenda pública em tempo real.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-gold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 font-black cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Novo Serviço</span>
        </button>
      </div>

      {/* Realtime Sync Alert */}
      <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-zinc-300">
        <Sparkles className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-white uppercase tracking-wider block mb-0.5">Integração em Tempo Real</span>
          <span>
            Ao alterar a duração de um serviço (ex: de 30 para 40 minutos), o agendamento do cliente no link público (<strong className="text-[#D4AF37]">/agendar/[slug]</strong>) recalcula na hora as lacunas e vagas disponíveis para evitar sobreposição de clientes.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A]">
        
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'cabelo', label: 'Cabelo' },
            { id: 'barba', label: 'Barba' },
            { id: 'combo', label: 'Combos' },
            { id: 'estetica', label: 'Estética' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-[#D4AF37] text-black font-black'
                  : 'bg-[#0A0A0A] text-zinc-400 border border-[#2A2A2A] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar serviço..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className={`bg-[#1A1A1A] border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all ${
              srv.active
                ? 'border-[#2A2A2A] hover:border-[#D4AF37]/50'
                : 'border-red-900/30 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#2A2A2A] text-[#D4AF37] border border-[#3A3A3A]">
                      #{srv.order || 1}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#0A0A0A] text-zinc-400 border border-[#2A2A2A]">
                      {srv.category}
                    </span>
                  </div>
                  <h3 className="font-black text-base text-white uppercase mt-1.5">{srv.name}</h3>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black font-mono text-[#D4AF37]">
                    R$ {srv.price.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-bold text-zinc-400 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{srv.durationMin} min</span>
                  </div>
                </div>
              </div>

              {srv.description && (
                <p className="text-xs text-zinc-400 font-medium line-clamp-2 mt-2">
                  {srv.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between">
              <button
                onClick={() => onUpdateService({ ...srv, active: !srv.active })}
                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border transition-all ${
                  srv.active
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                {srv.active ? '● Ativo na Tela do Cliente' : '○ Oculto na Tela do Cliente'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(srv)}
                  className="p-1.5 hover:bg-[#2A2A2A] text-zinc-400 hover:text-white rounded-lg transition-all"
                  title="Editar serviço"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteService(srv.id)}
                  className="p-1.5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-lg transition-all"
                  title="Excluir serviço"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 text-white">
            
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-black text-base uppercase text-white">
                  {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[#2A2A2A] rounded-xl text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Corte + Barba + Sobrancelha"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Duração (min) *
                  </label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="10">10 minutos</option>
                    <option value="15">15 minutos</option>
                    <option value="20">20 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="40">40 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="50">50 minutos</option>
                    <option value="60">60 minutos (1h)</option>
                    <option value="90">90 minutos (1h30)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ServiceItem['category'])}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="cabelo">Cabelo</option>
                    <option value="barba">Barba</option>
                    <option value="combo">Combo</option>
                    <option value="estetica">Estética</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-zinc-400">
                      Ordem de Exibição
                    </label>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    placeholder="1"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-zinc-500 font-semibold block mt-1">
                    Define a posição na lista do cliente (1º, 2º, 3º...)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Descrição Curta (opcional)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalhes para o cliente sobre este atendimento..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formActiveCheck"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0A0A0A] text-[#D4AF37] focus:ring-0"
                />
                <label htmlFor="formActiveCheck" className="text-xs font-bold text-zinc-300">
                  Ativo no agendamento do cliente
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-zinc-300 py-3 rounded-xl text-xs font-bold uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold text-xs py-3 rounded-xl font-black uppercase cursor-pointer"
                >
                  {editingService ? 'Salvar Alterações' : 'Cadastrar Serviço'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
