import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface UserSession {
  id: string;
  email: string;
  role: 'admin' | 'barber';
  shopName?: string;
  name?: string;
}

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
          return { session: null, error: error.message };
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
        return { session: null, error: err.message || 'Erro ao efetuar login.' };
      }
    }

    // Demo Mode fallback
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
          return { session: null, error: error.message };
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
        return { session: null, error: err.message || 'Erro ao realizar cadastro.' };
      }
    }

    // Demo Mode fallback
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
