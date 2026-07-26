import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  ShopConfig, 
  ShopUnit, 
  Barber, 
  ServiceItem, 
  Appointment, 
  ClientProfile, 
  InventoryProduct, 
  FinancialTransaction,
  AppointmentStatus 
} from '../types';
import { 
  initialShopConfig, 
  initialUnits, 
  initialBarbers, 
  initialServices, 
  initialAppointments, 
  initialClients, 
  initialProducts, 
  initialTransactions 
} from '../mockData';

export const dbService = {
  // Config
  async getShopConfig(): Promise<ShopConfig> {
    if (!isSupabaseConfigured() || !supabase) return initialShopConfig;

    try {
      const { data, error } = await supabase.from('shops').select('*').limit(1).single();
      if (error || !data) return initialShopConfig;

      return {
        shopName: data.shop_name,
        ownerName: data.owner_name,
        shopPhone: data.shop_phone,
        slug: data.slug,
        tenantType: data.tenant_type,
        currentUnitId: initialShopConfig.currentUnitId,
        dailyRevenueTarget: Number(data.daily_revenue_target) || 500,
        bufferMinutes: data.buffer_minutes || 0,
        weeklySchedule: data.weekly_schedule || initialShopConfig.weeklySchedule,
        whatsappAutoSend: data.whatsapp_auto_send ?? true,
        tvBannerMessage: data.tv_banner_message || initialShopConfig.tvBannerMessage
      };
    } catch {
      return initialShopConfig;
    }
  },

  // Units
  async getUnits(): Promise<ShopUnit[]> {
    if (!isSupabaseConfigured() || !supabase) return initialUnits;

    try {
      const { data, error } = await supabase.from('shop_units').select('*');
      if (error || !data || data.length === 0) return initialUnits;

      return data.map(u => ({
        id: u.id,
        name: u.name,
        city: u.city,
        address: u.address,
        phone: u.phone,
        active: u.active
      }));
    } catch {
      return initialUnits;
    }
  },

  // Barbers
  async getBarbers(): Promise<Barber[]> {
    if (!isSupabaseConfigured() || !supabase) return initialBarbers;

    try {
      const { data, error } = await supabase.from('barbers').select('*');
      if (error || !data || data.length === 0) return initialBarbers;

      return data.map(b => ({
        id: b.id,
        name: b.name,
        avatar: b.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: b.role,
        phone: b.phone,
        commissionRate: Number(b.commission_rate) || 0.5,
        active: b.active,
        rating: Number(b.rating) || 5.0,
        totalCutsMonth: b.total_cuts_month || 0,
        unitId: b.unit_id
      }));
    } catch {
      return initialBarbers;
    }
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    if (!isSupabaseConfigured() || !supabase) return initialServices;

    try {
      const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return initialServices;

      return data.map(s => ({
        id: s.id,
        name: s.name,
        durationMin: s.duration_min,
        price: Number(s.price),
        category: s.category,
        active: s.active,
        order: s.display_order,
        description: s.description
      }));
    } catch {
      return initialServices;
    }
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    if (!isSupabaseConfigured() || !supabase) return initialAppointments;

    try {
      const { data, error } = await supabase.from('appointments').select('*').order('date', { ascending: false });
      if (error || !data || data.length === 0) return initialAppointments;

      return data.map(a => ({
        id: a.id,
        clientName: a.client_name,
        clientPhone: a.client_phone,
        serviceId: a.service_id,
        serviceName: a.service_name,
        price: Number(a.price),
        durationMin: a.duration_min,
        barberId: a.barber_id,
        barberName: a.barber_name,
        date: a.date,
        time: a.time,
        status: a.status as AppointmentStatus,
        startedAt: a.started_at,
        finishedAt: a.finished_at,
        notes: a.notes,
        paymentMethod: a.payment_method,
        unitId: a.unit_id,
        remindedViaWhatsapp: a.reminded_via_whatsapp
      }));
    } catch {
      return initialAppointments;
    }
  },

  // Clients
  async getClients(): Promise<ClientProfile[]> {
    if (!isSupabaseConfigured() || !supabase) return initialClients;

    try {
      const { data, error } = await supabase.from('clients').select('*');
      if (error || !data || data.length === 0) return initialClients;

      return data.map(c => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        avatar: c.avatar,
        birthday: c.birthday,
        lastVisitDate: c.last_visit_date,
        daysSinceLastVisit: c.days_since_last_visit || 0,
        totalVisits: c.total_visits || 0,
        totalSpent: Number(c.total_spent) || 0,
        favoriteBarberId: c.favorite_barber_id,
        tags: c.tags || ['Novo'],
        preferredService: c.preferred_service,
        notes: c.notes
      }));
    } catch {
      return initialClients;
    }
  },

  // Products
  async getProducts(): Promise<InventoryProduct[]> {
    if (!isSupabaseConfigured() || !supabase) return initialProducts;

    try {
      const { data, error } = await supabase.from('inventory_products').select('*');
      if (error || !data || data.length === 0) return initialProducts;

      return data.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        itemType: p.item_type,
        stock: p.stock,
        minStock: p.min_stock,
        costPrice: Number(p.cost_price),
        sellPrice: Number(p.sell_price),
        unit: p.unit
      }));
    } catch {
      return initialProducts;
    }
  },

  // Transactions
  async getTransactions(): Promise<FinancialTransaction[]> {
    if (!isSupabaseConfigured() || !supabase) return initialTransactions;

    try {
      const { data, error } = await supabase.from('financial_transactions').select('*').order('date', { ascending: false });
      if (error || !data || data.length === 0) return initialTransactions;

      return data.map(t => ({
        id: t.id,
        type: t.type,
        description: t.description,
        amount: Number(t.amount),
        paymentMethod: t.payment_method,
        date: t.date,
        time: t.time,
        barberId: t.barber_id,
        appointmentId: t.appointment_id,
        category: t.category
      }));
    } catch {
      return initialTransactions;
    }
  },

  // Mutation: Create Appointment
  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newId = `apt-${Date.now()}`;
    const newApt: Appointment = { ...appointment, id: newId };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('appointments').insert({
          client_name: appointment.clientName,
          client_phone: appointment.clientPhone,
          service_id: appointment.serviceId || null,
          service_name: appointment.serviceName,
          price: appointment.price,
          duration_min: appointment.durationMin,
          barber_id: appointment.barberId || null,
          barber_name: appointment.barberName,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          notes: appointment.notes
        });
      } catch (err) {
        console.warn('Supabase insert failed, local fallback used:', err);
      }
    }

    return newApt;
  }
};
