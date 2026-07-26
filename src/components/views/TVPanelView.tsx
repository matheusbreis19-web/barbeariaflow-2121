import React, { useState, useEffect } from 'react';
import { BarberLogo } from '../BarberLogo';
import { 
  Scissors, 
  Clock, 
  Coffee, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Sparkles,
  UserCheck,
  ChevronRight,
  Tv
} from 'lucide-react';
import { Appointment, ShopConfig } from '../../types';

interface TVPanelViewProps {
  config: ShopConfig;
  appointments: Appointment[];
  onCloseTVPanel?: () => void;
}

export const TVPanelView: React.FC<TVPanelViewProps> = ({ config, appointments }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  // Load and rank available Portuguese voices for Web Speech API
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const availVoices = window.speechSynthesis.getVoices();
      if (!availVoices || availVoices.length === 0) return;

      // Filter for Portuguese or all voices if none found
      const ptVoices = availVoices.filter(
        (v) => v.lang.startsWith('pt') || v.lang.includes('PT') || v.lang.includes('BR')
      );
      
      const listToUse = ptVoices.length > 0 ? ptVoices : availVoices;
      setVoices(listToUse);

      // Score and auto-select the most natural voice available
      const bestVoice = listToUse.reduce((best, current) => {
        const nameLower = current.name.toLowerCase();
        const bestNameLower = best ? best.name.toLowerCase() : '';

        const getScore = (name: string, lang: string) => {
          let score = 0;
          if (lang.includes('BR') || lang.includes('br')) score += 10;
          if (name.includes('google')) score += 30;
          if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 40;
          if (name.includes('francisca') || name.includes('antonio') || name.includes('helena') || name.includes('luciana') || name.includes('daniel')) score += 20;
          return score;
        };

        const currentScore = getScore(nameLower, current.lang);
        const bestScore = best ? getScore(bestNameLower, best.lang) : -1;

        return currentScore > bestScore ? current : best;
      }, listToUse[0]);

      if (bestVoice) {
        setSelectedVoiceURI(bestVoice.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Helper to get active voice object
  const getActiveVoice = (): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;
    return voices.find((v) => v.voiceURI === selectedVoiceURI) || voices[0] || null;
  };

  // Web Audio API Synthesized Bell Chime
  const playCallChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Tone 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.25, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.8);

      // Tone 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.25); // A5
      gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (err) {
      console.warn('AudioContext not supported or blocked:', err);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.92; // Slightly slower pace sounds much more natural
    utterance.pitch = 1.0;

    const voice = getActiveVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playCallChime();
      speakText("Som do painel ativado.");
    }
  };

  const handleCallNextClient = () => {
    if (soundEnabled) {
      playCallChime();
      if (nextApt) {
        setTimeout(() => {
          speakText(`Atenção: ${nextApt.clientName}, favor dirigir-se à cadeira de atendimento para ${nextApt.serviceName}.`);
        }, 1000);
      } else {
        setTimeout(() => {
          speakText("Próximo cliente, favor dirigir-se à recepção.");
        }, 1000);
      }
    }
  };

  const handleTestVoice = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    playCallChime();
    setTimeout(() => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const testVoice = voices.find((v) => v.voiceURI === voiceURI);
      const utterance = new SpeechSynthesisUtterance("Testando a nova voz do painel da barbearia.");
      utterance.lang = 'pt-BR';
      utterance.rate = 0.92;
      if (testVoice) utterance.voice = testVoice;
      window.speechSynthesis.speak(utterance);
    }, 800);
  };

  // Live Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  const inProgressApts = appointments.filter((a) => a.status === 'in_progress');
  const activeApts = inProgressApts.length > 0 
    ? inProgressApts 
    : (appointments.filter((a) => a.status === 'completed').slice(-1));
  
  const scheduledApts = appointments.filter((a) => a.status === 'scheduled');
  const nextApt = scheduledApts[0];
  const upcomingApts = scheduledApts.slice(1, 4);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-8 flex flex-col justify-between select-none font-sans border-4 border-[#D4AF37]/40 rounded-3xl shadow-2xl relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Header & Digital Clock */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
        
        {/* Shop Brand */}
        <div className="flex items-center gap-3">
          <BarberLogo variant="sidebar" />
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider text-white">{config.shopName}</h1>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="text-[#D4AF37] font-black uppercase tracking-widest">● EM ATENDIMENTO</span>
            </div>
          </div>
        </div>

        {/* Big TV Clock */}
        <div className="text-center">
          <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-[#D4AF37] drop-shadow-md">
            {formattedTime}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mt-1">
            {formattedDate}
          </div>
        </div>

        {/* TV Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Voice Selector Dropdown */}
          {voices.length > 0 && (
            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] p-1.5 px-3 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-wider whitespace-nowrap">
                🎙️ VOZ:
              </span>
              <select
                value={selectedVoiceURI}
                onChange={(e) => handleTestVoice(e.target.value)}
                className="bg-transparent text-xs font-bold text-zinc-200 outline-none cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI} className="bg-[#1A1A1A] text-white">
                    {v.name.replace(/(Microsoft|Google|Apple|Portuguese|Brazil|pt-BR)/gi, '').trim() || v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleCallNextClient}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-2xl text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            title="Tocar Sinal Sonoro e Chamar Próximo Cliente por Voz"
          >
            <Volume2 className="w-4 h-4" />
            <span>Chamar no Painel</span>
          </button>

          <button
            onClick={handleToggleSound}
            className={`p-3 border rounded-2xl transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#1A1A1A] border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#222222]'
                : 'bg-[#121215] border-[#2A2A2A] text-zinc-500 hover:text-zinc-300'
            }`}
            title={soundEnabled ? 'Som Ativado (Clique para Desativar)' : 'Som Mudo (Clique para Ativar)'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-[#D4AF37]" /> : <VolumeX className="w-5 h-5 text-zinc-500" />}
          </button>
        </div>

      </div>

      {/* Middle Grid: AGORA & PRÓXIMO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        
        {/* AGORA (Current In-Chair) - 2 Cols */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative min-h-[300px]">
          
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black uppercase tracking-widest text-black bg-[#D4AF37] px-3 py-1 rounded-md">
                AGORA NA CADEIRA {inProgressApts.length > 1 ? `(${inProgressApts.length})` : ''}
              </span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="text-xs font-mono font-bold text-zinc-400">
              {inProgressApts.length === 1
                ? `Barbeiro: ${inProgressApts[0].barberName}`
                : inProgressApts.length > 1
                ? `${inProgressApts.length} Atendimentos Simultâneos`
                : 'Cadeiras Livres'}
            </span>
          </div>

          {activeApts.length === 1 ? (
            <div className="my-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0A0A0A] border-2 border-[#D4AF37] flex items-center justify-center font-bold text-3xl text-[#D4AF37] shadow-xl overflow-hidden flex-shrink-0">
                  <UserCheck className="w-12 h-12 text-[#D4AF37]" />
                </div>

                <div>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                    {activeApts[0].clientName}
                  </h2>
                  <div className="text-xl font-black text-[#D4AF37] uppercase tracking-wider mt-1">
                    {activeApts[0].serviceName}
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-400 mt-1 flex items-center gap-2">
                    <span>Barbeiro: <strong className="text-zinc-200">{activeApts[0].barberName}</strong></span>
                    <span>•</span>
                    <span>Iniciado às {activeApts[0].startedAt || activeApts[0].time}</span>
                  </div>
                </div>
              </div>

              {/* Ring Timer Display */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#D4AF37] border-t-transparent flex flex-col items-center justify-center bg-[#0A0A0A] shadow-2xl p-2 text-center flex-shrink-0">
                <span className="text-sm font-black font-mono text-white tracking-wider">EM ATENDIMENTO</span>
              </div>
            </div>
          ) : activeApts.length > 1 ? (
            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeApts.map((apt, idx) => (
                <div key={apt.id} className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/50 rounded-2xl flex flex-col justify-between gap-3 shadow-xl hover:border-[#D4AF37] transition-all">
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
                    <span className="text-xs font-mono font-black uppercase text-[#D4AF37] tracking-wider">
                      Cadeira 0{idx + 1} • {apt.barberName}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      EM ATENDIMENTO
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#D4AF37]/60 flex items-center justify-center font-bold text-[#D4AF37] flex-shrink-0 shadow-md">
                      <UserCheck className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-white tracking-tight uppercase truncate">
                        {apt.clientName}
                      </h3>
                      <div className="text-xs font-extrabold text-[#D4AF37] uppercase truncate mt-0.5">
                        {apt.serviceName}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-zinc-400 mt-1">
                        Iniciado às {apt.startedAt || apt.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="my-12 text-center text-zinc-500">
              <Scissors className="w-12 h-12 mx-auto stroke-1 mb-2 text-zinc-600" />
              <p className="text-xs font-bold uppercase tracking-wider">Nenhum cliente na cadeira no momento.</p>
            </div>
          )}

          <div className="text-xs text-zinc-500 border-t border-[#2A2A2A] pt-4 flex items-center justify-between font-bold">
            <span>Padrão de Atendimento BarberOS Professional</span>
            <span className="text-[#D4AF37]">
              {inProgressApts.length > 0 ? `${inProgressApts.length} Cadeira(s) Ocupada(s)` : 'Todas as Cadeiras Livres'}
            </span>
          </div>

        </div>

        {/* PRÓXIMO (Next Client) - 1 Col */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
          
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37] bg-[#222222] border border-[#2A2A2A] px-3 py-1 rounded-md">
              PRÓXIMO
            </span>

            {nextApt ? (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-[#D4AF37]/50 flex items-center justify-center font-bold text-[#D4AF37]">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase">{nextApt.clientName}</h3>
                    <div className="text-sm font-extrabold text-[#D4AF37] uppercase tracking-wider mt-0.5">{nextApt.serviceName}</div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span className="label-bold text-zinc-400">Horário Previsto:</span>
                  <span className="font-black text-[#D4AF37] text-base">{nextApt.time}</span>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Fila de espera vazia.
              </div>
            )}
          </div>

          <div className="text-xs text-zinc-500 pt-4 border-t border-[#2A2A2A] font-semibold">
            Aguarde ser chamado pelo painel ou pelo barbeiro.
          </div>

        </div>

      </div>

      {/* Bottom Grid: A SEGUIR & AVISOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* A SEGUIR List (2 Cols) */}
        <div className="md:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-5 shadow-2xl">
          <div className="label-bold mb-3">
            A SEGUIR (FILA)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {upcomingApts.length > 0 ? (
              upcomingApts.map((apt, idx) => (
                <div key={apt.id} className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#2A2A2A] text-xs font-black font-mono text-[#D4AF37] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-extrabold text-white truncate uppercase">{apt.clientName}</div>
                    <div className="text-[11px] text-zinc-400 truncate font-semibold">{apt.serviceName} • {apt.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-xs text-zinc-500 font-bold uppercase py-2">
                Sem mais agendamentos previstos na fila imediata.
              </div>
            )}
          </div>
        </div>

        {/* AVISOS / INTERVALO (1 Col) */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-5 flex items-center gap-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-[#2A2A2A] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="label-bold text-[#D4AF37]">AVISOS</div>
            <div className="text-xs font-extrabold text-white mt-0.5">Intervalo Almoço: 12:00 - 13:00</div>
            <div className="text-[11px] text-zinc-400 font-semibold">Wi-Fi Clientes: BarberOS_VIP</div>
          </div>
        </div>

      </div>

      {/* Motivational Bottom Slogan Banner */}
      <div className="mt-6 bg-[#D4AF37] text-black font-black text-center py-3.5 px-6 rounded-2xl uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 fill-current" />
        <span>{config.tvBannerMessage || 'BOM DIA! FOCO, DISCIPLINA E CONSTÂNCIA!'}</span>
      </div>

    </div>
  );
};
