import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  MessageCircle, 
  Calendar, 
  DollarSign, 
  Scissors, 
  AlertTriangle,
  Award,
  Sparkles,
  Phone
} from 'lucide-react';
import { ClientProfile } from '../../types';

interface CRMViewProps {
  clients: ClientProfile[];
  onTriggerWhatsappAI: (client: ClientProfile) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({ clients, onTriggerWhatsappAI }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('all');

  const filteredClients = clients.filter((client) => {
    const matchSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        client.phone.includes(searchTerm);
    const matchTag = filterTag === 'all' || client.tags.includes(filterTag as any);
    return matchSearch && matchTag;
  });

  const atRiskClients = clients.filter((c) => c.daysSinceLastVisit >= 25);
  const vipClients = clients.filter((c) => c.tags.includes('VIP'));

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <div className="label-bold">Total de Clientes</div>
            <div className="text-3xl font-black text-white mt-1">{clients.length}</div>
            <div className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Base cadastrada ativa</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-[#D4AF37] border border-[#2A2A2A] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] border-l-4 border-l-rose-500 border-t border-t-[#2A2A2A] border-r border-r-[#2A2A2A] border-b border-b-[#2A2A2A] rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <div className="label-bold text-rose-400">Clientes Sumindo (+25 dias)</div>
            <div className="text-3xl font-black text-rose-400 mt-1">{atRiskClients.length}</div>
            <div className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Oportunidade de reconquista</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-rose-400 border border-[#2A2A2A] flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1A1A1A] border-l-4 border-l-[#D4AF37] border-t border-t-[#2A2A2A] border-r border-r-[#2A2A2A] border-b border-b-[#2A2A2A] rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <div className="label-bold text-[#D4AF37]">Clientes VIP (Alto Faturamento)</div>
            <div className="text-3xl font-black text-[#D4AF37] mt-1">{vipClients.length}</div>
            <div className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Ticket médio superior</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-[#D4AF37] border border-[#2A2A2A] flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou telefone do cliente..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-semibold"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'TODOS' },
            { id: 'Em Risco', label: '⚠️ SUMINDO (+25D)' },
            { id: 'VIP', label: '⭐ CLIENTES VIP' },
            { id: 'Frequente', label: '🔁 FREQUENTES' },
            { id: 'Novo', label: '✨ NOVOS' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setFilterTag(tag.id)}
              className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                filterTag === tag.id
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#2A2A2A] text-zinc-300 hover:bg-[#333333]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const isAtRisk = client.daysSinceLastVisit >= 25;

          return (
            <div
              key={client.id}
              className={`bg-[#1A1A1A] border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all hover:border-zinc-600 ${
                isAtRisk ? 'border-rose-500/50 bg-[#1A1A1A]' : 'border-[#2A2A2A]'
              }`}
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {client.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          tag === 'VIP'
                            ? 'bg-[#D4AF37] text-black'
                            : tag === 'Em Risco' || tag === 'Sumiu'
                            ? 'bg-rose-500 text-black'
                            : 'bg-[#2A2A2A] text-[#D4AF37] border border-[#2A2A2A]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-[11px] font-mono font-bold text-zinc-400">
                    {client.totalVisits} visitas
                  </span>
                </div>

                {/* Name & Phone */}
                <h3 className="font-black text-lg text-white uppercase">{client.name}</h3>
                <div className="text-xs text-zinc-400 font-bold flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-[#D4AF37]" />
                  <span>{client.phone}</span>
                </div>

                {/* Key Metrics */}
                <div className="mt-4 p-3 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="label-bold">Última Visita:</span>
                    <span className={`font-bold ${isAtRisk ? 'text-rose-400 font-black' : 'text-zinc-200'}`}>
                      {client.daysSinceLastVisit === 0 ? 'Hoje' : `Há ${client.daysSinceLastVisit} dias`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="label-bold">Barbeiro Favorito:</span>
                    <span className="text-[#D4AF37] font-bold">{client.favoriteBarberName || 'João'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="label-bold">Total Gasto:</span>
                    <span className="font-mono font-black text-white">R$ {client.totalSpent.toFixed(2)}</span>
                  </div>
                </div>

                {client.notes && (
                  <p className="mt-2 text-[11px] text-[#D4AF37]/90 font-semibold italic">
                    "{client.notes}"
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-[#2A2A2A]">
                <button
                  onClick={() => onTriggerWhatsappAI(client)}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAtRisk
                      ? 'bg-rose-500 hover:bg-rose-400 text-black shadow-lg shadow-rose-500/20'
                      : 'btn-gold shadow-lg shadow-[#D4AF37]/20'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{isAtRisk ? 'Reconquistar no WhatsApp (IA)' : 'Lembrete WhatsApp'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
