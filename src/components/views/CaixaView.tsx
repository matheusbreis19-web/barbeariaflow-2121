import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Calendar, 
  Lock, 
  Plus, 
  Download,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Share2,
  X,
  UserCheck,
  User,
  Scissors,
  Send,
  Zap,
  CheckCircle
} from 'lucide-react';
import { FinancialTransaction, Barber, Appointment } from '../../types';
import { MetaDiariaCard } from '../MetaDiariaCard';

interface CaixaViewProps {
  transactions: FinancialTransaction[];
  barbers: Barber[];
  appointments: Appointment[];
  dailyTarget: number;
  onAddTransaction: (tx: FinancialTransaction) => void;
  onUpdateDailyTarget?: (newTarget: number) => void;
}

export const CaixaView: React.FC<CaixaViewProps> = ({
  transactions,
  barbers,
  appointments,
  dailyTarget,
  onAddTransaction,
  onUpdateDailyTarget,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showBarberCheckoutModal, setShowBarberCheckoutModal] = useState<boolean>(false);
  const [selectedBarberId, setSelectedBarberId] = useState<string>(barbers[0]?.id || '');
  const [barberTips, setBarberTips] = useState<string>('0');
  const [barberCheckoutSuccess, setBarberCheckoutSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [desc, setDesc] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card_credit' | 'card_debit' | 'cash'>('pix');

  const todayStr = new Date().toISOString().split('T')[0];

  const todayTransactions = transactions.filter((t) => t.date === todayStr);
  const totalIncome = todayTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = todayTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netRevenue = totalIncome - totalExpense;

  const targetPct = Math.min(100, Math.round((totalIncome / (dailyTarget || 1)) * 100));
  const remainingTarget = Math.max(0, dailyTarget - totalIncome);

  const completedCount = appointments.filter((a) => a.status === 'completed' && a.date === todayStr).length;
  const avgTicket = completedCount > 0 ? totalIncome / completedCount : 0;

  // Selected barber for 1-click checkout calculations
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId) || barbers[0];
  const isSoloShop = barbers.length === 1;

  // ESC Key listener to close open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showBarberCheckoutModal) setShowBarberCheckoutModal(false);
        else if (showReportModal) setShowReportModal(false);
        else if (showAddModal) setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBarberCheckoutModal, showReportModal, showAddModal]);

  const selectedBarberAppointments = appointments.filter(
    (a) => a.date === todayStr && a.status === 'completed' && (a.barberId === selectedBarber?.id || a.barberName === selectedBarber?.name)
  );
  const barberGrossRevenue = selectedBarberAppointments.reduce((sum, a) => sum + a.price, 0);
  const barberCommissionRate = isSoloShop ? 1.0 : (selectedBarber?.commissionRate || 0.50);
  const barberCommissionAmount = barberGrossRevenue * barberCommissionRate;
  const tipsAmount = parseFloat(barberTips) || 0;
  const totalBarberPayout = barberCommissionAmount + tipsAmount;

  // Revenue by payment method
  const pixTotal = todayTransactions.filter((t) => t.type === 'income' && t.paymentMethod === 'pix').reduce((s, t) => s + t.amount, 0);
  const cardTotal = todayTransactions.filter((t) => t.type === 'income' && (t.paymentMethod === 'card_credit' || t.paymentMethod === 'card_debit')).reduce((s, t) => s + t.amount, 0);
  const cashTotal = todayTransactions.filter((t) => t.type === 'income' && t.paymentMethod === 'cash').reduce((s, t) => s + t.amount, 0);

  // Performance per barber
  const barberPerformance = barbers.map((b) => {
    const bApts = appointments.filter((a) => a.date === todayStr && a.status === 'completed' && a.barberId === b.id);
    const bRevenue = bApts.reduce((sum, a) => sum + a.price, 0);
    return { id: b.id, name: b.name, count: bApts.length, revenue: bRevenue };
  }).filter((b) => b.count > 0 || b.revenue > 0);

  const handleBarberCheckoutRegister = () => {
    if (!selectedBarber || totalBarberPayout <= 0) return;

    // Log expense transaction for barber commission payout
    onAddTransaction({
      id: `tx-barber-${Date.now()}`,
      type: 'expense',
      description: `Fechamento de Comissões - Barbeiro: ${selectedBarber.name}`,
      amount: totalBarberPayout,
      paymentMethod: 'pix',
      date: todayStr,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      category: 'comissao',
    });

    setBarberCheckoutSuccess(true);
    setTimeout(() => {
      setBarberCheckoutSuccess(false);
      setShowBarberCheckoutModal(false);
    }, 2500);
  };

  const handleSendBarberWhatsappSummary = () => {
    if (!selectedBarber) return;

    let text = `=======================================\n`;
    text += ` ✂️ FECHAMENTO DIÁRIO - BARBER OS\n`;
    text += `=======================================\n`;
    text += `Barbeiro: ${selectedBarber.name}\n`;
    text += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    text += `• Atendimentos Concluídos: ${selectedBarberAppointments.length}\n`;
    text += `• Faturamento Bruto Gerado: R$ ${barberGrossRevenue.toFixed(2)}\n`;
    text += `• Sua Taxa de Comissão: ${(barberCommissionRate * 100).toFixed(0)}%\n`;
    text += `• Comissão do Dia: R$ ${barberCommissionAmount.toFixed(2)}\n`;
    if (tipsAmount > 0) {
      text += `• Gorjetas/Extras: R$ ${tipsAmount.toFixed(2)}\n`;
    }
    text += `---------------------------------------\n`;
    text += `💰 LÍQUIDO A RECEBER: R$ ${totalBarberPayout.toFixed(2)}\n`;
    text += `=======================================\n`;
    text += `Excelente trabalho hoje! Obrigado parceiro. 🚀`;

    const phoneClean = selectedBarber.phone ? selectedBarber.phone.replace(/\D/g, '') : '';
    const encoded = encodeURIComponent(text);
    if (phoneClean) {
      window.open(`https://wa.me/55${phoneClean}?text=${encoded}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    onAddTransaction({
      id: `tx-${Date.now()}`,
      type,
      description: desc,
      amount: parseFloat(amount),
      paymentMethod,
      date: todayStr,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      category: type === 'income' ? 'servico' : 'outros',
    });

    setDesc('');
    setAmount('');
    setShowAddModal(false);
  };

  const generateReportText = () => {
    const dateFormatted = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const timeFormatted = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let text = `=======================================\n`;
    text += `   BARBER OS - RELATÓRIO DE FECHAMENTO\n`;
    text += `=======================================\n`;
    text += `Data: ${dateFormatted}\n`;
    text += `Gerado às: ${timeFormatted}\n\n`;

    text += `--- RESUMO FINANCEIRO DO DIA ---\n`;
    text += `• Total Faturado (Entradas): R$ ${totalIncome.toFixed(2)}\n`;
    text += `• Total Despesas (Saídas): R$ ${totalExpense.toFixed(2)}\n`;
    text += `• Saldo Líquido do Dia: R$ ${netRevenue.toFixed(2)}\n`;
    text += `• Meta Diária: R$ ${dailyTarget.toFixed(2)} (${targetPct}% atingida)\n`;
    if (remainingTarget > 0) {
      text += `• Falta para a meta: R$ ${remainingTarget.toFixed(2)}\n`;
    } else {
      text += `• Superávit de meta: + R$ ${(totalIncome - dailyTarget).toFixed(2)}\n`;
    }
    text += `\n`;

    text += `--- INDICADORES DE ATENDIMENTO ---\n`;
    text += `• Clientes Atendidos: ${completedCount}\n`;
    text += `• Ticket Médio: R$ ${avgTicket.toFixed(2)}\n`;
    text += `• Estimativa de Comissões (50%): R$ ${(totalIncome * 0.5).toFixed(2)}\n\n`;

    text += `--- FORMAS DE PAGAMENTO ---\n`;
    text += `• PIX: R$ ${pixTotal.toFixed(2)}\n`;
    text += `• Cartões (Crédito / Débito): R$ ${cardTotal.toFixed(2)}\n`;
    text += `• Dinheiro em Espécie: R$ ${cashTotal.toFixed(2)}\n\n`;

    if (barberPerformance.length > 0) {
      text += `--- DESEMPENHO POR BARBEIRO ---\n`;
      barberPerformance.forEach((b) => {
        text += `• ${b.name}: ${b.count} atendimento(s) | Total R$ ${b.revenue.toFixed(2)}\n`;
      });
      text += `\n`;
    }

    if (todayTransactions.length > 0) {
      text += `--- LANÇAMENTOS DO DIA (${todayTransactions.length}) ---\n`;
      todayTransactions.forEach((tx) => {
        const signal = tx.type === 'income' ? '+' : '-';
        text += `[${tx.time}] ${signal} R$ ${tx.amount.toFixed(2)} | ${tx.description} (${tx.paymentMethod.toUpperCase()})\n`;
      });
      text += `\n`;
    }

    text += `=======================================\n`;
    text += `BarberOS - Sistema de Gestão para Barbearias\n`;
    return text;
  };

  const handleCopyReport = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fechamento-caixa-${todayStr}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareWhatsapp = () => {
    const text = generateReportText();
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Meta Diária de Faturamento Component & Quick Actions */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-base font-extrabold text-white">Controle de Caixa & Fechamento</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBarberCheckoutModal(true)}
              className="bg-[#22222A] hover:bg-[#2A2A35] text-[#D4AF37] border border-[#D4AF37]/40 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-black transition-all shadow-md cursor-pointer"
              title="Realizar fechamento diário individual de comissão do barbeiro"
            >
              <Scissors className="w-4 h-4 text-[#D4AF37]" />
              <span>Fechamento do Barbeiro (1 Clique)</span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="bg-[#1A1A1A] hover:bg-[#252525] text-zinc-200 border border-[#2A2A2A] hover:border-[#D4AF37]/50 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all shadow-md cursor-pointer"
              title="Gerar e exportar resumo de fechamento do dia"
            >
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>Exportar Relatório</span>
            </button>

            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-gold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#D4AF37]/10 font-extrabold cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Lançar Operação</span>
            </button>
          </div>
        </div>

        <MetaDiariaCard
          todayRevenue={totalIncome}
          dailyRevenueTarget={dailyTarget}
          onUpdateDailyTarget={onUpdateDailyTarget}
          scheduledAppointmentsTodayCount={appointments.filter(a => a.date === todayStr && (a.status === 'scheduled' || a.status === 'in_progress')).length}
          projectedRevenueToday={appointments.filter(a => a.date === todayStr && a.status !== 'cancelled').reduce((s, a) => s + a.price, 0)}
        />
      </div>

      {/* Daily Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 shadow-xl">
          <div className="label-bold">Faturado Hoje</div>
          <div className="text-2xl font-black font-mono text-[#D4AF37] mt-1">R$ {totalIncome.toFixed(2)}</div>
          <div className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Lançado no caixa</div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 shadow-xl">
          <div className="label-bold">Clientes Atendidos</div>
          <div className="text-2xl font-black text-white mt-1">{completedCount}</div>
          <div className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Concluídos hoje</div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 shadow-xl">
          <div className="label-bold">Ticket Médio</div>
          <div className="text-2xl font-black font-mono text-[#D4AF37] mt-1">R$ {avgTicket.toFixed(2)}</div>
          <div className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Por atendimento</div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 shadow-xl">
          <div className="label-bold">Comissões da Equipe</div>
          <div className="text-2xl font-black font-mono text-white mt-1">R$ {(totalIncome * 0.5).toFixed(2)}</div>
          <div className="text-[10px] text-zinc-500 font-bold uppercase mt-1">A repassar a barbeiros</div>
        </div>

      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 shadow-xl space-y-4">
        <h2 className="label-bold text-xs text-white">
          Divisão de Formas de Pagamento
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <div className="text-xs font-black text-white">PIX</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Direto na conta</div>
              </div>
            </div>
            <div className="text-base font-black font-mono text-[#D4AF37]">R$ {pixTotal.toFixed(2)}</div>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <div className="text-xs font-black text-white">Cartões</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Crédito & Débito</div>
              </div>
            </div>
            <div className="text-base font-black font-mono text-white">R$ {cardTotal.toFixed(2)}</div>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Wallet className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <div className="text-xs font-black text-white">Dinheiro</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Espécie na gaveta</div>
              </div>
            </div>
            <div className="text-base font-black font-mono text-[#D4AF37]">R$ {cashTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#141414] border-b border-[#2A2A2A] flex items-center justify-between">
          <h2 className="label-bold text-white">
            Histórico de Lançamentos do Dia
          </h2>
          <span className="text-xs font-bold text-zinc-400">{todayTransactions.length} lançamentos</span>
        </div>

        <div className="divide-y divide-[#2A2A2A]">
          {todayTransactions.map((tx) => (
            <div key={tx.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#222222]">
              <div>
                <div className="font-extrabold text-white">{tx.description}</div>
                <div className="text-[11px] text-zinc-500 mt-0.5 font-mono font-bold">
                  {tx.time} • Forma: {tx.paymentMethod.toUpperCase()}
                </div>
              </div>

              <div className={`font-mono font-black text-sm ${tx.type === 'income' ? 'text-[#D4AF37]' : 'text-rose-400'}`}>
                {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Relatório de Fechamento de Caixa</h3>
                  <p className="text-xs text-zinc-400">Resumo estruturado para gerência e fechamento diário</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white bg-[#141414] hover:bg-[#222222] border border-[#2A2A2A] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formatted Text Box */}
            <div className="flex-1 overflow-y-auto bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-4 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-all">
              {generateReportText()}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2A2A2A]">
              <div className="text-xs text-zinc-400 font-medium">
                Pronto para cópia ou envio
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareWhatsapp}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  title="Compartilhar resumo via WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={handleDownloadReport}
                  className="px-3.5 py-2 bg-[#252525] hover:bg-[#333333] text-white text-xs font-bold rounded-xl border border-[#333] flex items-center gap-1.5 transition-colors"
                  title="Baixar arquivo de texto (.txt)"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>Baixar .TXT</span>
                </button>

                <button
                  onClick={handleCopyReport}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                    copied 
                      ? 'bg-emerald-500 text-slate-950 font-black' 
                      : 'bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-extrabold'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Relatório</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white">Lançamento de Caixa</h3>

            <form onSubmit={handleCreateTx} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Tipo de Operação</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 text-xs font-bold rounded-xl border ${type === 'income' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 text-xs font-bold rounded-xl border ${type === 'expense' ? 'bg-rose-500 text-slate-950 border-rose-400' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    Saída / Despesa
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ex: Pagamento de toalhas ou Venda de produto"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✂️ Fechamento do Barbeiro em 1 Clique Modal */}
      {showBarberCheckoutModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1E] border border-[#2A2A35] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#2A2A35] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Fechamento do Barbeiro em 1 Clique</h3>
                  <p className="text-xs text-zinc-400">Repasse instantâneo de comissão e extrato diário</p>
                </div>
              </div>

              <button
                onClick={() => setShowBarberCheckoutModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white bg-[#141418] hover:bg-[#22222A] border border-[#2A2A35] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barber Selector */}
            {isSoloShop ? (
              <div className="p-3 bg-[#141418] border border-[#D4AF37]/40 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {selectedBarber?.name} (Dono Único)
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-semibold">
                    Modo Barbeiro Solo: 100% da receita de atendimentos fica no negócio/pró-labore.
                  </p>
                </div>
                <span className="bg-[#D4AF37] text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg uppercase">
                  100% Retenção
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Selecione o Barbeiro:</label>
                <select
                  value={selectedBarberId}
                  onChange={(e) => setSelectedBarberId(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-[#2A2A35] rounded-xl px-3.5 py-2.5 text-xs text-white font-bold uppercase focus:outline-none focus:border-[#D4AF37]"
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({((b.commissionRate || 0.5) * 100).toFixed(0)}% comissão)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="bg-[#0A0A0C] border border-[#262630] rounded-2xl p-4 space-y-3">
              
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#22222A]">
                <span className="text-zinc-400 font-semibold">Atendimentos Concluídos Hoje:</span>
                <span className="font-extrabold text-white font-mono">{selectedBarberAppointments.length} clientes</span>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#22222A]">
                <span className="text-zinc-400 font-semibold">Faturamento Bruto Gerado:</span>
                <span className="font-black text-white font-mono text-sm">R$ {barberGrossRevenue.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#22222A]">
                <span className="text-zinc-400 font-semibold">Taxa de Comissão:</span>
                <span className="font-bold text-[#D4AF37] font-mono">{(barberCommissionRate * 100).toFixed(0)}%</span>
              </div>

              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#22222A]">
                <span className="text-zinc-400 font-semibold">Comissão Bruta a Pagar:</span>
                <span className="font-black text-emerald-400 font-mono">R$ {barberCommissionAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-300 font-bold">Gorjetas / Extras (R$):</span>
                <input
                  type="number"
                  step="0.01"
                  value={barberTips}
                  onChange={(e) => setBarberTips(e.target.value)}
                  className="w-24 bg-[#141418] border border-[#2A2A35] rounded-lg px-2.5 py-1 text-xs text-white font-mono font-bold text-right"
                />
              </div>

            </div>

            {/* Total Highlight */}
            <div className="bg-[#141418] border border-[#D4AF37]/40 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">Total Líquido a Pagar</span>
                <div className="text-xs text-zinc-500">Comissão + Gorjetas</div>
              </div>
              <div className="text-2xl font-black font-mono text-[#D4AF37]">
                R$ {totalBarberPayout.toFixed(2)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleSendBarberWhatsappSummary}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Extrato (WhatsApp)</span>
              </button>

              <button
                type="button"
                onClick={handleBarberCheckoutRegister}
                disabled={totalBarberPayout <= 0}
                className="btn-gold py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lançar Saída no Caixa</span>
              </button>
            </div>

            {barberCheckoutSuccess && (
              <div className="p-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl text-center flex items-center justify-center gap-2 animate-bounce">
                <Check className="w-4 h-4 stroke-[3]" />
                Fechamento registrado com sucesso no Caixa!
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

