import React, { useState } from 'react';
import { BarberLogo } from './BarberLogo';
import { 
  Calendar, 
  Scissors, 
  Tv, 
  Zap, 
  Users, 
  Wallet, 
  BarChart3, 
  Package, 
  MessageSquare, 
  Sparkles,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LayoutDashboard
} from 'lucide-react';

import { UserSession } from '../services/authService';
import { LogOut, UserCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  smartGapsCount: number;
  atRiskClientsCount: number;
  lowStockCount: number;
  currentUser?: UserSession | null;
  onLogout?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number | null;
  badgeColor?: string;
}

interface NavGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  smartGapsCount,
  atRiskClientsCount,
  lowStockCount,
  currentUser,
  onLogout,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    operacao: true,
    gestao: true,
    inteligencia: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'operacao',
      title: 'Operação',
      icon: LayoutDashboard,
      items: [
        { id: 'agenda', label: 'Hoje (Agenda)', icon: Calendar },
        { id: 'atendimento', label: 'Atendimento', icon: Scissors },
        { 
          id: 'crm', 
          label: 'Clientes (CRM)', 
          icon: Users, 
          badge: atRiskClientsCount > 0 ? atRiskClientsCount : null, 
          badgeColor: 'bg-rose-500 text-white font-black' 
        },
      ],
    },
    {
      id: 'gestao',
      title: 'Gestão',
      icon: Package,
      items: [
        { id: 'caixa', label: 'Caixa & Metas', icon: Wallet },
        { id: 'equipe', label: 'Equipe & Comissão', icon: BarChart3 },
        { 
          id: 'estoque', 
          label: 'Estoque & Insumos', 
          icon: Package, 
          badge: lowStockCount > 0 ? lowStockCount : null, 
          badgeColor: 'bg-orange-500 text-slate-950 font-black' 
        },
        { id: 'servicos', label: 'Serviços & Regras', icon: Tag },
        { id: 'tv_panel', label: 'Painel TV (Salão)', icon: Tv, badge: 'LIVE', badgeColor: 'bg-[#D4AF37] text-slate-950 font-black' },
      ],
    },
    {
      id: 'inteligencia',
      title: 'Inteligência',
      icon: Sparkles,
      items: [
        { id: 'ia_insights', label: 'Insights com IA', icon: Sparkles, badge: 'IA', badgeColor: 'bg-purple-500/30 text-purple-300 border border-purple-500/40' },
        { id: 'whatsapp', label: 'Automações & WhatsApp', icon: MessageSquare },
        { 
          id: 'encaixe', 
          label: 'Encaixe Inteligente', 
          icon: Zap, 
          badge: smartGapsCount > 0 ? smartGapsCount : null, 
          badgeColor: 'bg-emerald-400 text-slate-950 font-black' 
        },
      ],
    },
  ];

  return (
    <aside
      className={`relative bg-[#121215] border-b md:border-b-0 md:border-r border-[#26262E] text-zinc-300 flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col justify-between ${
        isCollapsed ? 'w-full md:w-20' : 'w-full md:w-64'
      }`}
    >
      {/* Header with App Logo, Brand & Pro System Card */}
      <div className={`border-b border-[#26262E] relative flex flex-col ${
        isCollapsed ? 'p-3 items-center min-h-[65px]' : 'p-4'
      }`}>
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className="flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            title="Ir para a Tela Inicial (Agenda)"
          >
            <BarberLogo variant="icon" size="sm" />
          </button>
        ) : (
          <div className="w-full space-y-3">
            {/* Top Brand Block */}
            <BarberLogo variant="header" shopName="Barbearia do Neguinho" />

            {/* Pro System Card / Button */}
            <button
              type="button"
              onClick={() => setActiveTab('agenda')}
              className="w-full p-2.5 rounded-2xl bg-[#0D0D10] border border-[#262630] hover:border-[#C5A059]/60 transition-all flex items-center justify-between group cursor-pointer shadow-md text-left"
              title="BarbeariaFlow Pro System"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Circle badge with gold outline and vinyl/aperture icon inside */}
                <div className="w-9 h-9 rounded-full border border-[#C5A059] bg-[#14141A] flex items-center justify-center text-[#C5A059] shadow-inner flex-shrink-0">
                  <div className="w-5 h-5 rounded-full border border-[#C5A059] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-[#F3E5AB] tracking-wider uppercase truncate leading-tight">
                    BARBEARIAFLOW
                  </span>
                  <span className="text-[9px] font-extrabold text-[#C5A059] tracking-[0.2em] uppercase truncate leading-tight">
                    PRO SYSTEM
                  </span>
                </div>
              </div>
              
              <div className="w-6 h-6 rounded-full border border-[#C5A059]/60 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-black transition-all flex-shrink-0">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}

        {/* Desktop Collapse Toggle floating on the right border rail */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden md:flex items-center justify-center p-1 rounded-full bg-[#202026] hover:bg-[#2A2A33] border border-[#33333F] text-zinc-300 transition-all cursor-pointer shadow-lg z-30 ${
            isCollapsed ? 'absolute -right-3 top-5' : 'absolute -right-3 top-4'
          }`}
          title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 stroke-[3]" />
          )}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {navGroups.map((group) => {
          const isGroupOpen = openGroups[group.id] !== false;

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Title Header (Expanded) */}
              {!isCollapsed ? (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <span>{group.title}</span>
                  {isGroupOpen ? (
                    <ChevronUp className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 stroke-[3]" />
                  )}
                </button>
              ) : (
                <div className="border-b border-[#26262E] my-2 w-8 mx-auto" />
              )}

              {/* Group Items */}
              {(isCollapsed || isGroupOpen) && (
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center rounded-2xl text-xs font-bold transition-all uppercase tracking-wide cursor-pointer ${
                            isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                          } ${
                            isActive
                              ? 'bg-[#24242C] text-white border border-[#3B3B48] shadow-lg shadow-black/40 font-black'
                              : 'hover:bg-[#1A1A20] text-zinc-400 hover:text-white border border-transparent'
                          }`}
                        >
                          <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${
                                isActive ? 'text-[#D4AF37] stroke-[2.5]' : 'text-zinc-400'
                              }`}
                            />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </div>

                          {/* Badge Pill */}
                          {item.badge && !isCollapsed && (
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                item.badgeColor || 'bg-[#2A2A33] text-zinc-200'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          {/* Badge indicator in collapsed mode */}
                          {item.badge && isCollapsed && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37]" />
                          )}
                        </button>

                        {/* Floating Tooltip in Collapsed Mode */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 bg-[#202026] text-white text-xs font-black uppercase px-3 py-1.5 rounded-xl border border-[#353540] shadow-2xl z-50 whitespace-nowrap pointer-events-none">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${item.badgeColor || 'bg-slate-800'}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info & User Profile */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-[#26262E] space-y-2">
          {currentUser && (
            <div className="bg-[#1A1A20] border border-[#2A2A35] rounded-2xl p-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-black text-xs flex-shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-white truncate leading-tight">
                    {currentUser.name || 'Usuário'}
                  </span>
                  <span className="text-[10px] font-bold text-[#D4AF37] truncate leading-tight uppercase">
                    {currentUser.role === 'admin' ? 'Dono / Gestor' : 'Barbeiro'}
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer flex-shrink-0"
                  title="Sair do Sistema"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <div className="bg-[#0D0D10] border border-[#262630] rounded-xl p-2.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 text-white font-black uppercase text-[10px] tracking-wider">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Sessão Autenticada</span>
            </div>
          </div>
        </div>
      ) : (
        currentUser && onLogout && (
          <div className="p-2 border-t border-[#26262E] flex justify-center">
            <button
              onClick={onLogout}
              className="p-2 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
              title="Sair do Sistema"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )
      )}
    </aside>
  );
};
