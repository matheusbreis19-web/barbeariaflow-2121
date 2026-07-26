import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Clock, 
  Play, 
  CheckCircle2, 
  Plus, 
  User, 
  Phone, 
  DollarSign, 
  CreditCard, 
  QrCode, 
  Wallet, 
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Appointment, ServiceItem, InventoryProduct, AppointmentStatus } from '../../types';

interface AtendimentoViewProps {
  appointments: Appointment[];
  services: ServiceItem[];
  products: InventoryProduct[];
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onCompleteWithPayment: (
    appointmentId: string, 
    paymentMethod: 'pix' | 'card_credit' | 'card_debit' | 'cash', 
    additionalProductIds: string[]
  ) => void;
}

export const AtendimentoView: React.FC<AtendimentoViewProps> = ({
  appointments,
  services,
  products,
  onUpdateStatus,
  onCompleteWithPayment,
}) => {
  const inProgressApts = appointments.filter((a) => a.status === 'in_progress');
  const scheduledApts = appointments.filter((a) => a.status === 'scheduled');
  
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(inProgressApts[0] || null);
  const [selectedPayment, setSelectedPayment] = useState<'pix' | 'card_credit' | 'card_debit' | 'cash'>('pix');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (inProgressApts.length > 0 && (!selectedApt || selectedApt.status !== 'in_progress')) {
      setSelectedApt(inProgressApts[0]);
    }
  }, [inProgressApts]);

  const toggleAddProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const getExtraProductsTotal = () => {
    return selectedProducts.reduce((sum, pId) => {
      const prod = products.find((p) => p.id === pId);
      return sum + (prod ? prod.sellPrice : 0);
    }, 0);
  };

  const currentTotal = selectedApt ? selectedApt.price + getExtraProductsTotal() : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <h1 className="text-xl font-black uppercase tracking-wide text-white">Fluxo de Atendimento Operacional</h1>
            </div>
            <p className="text-xs text-zinc-400 font-semibold mt-1">
              Acompanhe o cliente na cadeira, tempo estimado, venda casada de produtos e cobrança rápida.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-2 rounded-xl text-xs text-zinc-300">
              <span className="label-bold mr-1">Em Atendimento:</span>{' '}
              <span className="font-black text-[#D4AF37]">{inProgressApts.length} cliente(s)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Appointments List */}
        <div className="space-y-4">
          <div className="label-bold px-1">
            Clientes Aguardando / Na Cadeira
          </div>

          {inProgressApts.map((apt) => (
            <div
              key={apt.id}
              onClick={() => setSelectedApt(apt)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedApt?.id === apt.id
                  ? 'bg-[#222222] border-l-4 border-l-[#D4AF37] border-t-[#2A2A2A] border-r-[#2A2A2A] border-b-[#2A2A2A] shadow-2xl'
                  : 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-[#D4AF37] text-black px-2 py-0.5 rounded-md">
                    Na Cadeira
                  </span>
                  <h3 className="font-black text-lg text-white mt-2">{apt.clientName}</h3>
                  <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider mt-0.5">{apt.serviceName}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-black text-white">R$ {apt.price.toFixed(2)}</div>
                  <div className="text-[11px] font-bold text-zinc-500 mt-0.5">{apt.durationMin} min</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1 font-bold text-zinc-300">
                  <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {apt.barberName}
                </span>
                <span className="flex items-center gap-1 font-mono font-bold text-[#D4AF37]">
                  <Clock className="w-3.5 h-3.5" />
                  Iniciado às {apt.startedAt || '09:00'}
                </span>
              </div>
            </div>
          ))}

          {scheduledApts.length > 0 && (
            <div className="pt-2">
              <div className="label-bold px-1 mb-2">
                Próximos da Fila
              </div>
              <div className="space-y-2">
                {scheduledApts.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-white">{apt.clientName}</div>
                      <div className="text-[11px] text-zinc-400 font-semibold">{apt.time} • {apt.serviceName}</div>
                    </div>
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'in_progress')}
                      className="bg-[#2A2A2A] hover:bg-[#333333] text-[#D4AF37] text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border border-zinc-700 transition-all flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Chamar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (2 cols): Selected Appointment Control & Checkout */}
        <div className="lg:col-span-2">
          {selectedApt ? (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl space-y-6">
              
              {/* Top Active Card Header with Big Typography */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2A]">
                <div>
                  <div className="label-bold mb-1">Atendimento em Curso</div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
                    {selectedApt.clientName}
                  </h1>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2 font-bold">
                    <span>{selectedApt.clientPhone}</span>
                    <span>•</span>
                    <span className="text-[#D4AF37] uppercase tracking-wider">{selectedApt.serviceName}</span>
                  </div>
                </div>

                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A2A2A] text-center min-w-[150px]">
                  <div className="label-bold text-[10px]">Total Atendimento</div>
                  <div className="text-2xl font-black font-mono text-[#D4AF37] mt-1">
                    R$ {currentTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Upsell / Add Products in Chair */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 label-bold text-[#D4AF37]">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar Insumos / Venda de Balcão</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-semibold">Aumente o ticket médio</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {products.slice(0, 4).map((prod) => {
                    const isSelected = selectedProducts.includes(prod.id);
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => toggleAddProduct(prod.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold'
                            : 'bg-[#0A0A0A] border-[#2A2A2A] text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-extrabold uppercase">{prod.name}</div>
                          <div className="text-[11px] text-zinc-500 font-semibold">Estoque: {prod.stock}un</div>
                        </div>
                        <div className="text-xs font-black font-mono text-[#D4AF37]">
                          +R$ {prod.sellPrice.toFixed(2)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <div className="label-bold mb-3">
                  Forma de Pagamento
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'pix', label: 'PIX', icon: QrCode },
                    { id: 'card_credit', label: 'Crédito', icon: CreditCard },
                    { id: 'card_debit', label: 'Débito', icon: CreditCard },
                    { id: 'cash', label: 'Dinheiro', icon: Wallet },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedPayment === method.id;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id as any)}
                        className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black font-black uppercase border-[#D4AF37] shadow-lg'
                            : 'bg-[#0A0A0A] border-[#2A2A2A] text-zinc-300 hover:bg-[#222222]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-extrabold uppercase">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finalize Buttons */}
              <div className="pt-4 border-t border-[#2A2A2A] flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onCompleteWithPayment(selectedApt.id, selectedPayment, selectedProducts)}
                  className="btn-gold w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-[#D4AF37]/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>Finalizar & Cobrar (R$ {currentTotal.toFixed(2)})</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-12 text-center text-zinc-500">
              <Scissors className="w-12 h-12 mx-auto stroke-1 mb-3 text-zinc-600" />
              <p className="text-xs font-bold uppercase tracking-wider">Nenhum atendimento selecionado na cadeira.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
