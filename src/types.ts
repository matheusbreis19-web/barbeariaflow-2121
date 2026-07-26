export type TenantType = 'solo' | 'barbershop' | 'franchise';

export interface ShopUnit {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  active: boolean;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  commissionRate: number; // e.g. 0.50 for 50%
  active: boolean;
  rating: number;
  totalCutsMonth: number;
  unitId?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  category: 'cabelo' | 'barba' | 'combo' | 'estetica' | 'outros';
  active: boolean;
  order?: number;
  description?: string;
}

export type AppointmentStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  price: number;
  durationMin: number;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  startedAt?: string; // HH:MM
  finishedAt?: string; // HH:MM
  notes?: string;
  paymentMethod?: 'pix' | 'card_credit' | 'card_debit' | 'cash';
  unitId?: string;
  remindedViaWhatsapp?: boolean;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  birthday?: string;
  lastVisitDate?: string;
  daysSinceLastVisit: number;
  totalVisits: number;
  totalSpent: number;
  favoriteBarberId?: string;
  favoriteBarberName?: string;
  tags: ('VIP' | 'Em Risco' | 'Frequente' | 'Novo' | 'Sumiu')[];
  preferredService?: string;
  notes?: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  category: 'pomada' | 'shampoo' | 'barba' | 'descartavel' | 'bebida' | 'outros';
  itemType?: 'venda' | 'insumo'; // Venda de balcão ou Insumo interno
  stock: number;
  minStock: number;
  costPrice: number;
  sellPrice: number;
  unit: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  paymentMethod: 'pix' | 'card_credit' | 'card_debit' | 'cash';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  barberId?: string;
  appointmentId?: string;
  category: 'servico' | 'produto' | 'comissao' | 'aluguel' | 'suprimentos' | 'outros';
}

export interface SmartGap {
  id: string;
  startTime: string;
  endTime: string;
  durationMin: number;
  barberId: string;
  barberName: string;
}

export interface WaitingListEntry {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  preferredTimeRange: string;
  createdDate: string;
}

export interface ShopConfig {
  shopName: string;
  ownerName?: string;
  shopPhone?: string;
  slug?: string;
  tenantType: TenantType;
  currentUnitId: string;
  dailyRevenueTarget: number;
  bufferMinutes?: number; // 0, 5, 10, 15 min buffer between services
  weeklySchedule: {
    dayOfWeek: number; // 0=Dom, 1=Seg...
    dayName: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
    breakStart?: string;
    breakEnd?: string;
  }[];
  whatsappAutoSend: boolean;
  tvBannerMessage: string;
}
