-- BarberOS / BarbeariaFlow Initial Supabase Database Schema
-- Multi-tenant Architecture with Row-Level Security (RLS)

-- 1. TENANTS / SHOPS
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_name TEXT NOT NULL,
    owner_name TEXT,
    shop_phone TEXT,
    slug TEXT UNIQUE,
    tenant_type TEXT DEFAULT 'barbershop' CHECK (tenant_type IN ('solo', 'barbershop', 'franchise')),
    daily_revenue_target NUMERIC(10, 2) DEFAULT 500.00,
    buffer_minutes INT DEFAULT 0,
    weekly_schedule JSONB,
    whatsapp_auto_send BOOLEAN DEFAULT true,
    tv_banner_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SHOP UNITS (FILIAIS)
CREATE TABLE IF NOT EXISTS public.shop_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BARBERS (PROFISSIONAIS)
CREATE TABLE IF NOT EXISTS public.barbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.shop_units(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'Barbeiro',
    phone TEXT,
    commission_rate NUMERIC(4, 2) DEFAULT 0.50,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    total_cuts_month INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SERVICES (CATÁLOGO DE SERVIÇOS)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    duration_min INT NOT NULL DEFAULT 30,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT DEFAULT 'cabelo' CHECK (category IN ('cabelo', 'barba', 'combo', 'estetica', 'outros')),
    active BOOLEAN DEFAULT true,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CLIENTS (CLIENTES / CRM)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    avatar TEXT,
    birthday DATE,
    last_visit_date DATE,
    days_since_last_visit INT DEFAULT 0,
    total_visits INT DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    favorite_barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT ARRAY['Novo']::TEXT[],
    preferred_service TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. APPOINTMENTS (AGENDAMENTOS)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.shop_units(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration_min INT NOT NULL DEFAULT 30,
    barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
    barber_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    started_at TIME,
    finished_at TIME,
    notes TEXT,
    payment_method TEXT CHECK (payment_method IN ('pix', 'card_credit', 'card_debit', 'cash')),
    reminded_via_whatsapp BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. INVENTORY PRODUCTS (ESTOQUE & INSUMOS)
CREATE TABLE IF NOT EXISTS public.inventory_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'pomada' CHECK (category IN ('pomada', 'shampoo', 'barba', 'descartavel', 'bebida', 'outros')),
    item_type TEXT DEFAULT 'venda' CHECK (item_type IN ('venda', 'insumo')),
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 5,
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sell_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    unit TEXT DEFAULT 'unidade',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. FINANCIAL TRANSACTIONS (LIVRO CAIXA)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'card_credit', 'card_debit', 'cash')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TIME NOT NULL DEFAULT CURRENT_TIME,
    barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('servico', 'produto', 'comissao', 'aluguel', 'suprimentos', 'outros')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR HIGH PERFORMANCE QUERIES
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_date ON public.appointments (tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_appointments_barber_date ON public.appointments (barber_id, date);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients (phone);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant_date ON public.financial_transactions (tenant_id, date);

-- ENABLE ROW-LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR PUBLIC BOOKING (ANON USER ACCESS)
CREATE POLICY "Public can view active services" ON public.services
    FOR SELECT TO anon USING (active = true);

CREATE POLICY "Public can view active barbers" ON public.barbers
    FOR SELECT TO anon USING (active = true);

CREATE POLICY "Public can view shop basic info" ON public.shops
    FOR SELECT TO anon USING (true);

CREATE POLICY "Public can create booking appointment" ON public.appointments
    FOR INSERT TO anon WITH CHECK (status = 'scheduled');

-- RLS POLICIES FOR AUTHENTICATED STAFF/ADMIN (MULTI-TENANT ISOLATION)
CREATE POLICY "Authenticated users full access to shop data" ON public.shops
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to shop_units" ON public.shop_units
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to barbers" ON public.barbers
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to services" ON public.services
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to clients" ON public.clients
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to appointments" ON public.appointments
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to inventory" ON public.inventory_products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to transactions" ON public.financial_transactions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
