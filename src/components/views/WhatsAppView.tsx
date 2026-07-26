import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Copy, Check } from 'lucide-react';
import { ShopConfig, ClientProfile } from '../../types';

interface WhatsAppViewProps {
  config: ShopConfig;
  clients: ClientProfile[];
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({ config, clients = [] }) => {
  const safeClients = Array.isArray(clients) ? clients : [];
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(safeClients[0] || null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('lembrete');
  const [customText, setCustomText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync selected client if clients array updates
  useEffect(() => {
    if (!selectedClient && safeClients.length > 0) {
      setSelectedClient(safeClients[0]);
    }
  }, [safeClients, selectedClient]);

  const shopName = config?.shopName || 'Barbearia';

  const templates: Record<string, string> = {
    confirmacao: `Olá {nome}! Seu agendamento na ${shopName} está CONFIRMADO para hoje. Esperamos por você! 💈✂️`,
    lembrete: `Fala {nome}! Lembrete amigável: Seu horário na ${shopName} é daqui a pouco. Se precisar remarcar, nos avise!🔥`,
    retorno: `Fala {nome}! Vi que seu último corte foi há mais de 25 dias. Bora dar aquele tapa no visual para este fds? Agende em 1 clique: ${typeof window !== 'undefined' ? window.location.origin : 'https://barberos.app'}/agendar ✂️`,
    aniversario: `Parabéns {nome}! 🎉 A equipe da ${shopName} deseja um feliz aniversário! Venha dar um trato no visual esta semana e ganhe 15% de desconto! 🚀`,
  };

  const getMessageText = () => {
    if (customText) return customText;
    const template = templates[selectedTemplate] || templates.lembrete;
    const clientName = selectedClient && selectedClient.name ? selectedClient.name : 'Cliente';
    const firstName = clientName.split(' ')[0] || 'Cliente';
    return template.replace('{nome}', firstName);
  };

  const handleOpenWaWeb = () => {
    if (!selectedClient || !selectedClient.phone) {
      alert('Por favor, selecione um cliente com número de telefone cadastrado.');
      return;
    }
    const rawPhone = String(selectedClient.phone || '');
    const cleanPhone = rawPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      alert('O telefone deste cliente não possui um formato válido.');
      return;
    }
    const fullPhone = cleanPhone.length === 11 ? `55${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(getMessageText())}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getMessageText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Banner */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-black border border-[#D4AF37] flex items-center justify-center font-black flex-shrink-0">
          <MessageSquare className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-black uppercase text-white">Central de WhatsApp Inteligente</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5">
            Comunicação contextual com clientes em 1 clique. Disparo direto via WhatsApp Web com mensagens personalizadas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Select Client & Template */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-4 shadow-2xl">
          
          <div>
            <label className="label-bold block mb-1">
              1. Selecionar Cliente
            </label>
            {safeClients.length > 0 ? (
              <select
                value={selectedClient?.id || ''}
                onChange={(e) => setSelectedClient(safeClients.find((c) => c.id === e.target.value) || null)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-bold uppercase cursor-pointer"
              >
                {safeClients.map((c) => (
                  <option key={c.id || Math.random()} value={c.id}>
                    {c.name || 'Cliente'} ({c.phone || 'Sem fone'}) - {c.daysSinceLastVisit || 0}d sem vir
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-xs text-zinc-400 font-bold">
                Nenhum cliente cadastrado no momento.
              </div>
            )}
          </div>

          <div>
            <label className="label-bold block mb-1">
              2. Escolher Modelo de Mensagem
            </label>
            <div className="space-y-2">
              {[
                { id: 'lembrete', label: '🔔 LEMBRETE PRÓXIMO HORÁRIO' },
                { id: 'retorno', label: '💈 CONVITE DE RETORNO (+25 DIAS)' },
                { id: 'confirmacao', label: '✅ CONFIRMAÇÃO DE AGENDAMENTO' },
                { id: 'aniversario', label: '🎉 DESCONTO DE ANIVERSÁRIO' },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    setCustomText('');
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedTemplate === tmpl.id && !customText
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg'
                      : 'bg-[#0A0A0A] border-[#2A2A2A] text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Preview & Trigger */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-bold">
                Prévia da Mensagem WhatsApp
              </label>

              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs text-zinc-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIADO!' : 'COPIAR'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={getMessageText()}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3.5 text-xs text-zinc-200 focus:outline-none focus:border-[#D4AF37] font-sans leading-relaxed resize-none font-medium"
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-[#2A2A2A]">
            <button
              onClick={handleOpenWaWeb}
              className="btn-gold w-full py-4 rounded-xl shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer text-sm font-black uppercase"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>Disparar para {selectedClient && selectedClient.name ? selectedClient.name.split(' ')[0] : 'Cliente'} no WhatsApp</span>
            </button>

            <p className="text-[10px] text-center text-zinc-500 font-bold uppercase tracking-wider">
              Abre o WhatsApp Web com número e texto pré-preenchidos.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
