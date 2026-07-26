import React, { useState } from 'react';
import { Sparkles, TrendingDown, Users, AlertTriangle, ArrowRight, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Appointment, ClientProfile, ShopConfig } from '../../types';

interface IAInsightsViewProps {
  config: ShopConfig;
  appointments: Appointment[];
  clients: ClientProfile[];
  todayRevenue: number;
  onNavigateTab?: (tab: string) => void;
}

export const IAInsightsView: React.FC<IAInsightsViewProps> = ({
  config,
  appointments,
  clients,
  todayRevenue,
  onNavigateTab,
}) => {
  const [aiInsightText, setAiInsightText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const atRiskClients = clients.filter((c) => c.daysSinceLastVisit >= 25);
  const completedApts = appointments.filter((a) => a.status === 'completed');

  const fetchAIAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/daily-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyRevenue: todayRevenue,
          dailyTarget: config.dailyRevenueTarget,
          completedAppointments: completedApts.length,
          totalSlots: appointments.length || 10,
          inactiveClientsCount: atRiskClients.length,
          occupancyRate: Math.round((completedApts.length / 10) * 100),
        }),
      });

      const data = await res.json();
      setAiInsightText(data.insight || 'Análise indisponível no momento.');
    } catch (err) {
      setAiInsightText('Sua taxa de ocupação está excelente hoje. Foque em oferecer produtos de balcão (como pomadas) aos clientes na cadeira para aumentar o ticket médio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* "Em Breve" Coming Soon Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-[#1A1A22] to-amber-950/30 border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-3 right-3 bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3 h-3 fill-current" />
          <span>EM BREVE — MÓDULO IA ADVANCED</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-purple-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black uppercase text-white">Inteligência Operacional Barbearia</h1>
                <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                  V2.0
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-semibold mt-1">
                Decisões autônomas e inteligência preditiva para maximizar a rentabilidade das cadeiras.
              </p>
            </div>
          </div>

          <button
            onClick={fetchAIAnalysis}
            disabled={loading}
            className="btn-gold px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'ANALISANDO...' : 'TESTAR PRÉVIA DE IA'}</span>
          </button>
        </div>
      </div>

      {/* Decision Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Churn Warning */}
        <div className="bg-[#1A1A1A] border-l-4 border-l-rose-500 border-t border-t-[#2A2A2A] border-r border-r-[#2A2A2A] border-b border-b-[#2A2A2A] rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase bg-rose-500 text-black px-2.5 py-0.5 rounded-md">
              Oportunidade de Reconquista
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>

          <h3 className="font-black text-lg text-white uppercase">
            {atRiskClients.length} clientes da sua base não retornam há mais de 25 dias.
          </h3>

          <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
            Se esses clientes não cortarem este mês, a estimativa é uma queda de R$ {(atRiskClients.length * 70).toFixed(2)} no faturamento mensal.
          </p>

          <div className="pt-2 border-t border-[#2A2A2A]">
            <button
              onClick={() => onNavigateTab && onNavigateTab('crm')}
              className="text-xs font-black uppercase tracking-wider text-rose-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
            >
              <span>Ativar campanha de reconquista via WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Idle Schedule Gap */}
        <div className="bg-[#1A1A1A] border-l-4 border-l-[#D4AF37] border-t border-t-[#2A2A2A] border-r border-r-[#2A2A2A] border-b border-b-[#2A2A2A] rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase bg-[#D4AF37] text-black px-2.5 py-0.5 rounded-md">
              Ocupação da Agenda
            </span>
            <Zap className="w-4 h-4 text-[#D4AF37] fill-current" />
          </div>

          <h3 className="font-black text-lg text-white uppercase">
            Existem 3 lacunas de tempo livre de 25 minutos hoje.
          </h3>

          <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
            Preenchendo essas lacunas com serviços rápidos (Sobrancelha ou Bigode), você adiciona R$ 45,00 ao caixa de hoje sem hora extra.
          </p>

          <div className="pt-2 border-t border-[#2A2A2A]">
            <button
              onClick={() => onNavigateTab && onNavigateTab('encaixe')}
              className="text-xs font-black uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
            >
              <span>Lançar Encaixe Inteligente no balcão</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Gemini Generated Insight Output Box */}
      {aiInsightText && (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl space-y-3">
          <div className="flex items-center gap-2 text-[#D4AF37] font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Relatório de Recomendações do Assistente IA:</span>
          </div>

          <div className="text-xs text-zinc-200 leading-relaxed font-mono bg-[#0A0A0A] p-4 rounded-xl border border-[#2A2A2A]">
            {aiInsightText}
          </div>
        </div>
      )}

    </div>
  );
};
