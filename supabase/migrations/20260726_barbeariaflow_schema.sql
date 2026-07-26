-- ====================================================
-- BarberiaFlow - Extensão e Atualização do Schema Supabase
-- Compatível com o projeto barbeariaflow em https://bqlkfimfjwzhlbtwydih.supabase.co
-- ====================================================

-- 1. TABELA DE PERFIS / BARBEARIAS (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  nome_barbearia TEXT NOT NULL,
  nome_barbeiro TEXT NOT NULL,
  telefone TEXT,
  horarios_semana JSONB DEFAULT '{
    "1": { "ativo": true, "abertura": "08:00", "fechamento": "19:00", "intervalos": [{"inicio": "12:00", "fim": "13:00"}] },
    "2": { "ativo": true, "abertura": "08:00", "fechamento": "19:00", "intervalos": [{"inicio": "12:00", "fim": "13:00"}] },
    "3": { "ativo": true, "abertura": "08:00", "fechamento": "19:00", "intervalos": [{"inicio": "12:00", "fim": "13:00"}] },
    "4": { "ativo": true, "abertura": "08:00", "fechamento": "19:00", "intervalos": [{"inicio": "12:00", "fim": "13:00"}] },
    "5": { "ativo": true, "abertura": "08:00", "fechamento": "19:00", "intervalos": [{"inicio": "12:00", "fim": "13:00"}] },
    "6": { "ativo": true, "abertura": "08:00", "fechamento": "14:00", "intervalos": [] },
    "0": { "ativo": false }
  }'::jsonb,
  intervalo_entre_servicos INTEGER DEFAULT 0,
  meta_diaria NUMERIC DEFAULT 500.00,
  dias_bloqueados JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE SERVIÇOS (SERVICOS)
CREATE TABLE IF NOT EXISTS public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  duracao_minutos INTEGER NOT NULL,
  categoria TEXT DEFAULT 'cabelo',
  ativo BOOLEAN DEFAULT TRUE,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE BARBEIROS / EQUIPE (BARBERS)
CREATE TABLE IF NOT EXISTS public.barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'Barbeiro',
  phone TEXT,
  commission_rate NUMERIC(4, 2) DEFAULT 0.50,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  total_cuts_month INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE AGENDAMENTOS (AGENDAMENTOS)
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  servico_id UUID REFERENCES public.servicos(id) ON DELETE SET NULL,
  barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'em_atendimento', 'concluido', 'no_show', 'cancelado')),
  is_encaixe BOOLEAN DEFAULT FALSE,
  forma_pagamento TEXT CHECK (forma_pagamento IN ('pix', 'card_credit', 'card_debit', 'cash')),
  reminded_via_whatsapp BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE ESTOQUE DE PRODUTOS (INVENTORY_PRODUCTS)
CREATE TABLE IF NOT EXISTS public.inventory_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'pomada',
  item_type TEXT DEFAULT 'venda',
  stock INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 5,
  cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  sell_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  unit TEXT DEFAULT 'unidade',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE LIVRO CAIXA / TRANSAÇÕES (FINANCIAL_TRANSACTIONS)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'card_credit', 'card_debit', 'cash')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL DEFAULT CURRENT_TIME,
  barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('servico', 'produto', 'comissao', 'aluguel', 'suprimentos', 'outros')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES DE ALTA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_agendamentos_profile_data ON public.agendamentos(profile_id, data_inicio);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON public.agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_servicos_profile ON public.servicos(profile_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS (PROFILES)
DO $$ BEGIN
  CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public can view profiles by slug" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- POLÍTICAS RLS (SERVICOS)
DO $$ BEGIN
  CREATE POLICY "Public can view active servicos" ON public.servicos FOR SELECT USING (ativo = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Owner can manage servicos" ON public.servicos FOR ALL USING (profile_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- POLÍTICAS RLS (AGENDAMENTOS)
DO $$ BEGIN
  CREATE POLICY "Public can insert agendamentos" ON public.agendamentos FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Owner can manage agendamentos" ON public.agendamentos FOR ALL USING (profile_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RPC FUNCTION: GET PAINEL DATA (Para o agendamento público por slug)
CREATE OR REPLACE FUNCTION get_painel_data(p_slug TEXT, p_inicio TIMESTAMPTZ, p_fim TIMESTAMPTZ)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_id UUID;
  v_agendamentos JSONB;
BEGIN
  SELECT id INTO v_profile_id
  FROM profiles
  WHERE slug = p_slug;

  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'Barbearia não encontrada';
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', a.id,
        'cliente_nome', a.cliente_nome,
        'status', a.status,
        'data_inicio', a.data_inicio,
        'servico_id', a.servico_id,
        'is_encaixe', a.is_encaixe,
        'servicos', jsonb_build_object(
           'nome', COALESCE(s.nome, 'Corte'),
           'valor', COALESCE(s.valor, 0),
           'duracao_minutos', COALESCE(s.duracao_minutos, 30)
        )
      ) ORDER BY a.data_inicio ASC
    ), 
    '[]'::jsonb
  ) INTO v_agendamentos
  FROM agendamentos a
  LEFT JOIN servicos s ON a.servico_id = s.id
  WHERE a.profile_id = v_profile_id
    AND a.status IN ('agendado', 'em_atendimento')
    AND a.data_inicio >= p_inicio
    AND a.data_inicio < p_fim;

  RETURN COALESCE(v_agendamentos, '[]'::jsonb);
END;
$$;
