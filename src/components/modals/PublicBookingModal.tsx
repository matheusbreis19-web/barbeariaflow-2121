import React, { useState, useMemo, useEffect } from 'react';
import { BarberLogo } from '../BarberLogo';
import { X, Scissors, Calendar, Clock, User, Phone, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { ServiceItem, Barber, ShopConfig, Appointment } from '../../types';

interface PublicBookingModalProps {
  config: ShopConfig;
  services: ServiceItem[];
  barbers: Barber[];
  onClose: () => void;
  onConfirmBooking: (newApt: Appointment) => void;
}

export const PublicBookingModal: React.FC<PublicBookingModalProps> = ({
  config,
  services,
  barbers,
  onClose,
  onConfirmBooking,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  const activeServices = useMemo(() => {
    const activeList = services.filter((s) => s.active);
    return activeList.length > 0 ? activeList : services;
  }, [services]);

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(activeServices[0] || null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(barbers[0] || null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  // Dynamic slot calculation based on weekly schedule, service duration & buffer
  const daySchedule = useMemo(() => {
    if (!selectedDate) return null;
    const dateObj = new Date(`${selectedDate}T00:00:00`);
    const dayOfWeek = dateObj.getDay();
    return config.weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek) || null;
  }, [selectedDate, config.weeklySchedule]);

  const availableTimes = useMemo(() => {
    if (!daySchedule || !daySchedule.isOpen) return [];

    const slots: string[] = [];
    const serviceDuration = selectedService ? selectedService.durationMin : 30;
    const buffer = config.bufferMinutes || 5;
    const totalBlockMinutes = serviceDuration + buffer;

    const [openH, openM] = daySchedule.openTime.split(':').map(Number);
    const [closeH, closeM] = daySchedule.closeTime.split(':').map(Number);

    let currentMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    let breakStartMin = -1;
    let breakEndMin = -1;
    if (daySchedule.breakStart && daySchedule.breakEnd) {
      const [bStartH, bStartM] = daySchedule.breakStart.split(':').map(Number);
      const [bEndH, bEndM] = daySchedule.breakEnd.split(':').map(Number);
      breakStartMin = bStartH * 60 + bStartM;
      breakEndMin = bEndH * 60 + bEndM;
    }

    while (currentMinutes + serviceDuration <= closeMinutes) {
      const slotEndMin = currentMinutes + serviceDuration;

      // Check if slot overlaps with lunch break
      const overlapsBreak =
        breakStartMin !== -1 &&
        breakEndMin !== -1 &&
        currentMinutes < breakEndMin &&
        slotEndMin > breakStartMin;

      if (!overlapsBreak) {
        const hh = Math.floor(currentMinutes / 60)
          .toString()
          .padStart(2, '0');
        const mm = (currentMinutes % 60).toString().padStart(2, '0');
        slots.push(`${hh}:${mm}`);
      }

      currentMinutes += totalBlockMinutes;
    }

    return slots;
  }, [daySchedule, selectedService, config.bufferMinutes]);

  const handleFinish = () => {
    if (!selectedService || !clientName.trim() || !clientPhone.trim()) return;

    const chosenBarber = selectedBarber || barbers[0];

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientName,
      clientPhone,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: selectedService.price,
      durationMin: selectedService.durationMin,
      barberId: chosenBarber?.id || 'barber-1',
      barberName: chosenBarber?.name || 'João da Silva',
      date: selectedDate,
      time: selectedTime,
      status: 'scheduled',
    };

    onConfirmBooking(newApt);
    setConfirmedApt(newApt);
    setStep(5);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm sm:max-w-md p-6 shadow-2xl relative text-white space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <BarberLogo variant="icon" size="sm" />
            <div>
              <h2 className="font-bold text-sm text-white">{config.shopName}</h2>
              <p className="text-[10px] text-slate-400">Agendamento em tempo real</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 border-b border-slate-800 pb-2">
          <span className={step >= 1 ? 'text-[#D4AF37] font-extrabold' : ''}>1. Serviço</span>
          <span className={step >= 2 ? 'text-[#D4AF37] font-extrabold' : ''}>2. Data</span>
          <span className={step >= 3 ? 'text-[#D4AF37] font-extrabold' : ''}>3. Horário</span>
          <span className={step >= 4 ? 'text-[#D4AF37] font-extrabold' : ''}>4. Dados</span>
        </div>

        {/* Step 1: Services */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase text-slate-300">Escolha o serviço:</div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {activeServices.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    selectedService?.id === srv.id
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{srv.name}</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#D4AF37]">
                    R$ {srv.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Barber Selection optional */}
            {barbers.length > 0 && (
              <div className="pt-2">
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                  Barbeiro Preferido (Opcional):
                </label>
                <select
                  value={selectedBarber?.id || ''}
                  onChange={(e) => {
                    const found = barbers.find((b) => b.id === e.target.value);
                    if (found) setSelectedBarber(found);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              className="w-full btn-gold text-slate-950 font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              CONTINUAR →
            </button>
          </div>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase text-slate-300">Escolha a data:</div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />

            {daySchedule && !daySchedule.isOpen && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Nossa barbearia está fechada aos domingos/folgas neste dia.</span>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 py-2.5 rounded-xl text-xs font-bold">Voltar</button>
              <button
                onClick={() => setStep(3)}
                disabled={!daySchedule?.isOpen}
                className="flex-1 btn-gold text-slate-950 py-2.5 rounded-xl text-xs font-black disabled:opacity-50"
              >
                Avançar →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Dynamic Time Slots */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase text-slate-300">Horários disponíveis ({selectedDate}):</div>
            
            {availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {availableTimes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border ${
                      selectedTime === t
                        ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                Nenhum horário vago para {selectedService?.name} nesta data. Tente outra data.
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 bg-slate-800 py-2.5 rounded-xl text-xs font-bold">Voltar</button>
              <button
                onClick={() => setStep(4)}
                disabled={availableTimes.length === 0}
                className="flex-1 btn-gold text-slate-950 py-2.5 rounded-xl text-xs font-black disabled:opacity-50"
              >
                Avançar →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Client Form */}
        {step === 4 && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase text-slate-300">Seus dados para confirmação:</div>
            
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Nome completo *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Telefone (WhatsApp) *</label>
              <input
                type="text"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(62) 99999-9999"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(3)} className="flex-1 bg-slate-800 py-2.5 rounded-xl text-xs font-bold">Voltar</button>
              <button onClick={handleFinish} className="flex-1 btn-gold text-slate-950 py-2.5 rounded-xl text-xs font-black cursor-pointer">
                CONCLUIR AGENDAMENTO
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success Card */}
        {step === 5 && confirmedApt && (
          <div className="text-center space-y-4 py-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center font-bold">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Tudo certo!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Seu agendamento foi realizado com sucesso.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs space-y-1">
              <div className="flex justify-between"><span className="text-slate-400">Serviço:</span> <span className="font-bold text-white">{confirmedApt.serviceName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Barbeiro:</span> <span className="font-bold text-white">{confirmedApt.barberName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Data e Horário:</span> <span className="font-bold text-[#D4AF37]">{confirmedApt.date} às {confirmedApt.time}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Barbearia:</span> <span className="font-bold text-white">{config.shopName}</span></div>
            </div>

            <button
              onClick={onClose}
              className="w-full btn-gold text-slate-950 font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              CONCLUIR & FECHAR
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
