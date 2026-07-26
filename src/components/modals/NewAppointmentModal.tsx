import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Scissors, DollarSign } from 'lucide-react';
import { ServiceItem, Barber, Appointment } from '../../types';

interface NewAppointmentModalProps {
  services: ServiceItem[];
  barbers: Barber[];
  onClose: () => void;
  onSave: (newApt: Appointment) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  services,
  barbers,
  onClose,
  onSave,
}) => {
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [selectedBarberId, setSelectedBarberId] = useState<string>(barbers[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('10:00');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find((s) => s.id === selectedServiceId) || services[0];
    const barber = barbers.find((b) => b.id === selectedBarberId) || barbers[0];

    if (!service || !clientName.trim()) return;

    onSave({
      id: `apt-${Date.now()}`,
      clientName,
      clientPhone: clientPhone || '(62) 99999-0000',
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      durationMin: service.durationMin,
      barberId: barber.id,
      barberName: barber.name,
      date,
      time,
      status: 'scheduled',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-white">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-bold text-base text-white">Novo Agendamento Rápido</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Nome do Cliente *</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: Carlos Eduardo"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">WhatsApp</label>
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="(62) 99999-9999"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Serviço</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.durationMin} min) - R$ {s.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Barbeiro</label>
            <select
              value={selectedBarberId}
              onChange={(e) => setSelectedBarberId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Horário</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl"
            >
              Salvar Agendamento
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
