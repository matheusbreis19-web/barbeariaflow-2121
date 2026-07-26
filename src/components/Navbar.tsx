import React from 'react';
import { 
  Scissors, 
  Tv, 
  ExternalLink, 
  Plus, 
  Building2, 
  UserCheck, 
  TrendingUp, 
  Sparkles,
  BarChart2,
  Calendar,
  Layers
} from 'lucide-react';
import { ShopConfig, ShopUnit, TenantType } from '../types';

interface NavbarProps {
  config: ShopConfig;
  units: ShopUnit[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewAppointment: () => void;
  onOpenPublicBooking: () => void;
  onOpenTVPanel: () => void;
  onConfigChange: (newConfig: ShopConfig) => void;
  todayRevenue: number;
  revenueTarget: number;
  inProgressCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  units,
  activeTab,
  setActiveTab,
  onOpenNewAppointment,
  onOpenPublicBooking,
  onOpenTVPanel,
  onConfigChange,
  todayRevenue,
  revenueTarget,
  inProgressCount,
}) => {
  const targetPct = Math.min(100, Math.round((todayRevenue / (revenueTarget || 1)) * 100));

  return (
    <header className="bg-[#141414] border-b border-[#2A2A2A] text-white sticky top-0 z-40 shadow-2xl w-full">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 overflow-hidden">
          
          {/* Left: System Status / Quick Info (No duplicate logo) */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-xs font-black text-zinc-200 uppercase tracking-wider font-mono">
                SISTEMA OPERACIONAL
              </span>
            </div>
          </div>

          {/* Middle Financial & Tenant Context Controls */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-1.5 px-2.5 min-w-0">
            
            {/* Today Revenue Pill */}
            <div className="flex items-center gap-2 text-xs pr-2.5 border-r border-[#2A2A2A] flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider text-zinc-500">
                  Meta ({targetPct}%)
                </div>
                <div className="font-extrabold text-white text-xs flex items-center gap-1 font-mono">
                  <span className="text-[#D4AF37]">R${todayRevenue}</span>
                  <span className="text-zinc-500 font-normal text-[10px]">/ R${revenueTarget}</span>
                </div>
              </div>
            </div>

            {/* Active Chair Counter */}
            <div className="hidden xl:flex items-center gap-2 text-xs pr-2.5 border-r border-[#2A2A2A] flex-shrink-0">
              <div className={`w-2 h-2 rounded-full ${inProgressCount > 0 ? 'bg-[#D4AF37] animate-pulse' : 'bg-zinc-600'}`} />
              <span className="text-zinc-300 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                {inProgressCount} na cadeira
              </span>
            </div>

            {/* Tenant Mode Selector */}
            <div className="flex items-center gap-1 min-w-0">
              <Layers className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              <select
                value={config.tenantType}
                onChange={(e) => onConfigChange({ ...config, tenantType: e.target.value as TenantType })}
                className="bg-[#0A0A0A] text-xs text-zinc-200 border border-[#2A2A2A] rounded-lg px-1.5 py-1 focus:outline-none focus:border-[#D4AF37] font-bold cursor-pointer max-w-[130px] xl:max-w-[160px] truncate"
                title="Perfil de Uso"
              >
                <option value="solo">1: Autônomo</option>
                <option value="barbershop">2: Barbearia</option>
                <option value="franchise">3: Rede/Franquia</option>
              </select>
            </div>

            {/* Unit Switcher if franchise/barbershop */}
            {config.tenantType !== 'solo' && (
              <div className="flex items-center gap-1 border-l border-[#2A2A2A] pl-2.5 min-w-0">
                <Building2 className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <select
                  value={config.currentUnitId}
                  onChange={(e) => onConfigChange({ ...config, currentUnitId: e.target.value })}
                  className="bg-[#0A0A0A] text-xs text-zinc-200 border border-[#2A2A2A] rounded-lg px-1.5 py-1 focus:outline-none focus:border-[#D4AF37] font-bold cursor-pointer max-w-[130px] xl:max-w-[160px] truncate"
                  title="Unidade Ativa"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Quick TV Panel Toggle */}
            <button
              onClick={onOpenTVPanel}
              className="bg-[#1A1A1A] hover:bg-[#222222] text-zinc-200 hover:text-white border border-[#2A2A2A] text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              title="Abrir Modo Painel TV"
            >
              <Tv className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden md:inline text-[11px]">Painel TV</span>
            </button>

            {/* Booking Link Simulation */}
            <button
              onClick={onOpenPublicBooking}
              className="bg-[#1A1A1A] hover:bg-[#222222] text-zinc-200 hover:text-white border border-[#2A2A2A] text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              title="Ver link de agendamento do cliente"
            >
              <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline text-[11px]">Link Cliente</span>
            </button>

            {/* Primary Action Button: Novo Agendamento */}
            <button
              onClick={onOpenNewAppointment}
              className="btn-gold text-xs px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap font-extrabold"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Novo Horário</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
