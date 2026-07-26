import React, { useState } from 'react';
import { Scissors, Lock, Mail, Store, User, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { authService, UserSession } from '../../services/authService';

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form State
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [shopName, setShopName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Status State
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { session, error } = await authService.signIn(email, password);
        if (error) {
          setErrorMsg(error);
        } else if (session) {
          onLoginSuccess(session);
        }
      } else {
        if (!name || !shopName) {
          setErrorMsg('Por favor, informe seu nome e o nome da sua barbearia.');
          setLoading(false);
          return;
        }

        const { session, error } = await authService.signUp(email, password, shopName, name);
        if (error) {
          setErrorMsg(error);
        } else if (session) {
          setSuccessMsg('Conta e Barbearia cadastradas com sucesso! Entrando...');
          setTimeout(() => {
            onLoginSuccess(session);
          }, 1000);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { session } = await authService.signIn('gestor@barbeariaflow.com', '123456');
    setLoading(false);
    if (session) {
      onLoginSuccess(session);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Gold Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Auth Container Card */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <img src="/logo.png" alt="Barbearia Logo" className="w-28 h-auto object-contain drop-shadow-2xl" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Barber<span className="text-[#D4AF37]">OS</span>
            </h1>
            <span className="text-[10px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
              PRO ERP
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-semibold">
            {mode === 'login'
              ? 'Acesse a plataforma de gestão inteligente da sua barbearia'
              : 'Cadastre sua barbearia e comece a gerenciar em 1 minuto'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] text-xs font-black uppercase">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-[#D4AF37] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-[#D4AF37] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Nome da Sua Barbearia *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Ex: Barbearia Viking"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
              E-mail de Acesso *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@barbearia.com"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-10 pr-3 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
              Senha *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer"
          >
            <span>{loading ? 'Processando...' : mode === 'login' ? 'Entrar no Sistema' : 'Criar Minha Barbearia'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

        </form>

        {/* Demo Fast Access Button */}
        <div className="pt-4 border-t border-[#2A2A2A] text-center space-y-3">
          <span className="text-[11px] text-zinc-500 font-bold uppercase block">
            Quer testar primeiro sem cadastrar?
          </span>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] hover:border-[#D4AF37]/50 text-[#D4AF37] py-2.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Entrar como Convidado (Modo Demo)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
