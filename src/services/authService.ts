import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface UserSession {
  id: string;
  email: string;
  role: 'admin' | 'barber';
  shopName?: string;
  name?: string;
}

const translateAuthError = (msg: string): string => {
  if (!msg) return 'Erro ao efetuar autenticação.';
  const lower = msg.toLowerCase();
  
  if (lower.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos. Se você se cadastrou antes das variáveis estarem ativas, por favor clique em "Cadastrar" para vincular sua conta ao banco.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Verifique a caixa de entrada para ativar a conta.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'Este e-mail já está cadastrado. Por favor, faça login na aba "Entrar".';
  }
  if (lower.includes('password should be at least')) {
    return 'A senha deve ter no mínimo 6 caracteres.';
  }
  if (lower.includes('rate limit')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns segundos e tente novamente.';
  }
  return msg;
};

export const authService = {
  // Check active session
  async getCurrentSession(): Promise<UserSession | null> {
    if (!isSupabaseConfigured() || !supabase) {
      const stored = localStorage.getItem('barberos_demo_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
      return null;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) return null;

      const user = session.user;
      return {
        id: user.id,
        email: user.email || '',
        role: (user.user_metadata?.role as 'admin' | 'barber') || 'admin',
        shopName: user.user_metadata?.shopName || 'BarbeariaFlow',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
      };
    } catch {
      return null;
    }
  },

  // Sign In with Email and Password
  async signIn(email: string, pass: string): Promise<{ session: UserSession | null; error: string | null }> {
    // Supabase Auth
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          return { session: null, error: translateAuthError(error.message) };
        }

        if (data.user) {
          const userSession: UserSession = {
            id: data.user.id,
            email: data.user.email || email,
            role: (data.user.user_metadata?.role as 'admin' | 'barber') || 'admin',
            shopName: data.user.user_metadata?.shopName || 'BarbeariaFlow',
            name: data.user.user_metadata?.name || email.split('@')[0],
          };
          return { session: userSession, error: null };
        }
      } catch (err: any) {
        return { session: null, error: translateAuthError(err.message || 'Erro ao efetuar login.') };
      }
    }

    // Local Storage Fallback
    if (email && pass.length >= 4) {
      const demoUser: UserSession = {
        id: `user-${Date.now()}`,
        email,
        role: email.includes('barbeiro') ? 'barber' : 'admin',
        shopName: 'Barbearia do Neguinho',
        name: email.split('@')[0] || 'Gestor BarberOS',
      };
      localStorage.setItem('barberos_demo_user', JSON.stringify(demoUser));
      return { session: demoUser, error: null };
    }

    return { session: null, error: 'Credenciais inválidas. Senha deve ter pelo menos 4 caracteres.' };
  },

  // Sign Up / Register new account
  async signUp(email: string, pass: string, shopName: string, name: string): Promise<{ session: UserSession | null; error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              shopName,
              name,
              role: 'admin',
            },
          },
        });

        if (error) {
          return { session: null, error: translateAuthError(error.message) };
        }

        if (data.user) {
          const userSession: UserSession = {
            id: data.user.id,
            email: data.user.email || email,
            role: 'admin',
            shopName,
            name,
          };
          return { session: userSession, error: null };
        }
      } catch (err: any) {
        return { session: null, error: translateAuthError(err.message || 'Erro ao realizar cadastro.') };
      }
    }

    // Local Storage Fallback
    const demoUser: UserSession = {
      id: `user-${Date.now()}`,
      email,
      role: 'admin',
      shopName,
      name,
    };
    localStorage.setItem('barberos_demo_user', JSON.stringify(demoUser));
    return { session: demoUser, error: null };
  },

  // Sign Out
  async signOut(): Promise<void> {
    localStorage.removeItem('barberos_demo_user');
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout failed:', err);
      }
    }
  },
};
