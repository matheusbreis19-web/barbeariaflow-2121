import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Edit3, 
  Sparkles, 
  Scissors, 
  Award,
  ChevronRight,
  Zap,
  HelpCircle,
  Trophy,
  ArrowUpRight,
  Send,
  Share2,
  Check,
  Rocket,
  Users
} from 'lucide-react';

interface MetaDiariaCardProps {
  todayRevenue: number;
  dailyRevenueTarget: number;
  onUpdateDailyTarget?: (newTarget: number) => void;
  scheduledAppointmentsTodayCount?: number;
  projectedRevenueToday?: number;
  totalSlotsTodayCount?: number;
}

export const MetaDiariaCard: React.FC<MetaDiariaCardProps> = ({
  todayRevenue,
  dailyRevenueTarget,
  onUpdateDailyTarget,
  scheduledAppointmentsTodayCount = 7,
  projectedRevenueToday = 720,
  totalSlotsTodayCount = 10,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempTarget, setTempTarget] = useState<string>(dailyRevenueTarget.toString());
  const [inviteSent, setInviteSent] = useState<boolean>(false);

  const target = Math.max(1, dailyRevenueTarget);
  const percentage = Math.min(100, Math.round((todayRevenue / target) * 100));
  const remainingAmount = Math.max(0, target - todayRevenue);
  const isGoalReached = todayRevenue >= target;

  // Occupancy rate calculations
  const totalSlots = Math.max(1, totalSlotsTodayCount);
  const occupiedSlots = Math.min(totalSlots, scheduledAppointmentsTodayCount);
  const emptySlots = Math.max(0, totalSlots - occupiedSlots);
  const occupancyPercentage = Math.round((occupiedSlots / totalSlots) * 100);

  // Average service price estimation (e.g., R$ 45)
  const avgCutPrice = 45;
  const potentialExtraRevenue = emptySlots * avgCutPrice;
  const estimatedCutsRemaining = Math.ceil(remainingAmount / avgCutPrice);

  const handleSendInvite = () => {
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
    }, 4000);
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempTarget);
    if (!isNaN(val) && val > 0 && onUpdateDailyTarget) {
      onUpdateDailyTarget(val);
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditing) {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  const presetTargets = [300, 500, 800, 1000, 1500];

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 shadow-2xl relative overflow-hidden transition-all">
      {/* Decorative Background Gradient Glow */}
      <motion.div 
        animate={{ 
          scale: isGoalReached ? [1, 1.2, 1] : 1,
          opacity: isGoalReached ? [0.15, 0.25, 0.15] : 0.1
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
          isGoalReached ? 'bg-emerald-500' : 'bg-[#D4AF37]'
        }`} 
      />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div 
            key={isGoalReached ? 'goal-reached' : 'goal-in-progress'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg ${
              isGoalReached 
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20' 
                : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-[#D4AF37]/10'
            }`}
          >
            {isGoalReached ? (
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Target className="w-5 h-5 stroke-[2.5]" />
            )}
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-white flex items-center gap-1.5">
                Meta Diária de Faturamento
              </h3>
              {isGoalReached && (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Atingida
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              Acompanhamento do objetivo financeiro configurado no BarberOS
            </p>
          </div>
        </div>

        {/* Goal Edit Action */}
        {onUpdateDailyTarget && !isEditing && (
          <button
            onClick={() => {
              setTempTarget(dailyRevenueTarget.toString());
              setIsEditing(true);
            }}
            className="text-xs text-zinc-400 hover:text-[#D4AF37] bg-[#141414] hover:bg-[#222222] border border-[#2A2A2A] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors self-end sm:self-center"
            title="Alterar objetivo diário"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ajustar Meta</span>
          </button>
        )}
      </div>

      {/* Inline Goal Edit Mode */}
      <AnimatePresence>
        {isEditing && (
          <motion.form 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSaveTarget} 
            className="bg-[#141414] border border-[#2A2A2A] p-4 rounded-xl mb-4 space-y-3 overflow-hidden relative z-10"
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-300">Configurar Novo Objetivo Diário (R$)</label>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Valores sugeridos</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {presetTargets.map((pt) => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setTempTarget(pt.toString())}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                    parseFloat(tempTarget) === pt
                      ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]'
                      : 'bg-[#222222] text-zinc-300 border-[#333333] hover:border-[#555]'
                  }`}
                >
                  R$ {pt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                step="10"
                min="50"
                required
                value={tempTarget}
                onChange={(e) => setTempTarget(e.target.value)}
                className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                placeholder="Ex: 800"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] text-slate-950 hover:bg-[#e0bc46] font-extrabold text-xs px-4 py-1.5 rounded-xl transition-colors"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-[#222] text-zinc-400 hover:text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Key Numbers Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 relative z-10">
        
        {/* Faturado Hoje */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-3.5 rounded-xl">
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#D4AF37]" /> Faturado Hoje
          </div>
          <motion.div 
            key={todayRevenue}
            initial={{ scale: 1.05, color: '#FFFFFF' }}
            animate={{ scale: 1, color: '#D4AF37' }}
            transition={{ duration: 0.3 }}
            className="text-xl sm:text-2xl font-black font-mono mt-0.5"
          >
            R$ {todayRevenue.toFixed(2)}
          </motion.div>
        </div>

        {/* Meta Configurada */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-3.5 rounded-xl">
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
            <Target className="w-3 h-3 text-zinc-400" /> Objetivo Diário
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">
            R$ {dailyRevenueTarget.toFixed(2)}
          </div>
        </div>

        {/* Quanto Falta / Superávit */}
        <div className={`bg-[#141414] border p-3.5 rounded-xl ${
          isGoalReached ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-[#2A2A2A]'
        }`}>
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
            {isGoalReached ? (
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            ) : (
              <Zap className="w-3 h-3 text-amber-400" />
            )}
            {isGoalReached ? 'Superávit Obtido' : 'Falta Para a Meta'}
          </div>
          <div className={`text-xl sm:text-2xl font-black font-mono mt-0.5 ${
            isGoalReached ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {isGoalReached 
              ? `+ R$ ${(todayRevenue - dailyRevenueTarget).toFixed(2)}`
              : `R$ ${remainingAmount.toFixed(2)}`
            }
          </div>
        </div>

      </div>

      {/* Visual Progress Bar Section */}
      <div className="space-y-2 mb-4 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
            Progresso do Faturamento
          </span>
          <span className="font-mono font-black text-[#D4AF37] text-sm flex items-center gap-1">
            {percentage}%
          </span>
        </div>

        {/* Animated Track */}
        <div className="w-full h-4 bg-[#0A0A0A] rounded-full overflow-hidden border border-[#2A2A2A] p-0.5 relative shadow-inner">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: `${Math.max(3, percentage)}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full relative ${
              isGoalReached 
                ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/30' 
                : 'bg-gradient-to-r from-[#B38F24] via-[#D4AF37] to-[#F3E5AB] shadow-lg shadow-[#D4AF37]/20'
            }`}
          >
            {/* Shimmer overlay effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
            />
          </motion.div>
        </div>

        {/* Milestone Tick Marks */}
        <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-600 px-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span className={isGoalReached ? 'text-emerald-400 font-extrabold flex items-center gap-0.5' : 'text-zinc-500'}>
            100% (Meta)
          </span>
        </div>
      </div>

      {/* 🚀 Next Best Action (Assistente Inteligente) */}
      <div className="bg-gradient-to-r from-[#1E1B10] via-[#1A1812] to-[#141418] border border-[#3D3215] rounded-xl p-4 mb-4 relative z-10 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Rocket className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                  🚀 Próxima Melhor Ação (Assistente Pro)
                </span>
              </div>
              <p className="text-xs text-zinc-200 font-bold mt-0.5">
                {emptySlots > 0 ? (
                  <>
                    Você tem <span className="text-amber-400 font-black">{emptySlots} horários vazios</span> hoje. Preencher esses horários gera aproximadamente <span className="text-emerald-400 font-black font-mono">R$ {potentialExtraRevenue.toFixed(2)}</span>.
                  </>
                ) : (
                  <>
                    Agenda 100% lotada! Todos os horários de hoje foram preenchidos.
                  </>
                )}
              </p>
            </div>
          </div>

          {emptySlots > 0 && (
            <button
              onClick={handleSendInvite}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md flex-shrink-0 ${
                inviteSent
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-[#D4AF37] hover:bg-[#e2bd44] text-slate-950 shadow-[#D4AF37]/20'
              }`}
            >
              {inviteSent ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Convites Enviados!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Enviar Convite</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 📊 Ocupação do Dia & Projeção */}
      <div className="bg-[#141417] border border-[#26262E] rounded-xl p-3.5 mb-4 relative z-10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-extrabold text-white uppercase text-[11px] tracking-wider">
              Ocupação da Agenda Hoje
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs font-bold">
            <span className="text-zinc-400">
              {occupiedSlots}/{totalSlots} Slots
            </span>
            <span className={`px-2 py-0.5 rounded-md font-black ${
              occupancyPercentage >= 80 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {occupancyPercentage}% Ocupado
            </span>
          </div>
        </div>

        {/* Visual Bar Code / ASCII-like occupancy bar */}
        <div className="w-full bg-[#0A0A0C] border border-[#2A2A33] rounded-lg p-1 flex items-center gap-1">
          {Array.from({ length: totalSlots }).map((_, idx) => {
            const isFilled = idx < occupiedSlots;
            return (
              <div 
                key={idx}
                className={`h-2.5 flex-1 rounded-sm transition-all ${
                  isFilled 
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-500/30' 
                    : 'bg-[#22222A] border border-[#33333F]'
                }`}
                title={`Horário ${idx + 1}: ${isFilled ? 'Ocupado' : 'Livre'}`}
              />
            );
          })}
        </div>

        {/* Projeção vs Meta Header */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-[#22222A]">
          <div className="flex items-center gap-1">
            <span>Meta:</span>
            <strong className="text-white font-mono">R$ {dailyRevenueTarget.toFixed(2)}</strong>
          </div>
          <div className="flex items-center gap-1">
            <span>Projeção (Com Agendamentos):</span>
            <strong className="text-[#D4AF37] font-mono">R$ {projectedRevenueToday.toFixed(2)}</strong>
          </div>
        </div>
      </div>

    </div>
  );
};

