import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  initialUnits, 
  initialBarbers, 
  initialServices, 
  initialAppointments, 
  initialClients, 
  initialProducts, 
  initialTransactions, 
  initialShopConfig 
} from './mockData';
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
} from './types';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AgendaView } from './components/views/AgendaView';
import { AtendimentoView } from './components/views/AtendimentoView';
import { TVPanelView } from './components/views/TVPanelView';
import { EncaixeInteligenteView } from './components/views/EncaixeInteligenteView';
import { CRMView } from './components/views/CRMView';
import { CaixaView } from './components/views/CaixaView';
import { EquipeView } from './components/views/EquipeView';
import { EstoqueView } from './components/views/EstoqueView';
import { WhatsAppView } from './components/views/WhatsAppView';
import { IAInsightsView } from './components/views/IAInsightsView';
import { ServicosView } from './components/views/ServicosView';
import { ConfigHorariosView } from './components/views/ConfigHorariosView';
import { PublicBookingModal } from './components/modals/PublicBookingModal';
import { NewAppointmentModal } from './components/modals/NewAppointmentModal';
import { dbService } from './services/dbService';

export default function App() {
  const [config, setConfig] = useState<ShopConfig>(initialShopConfig);
  const [units] = useState<ShopUnit[]>(initialUnits);
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [clients, setClients] = useState<ClientProfile[]>(initialClients);
  const [products, setProducts] = useState<InventoryProduct[]>(initialProducts);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions);

  const [activeTab, setActiveTab] = useState<string>('agenda');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('all');

  const [showNewAptModal, setShowNewAptModal] = useState<boolean>(false);
  const [showPublicBookingModal, setShowPublicBookingModal] = useState<boolean>(false);
  const [showTVPanel, setShowTVPanel] = useState<boolean>(false);

  // Load data from dbService (Supabase with mock fallback)
  useEffect(() => {
    async function loadData() {
      try {
        const [
          fetchedConfig,
          fetchedUnits,
          fetchedBarbers,
          fetchedServices,
          fetchedAppointments,
          fetchedClients,
          fetchedProducts,
          fetchedTransactions
        ] = await Promise.all([
          dbService.getShopConfig(),
          dbService.getUnits(),
          dbService.getBarbers(),
          dbService.getServices(),
          dbService.getAppointments(),
          dbService.getClients(),
          dbService.getProducts(),
          dbService.getTransactions()
        ]);

        if (fetchedConfig) setConfig(fetchedConfig);
        if (fetchedBarbers.length > 0) setBarbers(fetchedBarbers);
        if (fetchedServices.length > 0) setServices(fetchedServices);
        if (fetchedAppointments.length > 0) setAppointments(fetchedAppointments);
        if (fetchedClients.length > 0) setClients(fetchedClients);
        if (fetchedProducts.length > 0) setProducts(fetchedProducts);
        if (fetchedTransactions.length > 0) setTransactions(fetchedTransactions);
      } catch (err) {
        console.error("Error loading data from dbService:", err);
      }
    }
    loadData();
  }, []);

  // Global ESC Key Handler to close modals or return to main agenda
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showTVPanel) {
          setShowTVPanel(false);
        } else if (showNewAptModal) {
          setShowNewAptModal(false);
        } else if (showPublicBookingModal) {
          setShowPublicBookingModal(false);
        } else if (activeTab !== 'agenda') {
          // If on secondary view like TV panel tab or encaixe, return to agenda
          if (activeTab === 'tv_panel' || activeTab === 'encaixe') {
            setActiveTab('agenda');
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTVPanel, showNewAptModal, showPublicBookingModal, activeTab]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Derived financial metrics
  const todayTransactions = transactions.filter((t) => t.date === todayStr && t.type === 'income');
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

  const inProgressApts = appointments.filter((a) => a.status === 'in_progress');
  const atRiskClients = clients.filter((c) => c.daysSinceLastVisit >= 25);
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  // Status Change Handler
  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated: Appointment = { ...a, status: newStatus };
          if (newStatus === 'in_progress') {
            updated.startedAt = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          } else if (newStatus === 'completed') {
            updated.finishedAt = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          }
          return updated;
        }
        return a;
      })
    );
  };

  // Complete with Payment & Checkout
  const handleCompleteWithPayment = (
    appointmentId: string, 
    paymentMethod: 'pix' | 'card_credit' | 'card_debit' | 'cash', 
    additionalProductIds: string[]
  ) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    handleUpdateAppointmentStatus(appointmentId, 'completed');

    let totalAmount = apt.price;
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Record Service Transaction
    const serviceTx: FinancialTransaction = {
      id: `tx-${Date.now()}-srv`,
      type: 'income',
      description: `Atendimento ${apt.serviceName} - ${apt.clientName}`,
      amount: apt.price,
      paymentMethod,
      date: todayStr,
      time: timeNow,
      barberId: apt.barberId,
      appointmentId: apt.id,
      category: 'servico',
    };

    const newTxs = [serviceTx];

    // Deduct stock & add product sales
    additionalProductIds.forEach((pId, idx) => {
      const prod = products.find((p) => p.id === pId);
      if (prod) {
        totalAmount += prod.sellPrice;
        newTxs.push({
          id: `tx-${Date.now()}-prod-${idx}`,
          type: 'income',
          description: `Venda ${prod.name}`,
          amount: prod.sellPrice,
          paymentMethod,
          date: todayStr,
          time: timeNow,
          barberId: apt.barberId,
          category: 'produto',
        });

        setProducts((prev) =>
          prev.map((p) => (p.id === pId ? { ...p, stock: Math.max(0, p.stock - 1) } : p))
        );
      }
    });

    setTransactions((prev) => [...prev, ...newTxs]);

    // Confetti celebration
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  // Encaixe Inteligente Confirm
  const handleConfirmFit = (fitData: {
    clientName: string;
    clientPhone: string;
    serviceId: string;
    barberId: string;
    time: string;
  }) => {
    const srv = services.find((s) => s.id === fitData.serviceId);
    const barb = barbers.find((b) => b.id === fitData.barberId);

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: fitData.clientName,
      clientPhone: fitData.clientPhone,
      serviceId: fitData.serviceId,
      serviceName: srv ? srv.name : 'Serviço Rápido',
      price: srv ? srv.price : 20.0,
      durationMin: srv ? srv.durationMin : 15,
      barberId: fitData.barberId,
      barberName: barb ? barb.name : 'João da Silva',
      date: todayStr,
      time: fitData.time,
      status: 'scheduled',
    };

    setAppointments((prev) => [...prev, newApt]);
  };

  // Services CRUD
  const handleAddService = (newServiceData: Omit<ServiceItem, 'id'>) => {
    const newSrv: ServiceItem = {
      ...newServiceData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newSrv]);
  };

  const handleUpdateService = (updatedService: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === updatedService.id ? updatedService : s)));
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  // Barbers CRUD
  const handleAddBarber = (newBarberData: Omit<Barber, 'id'>) => {
    const newBarb: Barber = {
      ...newBarberData,
      id: `barber-${Date.now()}`,
    };
    setBarbers((prev) => [...prev, newBarb]);
  };

  const handleUpdateBarber = (updatedBarber: Barber) => {
    setBarbers((prev) => prev.map((b) => (b.id === updatedBarber.id ? updatedBarber : b)));
  };

  const handleDeleteBarber = (barberId: string) => {
    setBarbers((prev) => prev.filter((b) => b.id !== barberId));
  };

  // Products & Inventory CRUD
  const handleAddProduct = (newProductData: Omit<InventoryProduct, 'id'>) => {
    const newProd: InventoryProduct = {
      ...newProductData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [...prev, newProd]);
  };

  const handleUpdateProduct = (updatedProduct: InventoryProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleRestockProduct = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + quantity } : p))
    );
  };

  // WhatsApp Trigger Helper
  const handleTriggerWhatsapp = (aptOrClient: any) => {
    const name = aptOrClient.clientName || aptOrClient.name;
    const phone = aptOrClient.clientPhone || aptOrClient.phone || '';
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 11 ? `55${cleanPhone}` : cleanPhone;

    const text = `Fala ${name.split(' ')[0]}! Tudo certo? Passando para mandar um abraço e lembrar do seu corte na ${config.shopName}! Agende no link: ${process.env.APP_URL || 'https://barberos.app'}/agendar 💈✂️`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (showTVPanel) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowTVPanel(false)}
          className="fixed top-4 right-4 z-50 bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-2 rounded-xl shadow-xl hover:bg-slate-800"
        >
          ✕ Fechar Modo TV
        </button>
        <TVPanelView config={config} appointments={appointments} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-slate-100 flex flex-col font-sans antialiased selection:bg-[#D4AF37] selection:text-slate-950 overflow-x-hidden">
      
      {/* Navigation Header */}
      <Navbar
        config={config}
        units={units}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewAppointment={() => setShowNewAptModal(true)}
        onOpenPublicBooking={() => setShowPublicBookingModal(true)}
        onOpenTVPanel={() => setShowTVPanel(true)}
        onConfigChange={setConfig}
        todayRevenue={todayRevenue}
        revenueTarget={config.dailyRevenueTarget}
        inProgressCount={inProgressApts.length}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto px-0 sm:px-2 md:px-4">
        
        {/* Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          smartGapsCount={2}
          atRiskClientsCount={atRiskClients.length}
          lowStockCount={lowStockProducts.length}
        />

        {/* Content View Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto min-w-0">
          {activeTab === 'agenda' && (
            <AgendaView
              appointments={appointments}
              barbers={barbers}
              services={services}
              selectedBarberId={selectedBarberId}
              setSelectedBarberId={setSelectedBarberId}
              onOpenNewAppointment={() => setShowNewAptModal(true)}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onOpenEncaixeModal={() => setActiveTab('encaixe')}
              onSendWhatsappReminder={handleTriggerWhatsapp}
              todayRevenue={todayRevenue}
              dailyRevenueTarget={config.dailyRevenueTarget}
              onUpdateDailyTarget={(newTarget) => setConfig((prev) => ({ ...prev, dailyRevenueTarget: newTarget }))}
            />
          )}

          {activeTab === 'atendimento' && (
            <AtendimentoView
              appointments={appointments}
              services={services}
              products={products}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onCompleteWithPayment={handleCompleteWithPayment}
            />
          )}

          {activeTab === 'servicos' && (
            <ServicosView
              services={services}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
            />
          )}

          {activeTab === 'config' && (
            <ConfigHorariosView
              config={config}
              appointments={appointments}
              onSaveConfig={(updatedConfig) => setConfig(updatedConfig)}
              onOpenPublicBooking={() => setShowPublicBookingModal(true)}
            />
          )}

          {activeTab === 'tv_panel' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base text-white">Modo Painel TV / Tablet Embutido</h2>
                  <p className="text-xs text-slate-400">Exibição para tela de recepção da barbearia</p>
                </div>
                <button
                  onClick={() => setShowTVPanel(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Abrir em Tela Cheia
                </button>
              </div>
              <TVPanelView config={config} appointments={appointments} />
            </div>
          )}

          {activeTab === 'encaixe' && (
            <EncaixeInteligenteView
              services={services}
              barbers={barbers}
              onConfirmFit={handleConfirmFit}
            />
          )}

          {activeTab === 'crm' && (
            <CRMView
              clients={clients}
              onTriggerWhatsappAI={handleTriggerWhatsapp}
            />
          )}

          {activeTab === 'caixa' && (
            <CaixaView
              transactions={transactions}
              barbers={barbers}
              appointments={appointments}
              dailyTarget={config.dailyRevenueTarget}
              onAddTransaction={(tx) => setTransactions((prev) => [...prev, tx])}
              onUpdateDailyTarget={(newTarget) => setConfig((prev) => ({ ...prev, dailyRevenueTarget: newTarget }))}
            />
          )}

          {activeTab === 'equipe' && (
            <EquipeView
              barbers={barbers}
              appointments={appointments}
              tenantType={config.tenantType}
              onAddBarber={handleAddBarber}
              onUpdateBarber={handleUpdateBarber}
              onDeleteBarber={handleDeleteBarber}
              onUpdateCommission={(barberId, newRate) =>
                setBarbers((prev) =>
                  prev.map((b) => (b.id === barberId ? { ...b, commissionRate: newRate } : b))
                )
              }
            />
          )}

          {activeTab === 'estoque' && (
            <EstoqueView
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onRestock={handleRestockProduct}
            />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppView
              config={config}
              clients={clients}
            />
          )}

          {activeTab === 'ia_insights' && (
            <IAInsightsView
              config={config}
              appointments={appointments}
              clients={clients}
              todayRevenue={todayRevenue}
            />
          )}
        </main>

      </div>

      {/* Modals */}
      {showNewAptModal && (
        <NewAppointmentModal
          services={services}
          barbers={barbers}
          onClose={() => setShowNewAptModal(false)}
          onSave={(newApt) => setAppointments((prev) => [...prev, newApt])}
        />
      )}

      {showPublicBookingModal && (
        <PublicBookingModal
          config={config}
          services={services}
          barbers={barbers}
          onClose={() => setShowPublicBookingModal(false)}
          onConfirmBooking={(newApt) => setAppointments((prev) => [...prev, newApt])}
        />
      )}

    </div>
  );
}
