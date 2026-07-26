import React, { useState, useEffect } from 'react';
import { UserCheck, Award, Scissors, DollarSign, Star, TrendingUp, Percent, Plus, Edit2, Trash2, X, Phone, User, Users, ShieldCheck } from 'lucide-react';
import { Barber, Appointment, TenantType } from '../../types';

interface EquipeViewProps {
  barbers: Barber[];
  appointments: Appointment[];
  tenantType?: TenantType;
  onAddBarber?: (newBarber: Omit<Barber, 'id'>) => void;
  onUpdateBarber?: (updatedBarber: Barber) => void;
  onDeleteBarber?: (barberId: string) => void;
  onUpdateCommission: (barberId: string, newRate: number) => void;
}

export const EquipeView: React.FC<EquipeViewProps> = ({
  barbers,
  appointments,
  tenantType,
  onAddBarber,
  onUpdateBarber,
  onDeleteBarber,
  onUpdateCommission,
}) => {
  const isSoloMode = tenantType === 'solo' || barbers.length === 1;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  // Form state
  const [formName, setFormName] = useState<string>('');
  const [formRole, setFormRole] = useState<string>('Barbeiro Master');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formAvatar, setFormAvatar] = useState<string>('');
  const [formCommission, setFormCommission] = useState<number>(0.50);

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
    setEditingBarber(null);
    setFormName('');
    setFormRole('Barbeiro Master');
    setFormPhone('(62) 99999-0000');
    setFormAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
    setFormCommission(0.50);
    setIsModalOpen(true);
  };

  const openEditModal = (barber: Barber) => {
    setEditingBarber(barber);
    setFormName(barber.name);
    setFormRole(barber.role);
    setFormPhone(barber.phone);
    setFormAvatar(barber.avatar);
    setFormCommission(barber.commissionRate);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingBarber && onUpdateBarber) {
      onUpdateBarber({
        ...editingBarber,
        name: formName.trim(),
        role: formRole.trim(),
        phone: formPhone.trim(),
        avatar: formAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        commissionRate: formCommission,
      });
    } else if (onAddBarber) {
      onAddBarber({
        name: formName.trim(),
        role: formRole.trim(),
        phone: formPhone.trim(),
        avatar: formAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        commissionRate: formCommission,
        active: true,
        rating: 5.0,
        totalCutsMonth: 0,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${
              isSoloMode 
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {isSoloMode ? 'Modo Autônomo / Barbeiro Solo' : 'Modo Equipe / Barbearia'}
            </span>
          </div>

          <h1 className="text-xl font-black uppercase text-white">
            {isSoloMode ? 'Perfil Profissional & Atendimento Solo' : 'Gestão de Equipe & Comissões'}
          </h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1">
            {isSoloMode
              ? 'Personalize suas informações de profissional autônomo, especialidade, WhatsApp e metas. Adicione parceiros se decidir expandir sua equipe.'
              : 'Cadastre barbeiros, acompanhe faturamento gerado por profissional, taxa de comissão e atendimentos concluídos.'}
          </p>
        </div>

        {onAddBarber && (
          <button
            onClick={openAddModal}
            className="btn-gold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 font-black cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isSoloMode ? 'Adicionar Barbeiro à Equipe' : 'Cadastrar Novo Barbeiro'}</span>
          </button>
        )}
      </div>

      {/* Barber Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {barbers.map((barber) => {
          const barberApts = appointments.filter((a) => a.barberId === barber.id && a.status === 'completed');
          const totalRevenue = barberApts.reduce((s, a) => s + a.price, 0);
          const commissionEarned = totalRevenue * barber.commissionRate;

          return (
            <div key={barber.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-3.5">
                  <img src={barber.avatar} alt={barber.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-base text-white uppercase">{barber.name}</h2>
                      <span className="text-[10px] font-black bg-[#D4AF37] text-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> {barber.rating}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 font-bold uppercase mt-0.5">{barber.role} • {barber.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(barber)}
                    className="p-2 hover:bg-[#2A2A2A] text-zinc-400 hover:text-white rounded-xl transition-all"
                    title="Editar barbeiro"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {onDeleteBarber && barbers.length > 1 && (
                    <button
                      onClick={() => onDeleteBarber(barber.id)}
                      className="p-2 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-xl transition-all"
                      title="Excluir barbeiro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
                  <div className="label-bold">Atendimentos</div>
                  <div className="text-base font-black text-white mt-0.5">{barberApts.length} hoje</div>
                </div>

                <div className="p-3 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
                  <div className="label-bold">Faturamento</div>
                  <div className="text-base font-black font-mono text-[#D4AF37] mt-0.5">R$ {totalRevenue.toFixed(2)}</div>
                </div>

                <div className="p-3 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
                  <div className="label-bold">Comissão ({Math.round(barber.commissionRate * 100)}%)</div>
                  <div className="text-base font-black font-mono text-white mt-0.5">R$ {commissionEarned.toFixed(2)}</div>
                </div>
              </div>

              {/* Commission Adjuster */}
              <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 font-bold uppercase">
                <span>Ajustar % de Comissão:</span>
                <select
                  value={barber.commissionRate}
                  onChange={(e) => onUpdateCommission(barber.id, parseFloat(e.target.value))}
                  className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-2 py-1 text-xs text-[#D4AF37] font-black uppercase cursor-pointer focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value={0.40}>40%</option>
                  <option value={0.50}>50% (Padrão)</option>
                  <option value={0.55}>55%</option>
                  <option value={0.60}>60%</option>
                  <option value={0.70}>70%</option>
                </select>
              </div>

            </div>
          );
        })}
      </div>

      {/* Barber Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 text-white">
            
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-black text-base uppercase text-white">
                  {editingBarber ? 'Editar Barbeiro' : 'Novo Barbeiro'}
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
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Mateus Costa"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Especialidade / Cargo
                  </label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Ex: Especialista Fade"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(62) 99999-0000"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Taxa de Comissão
                </label>
                <select
                  value={formCommission}
                  onChange={(e) => setFormCommission(parseFloat(e.target.value))}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-[#D4AF37] font-black focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value={0.40}>40%</option>
                  <option value={0.50}>50% (Padrão)</option>
                  <option value={0.55}>55%</option>
                  <option value={0.60}>60%</option>
                  <option value={0.70}>70%</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  URL da Foto do Perfil
                </label>
                <input
                  type="text"
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
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
                  {editingBarber ? 'Salvar Alterações' : 'Cadastrar Barbeiro'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
