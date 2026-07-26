import React, { useState } from 'react';
import { Zap, Clock, Scissors, Plus, CheckCircle2, AlertCircle, ArrowRight, DollarSign, Sparkles, User, Users, Check, Send, AlertTriangle } from 'lucide-react';
import { ServiceItem, Barber, Appointment } from '../../types';

interface EncaixeInteligenteViewProps {
  services: ServiceItem[];
  barbers: Barber[];
  onConfirmFit: (fitData: {
    clientName: string;
    clientPhone: string;
    serviceId: string;
    barberId: string;
    time: string;
  }) => void;
}

interface WalkInClient {
  id: string;
  name: string;
  phone: string;
  arrivalTime: string;
  preferredService: string;
}

export const EncaixeInteligenteView: React.FC<EncaixeInteligenteViewProps> = ({
  services,
  barbers,
  onConfirmFit,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    services.find((s) => s.durationMin <= 25) || services[0]
  );
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [selectedBarberId, setSelectedBarberId] = useState<string>(barbers[0]?.id || '');
  const [fitTime, setFitTime] = useState<string>('14:25');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Walk-in Waiting List (Clientes no sofá - Chegaram sem agendar)
  const [walkIns, setWalkIns] = useState<WalkInClient[]>([
    { id: 'w-1', name: 'Marcos Vinicius', phone: '(62) 99823-1122', arrivalTime: '14:10', preferredService: 'Corte Degradê' },
    { id: 'w-2', name: 'Lucas Gabriel', phone: '(62) 98112-4455', arrivalTime: '14:15', preferredService: 'Barba alinhada' },
  ]);

  const [newWalkInName, setNewWalkInName] = useState<string>('');
  const [newWalkInPhone, setNewWalkInPhone] = useState<string>('');
  const [showAddWalkIn, setShowAddWalkIn] = useState<boolean>(false);

  // Quick fitting services (<= 30 min)
  const quickServices = services.filter((s) => s.durationMin <= 30);

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalkInName.trim()) return;

    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setWalkIns([
      ...walkIns,
      {
        id: `w-${Date.now()}`,
        name: newWalkInName.trim(),
        phone: newWalkInPhone.trim() || '(62) 99999-0000',
        arrivalTime: timeNow,
        preferredService: selectedService?.name || 'Corte Padrão',
      },
    ]);

    setNewWalkInName('');
    setNewWalkInPhone('');
    setShowAddWalkIn(false);
  };

  const handleFitFromWaitlist = (walkIn: WalkInClient) => {
    setClientName(walkIn.name);
    setClientPhone(walkIn.phone);
    
    // Auto confirm fit for this walk-in
    onConfirmFit({
      clientName: walkIn.name,
      clientPhone: walkIn.phone,
      serviceId: selectedService?.id || services[0].id,
      barberId: selectedBarberId || barbers[0]?.id,
      time: fitTime,
    });

    // Remove from waitlist
    setWalkIns(walkIns.filter((w) => w.id !== walkIn.id));

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setClientName('');
      setClientPhone('');
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !clientName.trim()) return;

    onConfirmFit({
      clientName,
      clientPhone: clientPhone || '(62) 99999-0000',
      serviceId: selectedService.id,
      barberId: selectedBarberId || barbers[0]?.id,
      time: fitTime,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setClientName('');
      setClientPhone('');
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-black flex items-center justify-center font-black shadow-lg shadow-[#D4AF37]/20">
            <Zap className="w-6 h-6 fill-current stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase text-white flex items-center gap-2">
              Motor de Encaixes & Atrasos
              <span className="text-[10px] font-black uppercase bg-[#D4AF37] text-black px-2 py-0.5 rounded-md">
                Zero Tempo Morto
              </span>
            </h1>
            <p className="text-xs text-zinc-400 font-semibold mt-1">
              Detecta atrasos em tempo real e permite encaixar na hora clientes que chegaram sem agendar.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddWalkIn(true)}
          className="btn-gold px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer self-start md:self-auto"
        >
          <User className="w-4 h-4" />
          <span>+ Cliente Chegou Sem Agendar</span>
        </button>
      </div>

      {/* ⚡ Dynamic Delay & Window Detection Scenario (Live Real-Time Situation) */}
      <div className="bg-gradient-to-r from-amber-950/40 via-[#1E1B10] to-[#141418] border-2 border-[#D4AF37]/50 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Janela Detectada Agora (Horário Atual: 14:20)
                </span>
              </div>
              <p className="text-sm text-white font-extrabold mt-0.5">
                Próximo agendado (14:30 - João Silva) ainda não chegou. Tolerância de atraso aberta.
              </p>
            </div>
          </div>

          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider font-mono">
            ⚡ 25 MIN LIVRES (14:25 - 14:50)
          </span>
        </div>

        <div className="bg-[#0A0A0C] border border-[#2A2A35] rounded-2xl p-3.5 text-xs text-zinc-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-[#D4AF37]" />
            <span>
              O barbeiro está finalizando o atendimento atual. É o momento perfeito para <strong>encaixar um serviço rápido de até 25 min</strong>!
            </span>
          </div>

          <div className="text-[#D4AF37] font-mono font-black text-xs whitespace-nowrap bg-[#18181E] px-3 py-1 rounded-lg border border-[#333340]">
            Projeção: + R$ 45,00
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Walk-in Waiting List (Clientes no Sofá) */}
        <div className="lg:col-span-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-sm font-black uppercase text-white">Clientes Aguardando (Sofá)</h2>
            </div>
            <span className="bg-[#2A2A2A] text-zinc-300 text-xs font-black font-mono px-2.5 py-0.5 rounded-full">
              {walkIns.length}
            </span>
          </div>

          {showAddWalkIn && (
            <form onSubmit={handleAddWalkIn} className="p-4 bg-[#0A0A0C] border border-[#D4AF37]/40 rounded-2xl space-y-3">
              <div className="text-xs font-black text-[#D4AF37] uppercase">Cadastrar Cliente Presencial</div>
              <input
                type="text"
                required
                value={newWalkInName}
                onChange={(e) => setNewWalkInName(e.target.value)}
                placeholder="Nome do Cliente"
                className="w-full bg-[#141418] border border-[#2A2A35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                type="text"
                value={newWalkInPhone}
                onChange={(e) => setNewWalkInPhone(e.target.value)}
                placeholder="Telefone / WhatsApp (Opcional)"
                className="w-full bg-[#141418] border border-[#2A2A35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWalkIn(false)}
                  className="flex-1 py-1.5 bg-[#22222A] text-zinc-300 text-xs font-bold rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#D4AF37] text-slate-950 text-xs font-black rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          )}

          {walkIns.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500 bg-[#0A0A0C] border border-dashed border-[#2A2A2A] rounded-2xl">
              Nenhum cliente na fila presencial.
            </div>
          ) : (
            <div className="space-y-3">
              {walkIns.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 bg-[#0A0A0C] border border-[#2A2A35] hover:border-[#D4AF37]/50 rounded-2xl flex items-center justify-between gap-3 transition-all"
                >
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      {w.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2 font-mono">
                      <span>Chegou às: <strong className="text-amber-400">{w.arrivalTime}</strong></span>
                      <span>•</span>
                      <span>{w.preferredService}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFitFromWaitlist(w)}
                    className="btn-gold text-[10px] px-3 py-2 rounded-xl flex items-center gap-1 font-black shadow-md cursor-pointer whitespace-nowrap"
                    title="Encaixar este cliente na janela livre agora"
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    <span>ENCAIXAR AGORA</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Form & Service Picker */}
        <div className="lg:col-span-7 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 shadow-2xl space-y-6">
          
          <div>
            <label className="label-bold mb-3 block">
              1. Selecione o Serviço Rápido para a Janela (25 min):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickServices.map((srv) => {
                const isSelected = selectedService?.id === srv.id;

                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#222228] border-[#D4AF37] text-white shadow-xl'
                        : 'bg-[#0A0A0C] border-[#2A2A35] text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs text-white uppercase">{srv.name}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-1">
                        <span className="font-bold">{srv.durationMin} min</span>
                        <span>•</span>
                        <span className="text-[#D4AF37] font-mono font-black">R$ {srv.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-[#2A2A35] text-zinc-300'
                      }`}
                    >
                      {isSelected ? 'OK' : 'USAR'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Details */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-[#2A2A2A]">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Client Name Input */}
              <div>
                <label className="label-bold mb-1 block">
                  Nome do Cliente (Novo ou Passante) *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Carlos Andrade"
                  className="w-full bg-[#0A0A0C] border border-[#2A2A35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-semibold"
                />
              </div>

              {/* Client Phone Input */}
              <div>
                <label className="label-bold mb-1 block">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(62) 99999-9999"
                  className="w-full bg-[#0A0A0C] border border-[#2A2A35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-semibold"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Barber Select */}
              <div>
                <label className="label-bold mb-1 block">
                  Barbeiro Responsável
                </label>
                <select
                  value={selectedBarberId}
                  onChange={(e) => setSelectedBarberId(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-[#2A2A35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-bold uppercase"
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Slot */}
              <div>
                <label className="label-bold mb-1 block">
                  Horário do Encaixe
                </label>
                <input
                  type="text"
                  value={fitTime}
                  onChange={(e) => setFitTime(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-[#2A2A35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono font-bold"
                />
              </div>

            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              className="btn-gold w-full py-3.5 rounded-xl shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer mt-2 text-xs font-black uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>CONFIRMAR ENCAIXE DIRETO NO HORÁRIO ({fitTime})</span>
            </button>

            {isSuccess && (
              <div className="p-3 bg-emerald-500 text-slate-950 text-xs font-black uppercase rounded-xl text-center flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                Encaixe confirmado na agenda e faturamento atualizado!
              </div>
            )}

          </form>

        </div>

      </div>

    </div>
  );
};

