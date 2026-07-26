import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Scissors, 
  Plus, 
  CheckCircle2, 
  Play, 
  AlertCircle, 
  Phone, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Filter,
  DollarSign,
  MessageCircle
} from 'lucide-react';
import { Appointment, Barber, ServiceItem, AppointmentStatus } from '../../types';
import { MetaDiariaCard } from '../MetaDiariaCard';

interface AgendaViewProps {
  appointments: Appointment[];
  barbers: Barber[];
  services: ServiceItem[];
  selectedBarberId: string;
  setSelectedBarberId: (id: string) => void;
  onOpenNewAppointment: () => void;
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onOpenEncaixeModal: () => void;
  onSendWhatsappReminder: (appointment: Appointment) => void;
  todayRevenue?: number;
  dailyRevenueTarget?: number;
  onUpdateDailyTarget?: (newTarget: number) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  appointments,
  barbers,
  services,
  selectedBarberId,
  setSelectedBarberId,
  onOpenNewAppointment,
  onUpdateStatus,
  onOpenEncaixeModal,
  onSendWhatsappReminder,
  todayRevenue = 0,
  dailyRevenueTarget = 500,
  onUpdateDailyTarget,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Today stats for projection
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr && a.status !== 'cancelled');
  const scheduledCountToday = todayAppointments.filter((a) => a.status === 'scheduled' || a.status === 'in_progress').length;
  const projectedRevenueToday = todayAppointments.reduce((sum, a) => sum + a.price, 0);

  // Filter appointments for selected date and barber
  const filteredAppointments = appointments.filter((apt) => {
    const matchDate = apt.date === selectedDate;
    const matchBarber = selectedBarberId === 'all' || apt.barberId === selectedBarberId;
    return matchDate && matchBarber;
  });

  // Hours timeline from 08:00 to 19:00
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
    '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'completed':
        return <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 🟢 Concluído</span>;
      case 'in_progress':
        return <span className="bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse"><Play className="w-3 h-3 fill-current" /> 🟡 Em Cadeira</span>;
      case 'scheduled':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">🟢 Cliente</span>;
      case 'cancelled':
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">🔴 Cancelado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Meta Diária de Faturamento Component */}
      <MetaDiariaCard
        todayRevenue={todayRevenue}
        dailyRevenueTarget={dailyRevenueTarget}
        onUpdateDailyTarget={onUpdateDailyTarget}
        scheduledAppointmentsTodayCount={scheduledCountToday}
        projectedRevenueToday={projectedRevenueToday}
      />
      
      {/* Top Controls Bar (Date & Barber Filters) */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-1">
            <button 
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-1.5 hover:bg-[#2A2A2A] text-zinc-300 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 text-xs font-black text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
              <span className="uppercase tracking-wider">{selectedDate === new Date().toISOString().split('T')[0] ? 'Hoje,' : ''} {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
            </div>
            <button 
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-1.5 hover:bg-[#2A2A2A] text-zinc-300 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="text-xs font-black uppercase text-[#D4AF37] hover:underline px-2 tracking-wider"
          >
            Ir para Hoje
          </button>
        </div>

        {/* Barber Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedBarberId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedBarberId === 'all'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-[#2A2A2A] text-zinc-300 hover:bg-[#333333]'
            }`}
          >
            Todos Barbeiros
          </button>
          {barbers.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBarberId(b.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedBarberId === b.id
                  ? 'bg-[#D4AF37] text-black font-black'
                  : 'bg-[#2A2A2A] text-zinc-300 hover:bg-[#333333]'
              }`}
            >
              <img src={b.avatar} alt={b.name} className="w-4 h-4 rounded-full object-cover border border-black/30" />
              <span>{b.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEncaixeModal}
            className="bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Encaixe Rápido</span>
          </button>
        </div>

      </div>

      {/* Main Schedule Timeline Grid */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#141414] border-b border-[#2A2A2A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Grade de Horários <span className="text-[#D4AF37] ml-2">({filteredAppointments.length})</span>
            </h2>
          </div>
          <span className="label-bold text-[10px]">
            Clique no status para avançar
          </span>
        </div>

        <div className="divide-y divide-[#2A2A2A]">
          {timeSlots.map((slotTime) => {
            const slotApts = filteredAppointments.filter((a) => a.time === slotTime);

            return (
              <div key={slotTime} className="flex flex-col sm:flex-row items-start sm:items-center min-h-[64px] hover:bg-[#222222] transition-colors">
                
                {/* Time Label Column */}
                <div className="w-full sm:w-36 flex-shrink-0 p-3 bg-[#0A0A0A] text-zinc-400 text-xs font-mono font-black border-b sm:border-b-0 sm:border-r border-[#2A2A2A] flex items-center justify-between gap-2">
                  <span className="text-zinc-300 font-extrabold">{slotTime}</span>
                  {slotApts.length === 0 && (
                    <button
                      onClick={onOpenNewAppointment}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-black uppercase tracking-wider flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 transition-all cursor-pointer"
                      title="Livre - Agendar horário"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" /> Livre
                    </button>
                  )}
                </div>

                {/* Slot Content Area */}
                <div className="flex-1 p-2.5 w-full">
                  {slotApts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {slotApts.map((apt) => (
                        <div
                          key={apt.id}
                          className={`p-3.5 rounded-2xl border transition-all shadow-md ${
                            apt.status === 'in_progress'
                              ? 'bg-[#222228] border-l-4 border-l-[#D4AF37] border-t-[#33333F] border-r-[#33333F] border-b-[#33333F] shadow-xl'
                              : apt.status === 'completed'
                              ? 'bg-[#141418] border-[#26262E] opacity-80'
                              : 'bg-[#18181E] border-[#2A2A35] hover:border-[#444455]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-black text-sm text-white flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-zinc-400" />
                                {apt.clientName}
                              </div>
                              <div className="text-xs text-zinc-400 flex items-center gap-2 mt-1">
                                <span className="text-[#D4AF37] font-bold uppercase text-[11px] tracking-wider">{apt.serviceName}</span>
                                <span>•</span>
                                <span className="font-mono font-black text-white">R$ {apt.price.toFixed(2)}</span>
                                <span>•</span>
                                <span className="font-semibold text-zinc-400">{apt.durationMin} min</span>
                              </div>
                            </div>
                            {getStatusBadge(apt.status)}
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-[#26262E] flex items-center justify-between text-xs text-zinc-400">
                            <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-zinc-300 bg-[#22222A] px-2 py-0.5 rounded-lg border border-[#333340]">
                              <Scissors className="w-3 h-3 text-[#D4AF37]" />
                              {apt.barberName.split(' ')[0]}
                            </span>

                            <div className="flex items-center gap-2">
                              {/* WhatsApp Reminder Button */}
                              <button
                                onClick={() => onSendWhatsappReminder(apt)}
                                className="p-1.5 hover:bg-[#2A2A33] text-[#D4AF37] rounded-lg transition-colors border border-transparent hover:border-[#333340]"
                                title="Enviar lembrete via WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>

                              {/* Status Action Workflow Buttons */}
                              {apt.status === 'scheduled' && (
                                <button
                                  onClick={() => onUpdateStatus(apt.id, 'in_progress')}
                                  className="btn-gold text-[10px] px-3 py-1 rounded-xl"
                                >
                                  Iniciar
                                </button>
                              )}

                              {apt.status === 'in_progress' && (
                                <button
                                  onClick={() => onUpdateStatus(apt.id, 'completed')}
                                  className="btn-gold text-[10px] px-3 py-1 rounded-xl"
                                >
                                  Finalizar & Cobrar
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-[#0E0E11] border border-dashed border-[#262630] hover:border-[#444455] rounded-xl px-3.5 py-2 transition-colors group">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-emerald-400 transition-colors" />
                        <span>⚪ LIVRE — Horário Disponível</span>
                      </div>
                      <button
                        onClick={onOpenNewAppointment}
                        className="text-[11px] text-zinc-400 group-hover:text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1 bg-[#18181E] hover:bg-emerald-500/20 px-3 py-1 rounded-lg border border-[#2A2A35] hover:border-emerald-500/30 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Agendar Cliente</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
