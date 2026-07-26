import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Clock, 
  DollarSign, 
  Phone, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  Coffee, 
  ShieldAlert, 
  MessageSquare,
  Sparkles,
  Save,
  Info
} from 'lucide-react';
import { ShopConfig, Appointment } from '../../types';

interface ConfigHorariosViewProps {
  config: ShopConfig;
  appointments: Appointment[];
  onSaveConfig: (updatedConfig: ShopConfig) => void;
  onOpenPublicBooking: () => void;
}

export const ConfigHorariosView: React.FC<ConfigHorariosViewProps> = ({
  config,
  appointments,
  onSaveConfig,
  onOpenPublicBooking,
}) => {
  const [localConfig, setLocalConfig] = useState<ShopConfig>(config);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Conflict Modal State
  const [conflictAppointments, setConflictAppointments] = useState<Appointment[]>([]);
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showConflictModal) {
        setShowConflictModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConflictModal]);

  const handleCopyLink = () => {
    const link = `https://barberos.app/agendar/${localConfig.slug || 'barbearia'}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleScheduleDayChange = (
    index: number,
    field: 'isOpen' | 'openTime' | 'closeTime' | 'breakStart' | 'breakEnd',
    value: any
  ) => {
    const updatedWeekly = [...localConfig.weeklySchedule];
    updatedWeekly[index] = {
      ...updatedWeekly[index],
      [field]: value,
    };
    setLocalConfig({
      ...localConfig,
      weeklySchedule: updatedWeekly,
    });
  };

  // Helper function to check if appointment conflicts with new weekly schedule
  const checkConflicts = (newConfig: ShopConfig): Appointment[] => {
    const conflicts: Appointment[] = [];

    // Filter appointments that are scheduled or in progress
    const activeApts = appointments.filter((a) => a.status === 'scheduled' || a.status === 'in_progress');

    activeApts.forEach((apt) => {
      // Parse appointment date to day of week (0=Sun, 1=Mon, ..., 6=Sat)
      const aptDateObj = new Date(`${apt.date}T00:00:00`);
      const dayOfWeek = aptDateObj.getDay();

      const daySched = newConfig.weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);
      if (!daySched) return;

      // Conflict Case 1: Day is marked closed but has appointments
      if (!daySched.isOpen) {
        conflicts.push(apt);
        return;
      }

      // Conflict Case 2: Appointment time falls before openTime or after closeTime
      if (apt.time < daySched.openTime || apt.time >= daySched.closeTime) {
        conflicts.push(apt);
        return;
      }

      // Conflict Case 3: Appointment time falls inside lunch break
      if (daySched.breakStart && daySched.breakEnd) {
        if (apt.time >= daySched.breakStart && apt.time < daySched.breakEnd) {
          conflicts.push(apt);
          return;
        }
      }
    });

    return conflicts;
  };

  const handleSave = () => {
    // Perform conflict check
    const conflicts = checkConflicts(localConfig);

    if (conflicts.length > 0) {
      setConflictAppointments(conflicts);
      setShowConflictModal(true);
      return;
    }

    // Save configuration
    onSaveConfig(localConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const currentBookingUrl = `https://barberos.app/agendar/${localConfig.slug || 'barbearia'}`;

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Clock className="w-5 h-5 stroke-[2.5]" />
            <span className="text-xs font-extrabold uppercase tracking-widest">Regras Operacionais</span>
          </div>
          <h1 className="text-xl font-black uppercase text-white mt-1">Configurações de Horários & Perfil</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1 max-w-2xl">
            Ajuste expediente semanal, intervalos de almoço, buffer de higienização e link exclusivo para agendamento dos seus clientes.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-gold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 font-black cursor-pointer whitespace-nowrap"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>Salvar Regras Operacionais</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5" />
          <span>Configurações e horários operacionais salvos com sucesso!</span>
        </div>
      )}

      {/* A) Perfil e Meta da Barbearia */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center gap-2 text-white border-b border-[#2A2A2A] pb-3">
          <Settings className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="font-black text-sm uppercase">A) Perfil, Contato & Meta Diária</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase text-zinc-400 mb-1">
              Nome da Barbearia
            </label>
            <input
              type="text"
              value={localConfig.shopName}
              onChange={(e) => setLocalConfig({ ...localConfig, shopName: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-zinc-400 mb-1">
              Barbeiro Principal / Responsável
            </label>
            <input
              type="text"
              value={localConfig.ownerName || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, ownerName: e.target.value })}
              placeholder="Ex: Neguinho da Barba"
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-zinc-400 mb-1">
              WhatsApp da Barbearia
            </label>
            <input
              type="text"
              value={localConfig.shopPhone || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, shopPhone: e.target.value })}
              placeholder="(62) 99999-0001"
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-zinc-400 mb-1">
              Meta Diária de Faturamento (R$)
            </label>
            <input
              type="number"
              value={localConfig.dailyRevenueTarget}
              onChange={(e) => setLocalConfig({ ...localConfig, dailyRevenueTarget: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-[#D4AF37] font-mono font-black focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Exclusive Booking Link Box */}
        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-zinc-300 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
              <span>Link Exclusivo de Agendamento do Cliente</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase">/agendar/[slug]</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-[#D4AF37] font-mono font-bold truncate flex items-center justify-between">
              <span>{currentBookingUrl}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none bg-[#2A2A2A] hover:bg-[#333] text-white text-xs px-4 py-2.5 rounded-xl font-bold uppercase flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenPublicBooking}
                className="flex-1 sm:flex-none btn-gold text-xs px-4 py-2.5 rounded-xl font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Testar Visão do Cliente</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* B) Expediente Semanal de Atendimento */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2A] pb-3 gap-2">
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-black text-sm uppercase">B) Expediente Semanal & Intervalos de Pausa</h2>
          </div>

          {/* Buffer Time Selector */}
          <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3 py-1.5 text-xs">
            <span className="text-zinc-400 font-bold uppercase text-[10px]">Buffer entre cortes:</span>
            <select
              value={localConfig.bufferMinutes || 5}
              onChange={(e) => setLocalConfig({ ...localConfig, bufferMinutes: parseInt(e.target.value, 10) })}
              className="bg-transparent text-[#D4AF37] font-black uppercase focus:outline-none cursor-pointer"
            >
              <option value={0}>0 min (Sem folga)</option>
              <option value={5}>5 min (Higienização)</option>
              <option value={10}>10 min (Padrão)</option>
              <option value={15}>15 min (Relaxado)</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-zinc-400">
          Defina os horários de funcionamento para cada dia da semana. Slots de almoço ficam automaticamente inacessíveis na agenda pública.
        </p>

        {/* Day-by-Day Schedule List */}
        <div className="space-y-3">
          {localConfig.weeklySchedule.map((daySched, idx) => (
            <div
              key={daySched.dayOfWeek}
              className={`p-4 rounded-2xl border transition-all ${
                daySched.isOpen
                  ? 'bg-[#0A0A0A] border-[#2A2A2A]'
                  : 'bg-[#121212] border-rose-950/30 opacity-70'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Day Toggle & Name */}
                <div className="flex items-center gap-3 w-44 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleScheduleDayChange(idx, 'isOpen', !daySched.isOpen)}
                    className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all ${
                      daySched.isOpen
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {daySched.isOpen ? 'Aberto' : 'Folga / Fechado'}
                  </button>

                  <span className="font-black text-sm uppercase text-white">
                    {daySched.dayName}
                  </span>
                </div>

                {/* Opening & Closing Controls */}
                {daySched.isOpen ? (
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    
                    {/* Operating Hours */}
                    <div className="flex items-center gap-2 bg-[#141414] border border-[#2A2A2A] rounded-xl p-2 px-3">
                      <span className="text-zinc-400 font-bold uppercase text-[10px]">Funcionamento:</span>
                      <input
                        type="time"
                        value={daySched.openTime}
                        onChange={(e) => handleScheduleDayChange(idx, 'openTime', e.target.value)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-2 py-1 text-white font-mono font-bold"
                      />
                      <span className="text-zinc-500">até</span>
                      <input
                        type="time"
                        value={daySched.closeTime}
                        onChange={(e) => handleScheduleDayChange(idx, 'closeTime', e.target.value)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-2 py-1 text-white font-mono font-bold"
                      />
                    </div>

                    {/* Lunch Break Hours */}
                    <div className="flex items-center gap-2 bg-[#141414] border border-[#2A2A2A] rounded-xl p-2 px-3">
                      <Coffee className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="text-zinc-400 font-bold uppercase text-[10px]">Pausa Almoço:</span>
                      <input
                        type="time"
                        value={daySched.breakStart || '12:00'}
                        onChange={(e) => handleScheduleDayChange(idx, 'breakStart', e.target.value)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-2 py-1 text-zinc-300 font-mono font-bold"
                      />
                      <span className="text-zinc-500">às</span>
                      <input
                        type="time"
                        value={daySched.breakEnd || '13:00'}
                        onChange={(e) => handleScheduleDayChange(idx, 'breakEnd', e.target.value)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-2 py-1 text-zinc-300 font-mono font-bold"
                      />
                    </div>

                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 font-bold uppercase italic">
                    Sem atendimentos programados neste dia da semana.
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* C) Conflict Protection Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-rose-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 text-white">
            
            <div className="flex items-start gap-3 border-b border-[#2A2A2A] pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-black text-base uppercase text-white">
                  Conflito de Horários Identificado!
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  A alteração de horário que você está tentando salvar afeta clientes que já possuem agendamentos confirmados nesses horários.
                </p>
              </div>
            </div>

            {/* List of Affected Clients */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <div className="text-xs font-black uppercase tracking-wider text-rose-400">
                {conflictAppointments.length} agendamento(s) afetado(s):
              </div>

              {conflictAppointments.map((apt) => (
                <div key={apt.id} className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-white">{apt.clientName}</div>
                      <div className="text-[11px] text-zinc-400">{apt.serviceName} com {apt.barberName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#D4AF37] font-mono">{apt.date}</div>
                      <div className="text-xs font-extrabold text-white">{apt.time}</div>
                    </div>
                  </div>

                  {/* WhatsApp Action Button */}
                  <a
                    href={`https://wa.me/55${apt.clientPhone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(apt.clientName)},%20aqui%20é%20da%20${encodeURIComponent(localConfig.shopName)}.%20Precisamos%20reagendar%20seu%20horário%20das%20${apt.time}%20do%20dia%20${apt.date}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all w-full"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Entrar em contato via WhatsApp ({apt.clientPhone})</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>O que fazer agora?</span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                Acesse a sua <strong>Agenda</strong> para remarcar ou cancelar esses clientes primeiro, ou entre em contato direto pelo WhatsApp acima antes de fechar este horário.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConflictModal(false)}
                className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Entendi, Vou Reorganizar a Agenda
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
