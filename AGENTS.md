# AGENTS.md — Guia de Continuidade para Agentes de IA (BarberOS ERP)

Este arquivo serve como contexto mestre para qualquer Agente de IA ou Desenvolvedor que assuma a manutenção e evolução do projeto **BarberOS**.

---

## 📌 Visão Geral do Projeto

**BarberOS** é um sistema completo de gestão (ERP/CRM SaaS) para barbearias e salões masculinos.
Suporta modelos de negócios desde **Barbeiro Solo (Atendimento Individual)** até **Rede Multi-Unidades / Multi-Barbeiros**.

---

## 🛠️ Arquitetura e Stack Tecnológico

1. **Frontend**:
   - React 18 (TypeScript) + Vite
   - Tailwind CSS (Estilização responsiva com tema Dark Luxury `#141414`, `#0A0A0A` e acento Dourado Barbershop `#D4AF37`)
   - Lucide React (Biblioteca unificada de ícones)
   - Canvas Confetti (Efeitos de celebração em checkouts e ações)

2. **Backend / Servidor Express**:
   - `server.ts`: Servidor Node.js Express rodando na porta dinâmica (`process.env.PORT || 3000`).
   - Servidor com suporte a **Vite Middleware** em ambiente de desenvolvimento e entrega estática otimizada em produção.
   - Rotas `/api/gemini/chat` e `/api/gemini/insights` para integração do Google Gemini AI sem expor chaves no cliente.

3. **Inteligência Artificial**:
   - Pacote `@google/genai` (Google Gen AI SDK oficial) utilizado no servidor (`server.ts`).
   - Agente de Atendimento para WhatsApp (agendamentos automáticos, dúvidas, cálculo de valores) e Análise Preditiva de Insights da Barbearia.

---

## 📂 Estrutura de Arquivos e Módulos

```
/
├── server.ts                 # Servidor Express com rotas de API e proxy Gemini AI
├── src/
│   ├── main.tsx              # Ponto de entrada do React DOM
│   ├── App.tsx               # Componente Raiz, Gerenciador do Estado Global e Roteamento interno
│   ├── types.ts              # Tipagem genérica TypeScript (Agendamentos, Produtos, Clientes, Transações)
│   ├── mockData.ts           # Dados iniciais para simulação rica do sistema
│   ├── index.css             # Importação do Tailwind CSS e estilos globais
│   └── components/
│       ├── Navbar.tsx        # Barra Superior (Metas diárias, seletor de unidade, botão de agendamento)
│       ├── Sidebar.tsx       # Navegação Lateral categorizada
│       ├── BarberLogo.tsx    # Logotipo vetorial personalizado
│       ├── MetaDiariaCard.tsx# Card de acompanhamento do faturamento do dia
│       ├── views/            # Módulos de Tela
│       │   ├── AgendaView.tsx            # Visão semanal/diária por barbeiro com drag & status
│       │   ├── AtendimentoView.tsx       # Comanda aberta / PDV / Checkout de atendimento
│       │   ├── CRMView.tsx               # Base de clientes, programa de fidelidade e histórico
│       │   ├── CaixaView.tsx             # Controle financeiro, entradas/saídas e gráficos
│       │   ├── ConfigHorariosView.tsx    # Definição de horários de funcionamento e bloqueios
│       │   ├── EncaixeInteligenteView.tsx# Algoritmo de otimização de ganchos na agenda
│       │   ├── EquipeView.tsx            # Cadastro de barbeiros, comissões e turnos
│       │   ├── EstoqueView.tsx           # Produtos, alertas de baixo estoque e movimentações
│       │   ├── IAInsightsView.tsx        # Análises preditivas via Google Gemini
│       │   ├── ServicosView.tsx          # Catálogo de serviços, preços e durações
│       │   ├── TVPanelView.tsx           # Painel de fila para TV do salão (Full Screen)
│       │   └── WhatsAppView.tsx          # Simulador de Agente IA de WhatsApp
│       └── modals/
│           ├── NewAppointmentModal.tsx   # Modal de criação manual de agendamento
│           └── PublicBookingModal.tsx    # Modal/Página pública de agendamento para clientes
```

---

## 📐 Regras de Negócio Importantes

1. **Suporte Barbeiro Solo vs Multi-Barbeiro**:
   - Configurado através do tipo de tenant (`solo` vs `multi`).
   - Se for `solo`, a visualização da agenda filtra e simplifica os controles para focar em apenas um profissional.

2. **Agendamento e Encaixes**:
   - Cada agendamento possui status: `scheduled` (Agendado), `in_progress` (Em Atendimento), `completed` (Concluído), `cancelled` (Cancelado), `no_show` (Faltou).
   - A comanda (PDV) permite adicionar produtos do estoque junto ao serviço prestado.

3. **Controle de Estoque**:
   - Produtos possuem campo `minStock` e `quantity`.
   - Caso `quantity <= minStock`, o sistema ativa os badges de "Estoque Baixo" na sidebar e alerta o gerente.

4. **Porta do Servidor Local/Nuvem**:
   - `server.ts` lê obrigatoriamente `process.env.PORT` para não conflitar com portas em uso locais (como `3000`, `3001` ou `5173`).

---

## ⚠️ REGRA CRÍTICA DE AMBIENTE: Prevenção do erro `ReferenceError: process is not defined`

1. **Separação Rígida entre Frontend e Backend**:
   - O código em `/src/` roda **exclusivamente no navegador**. O objeto `process` do Node.js **NÃO EXISTE** nativamente no browser.
   - **PROIBIDO**: Nunca escreva `process.env.NOME_DA_VAR` dentro de arquivos do React/Vite (ex: `/src/App.tsx`, `/src/components/*`). Isso causará o erro fatal de tela escura/vermelha (`ReferenceError: process is not defined`).

2. **Como Acessar URLs ou Variáveis no Frontend**:
   - Para obter a URL atual do app no browser, use `window.location.origin`.
   - Para variáveis de ambiente do Vite, use `import.meta.env.VITE_NOME_VAR`.

3. **Onde é permitido usar `process.env`**:
   - **Apenas no Backend (`server.ts`)**: Onde o Node.js roda do lado do servidor (ex: `process.env.GEMINI_API_KEY`, `process.env.PORT`).

4. **Proteção no `vite.config.ts`**:
   - O arquivo `vite.config.ts` contém `define: { 'process.env': {} }` como uma trava de segurança global para evitar crashes caso alguma biblioteca antiga tente ler `process.env`. Mantê-la sempre configurada.

---

## 🚀 Próximos Passos Recomendados para o Próximo Agente/Dev

1. **Persistência de Dados Real**:
   - Conectar o backend `server.ts` a um banco de dados gratuito (ex: Supabase PostgreSQL, Firebase Firestore ou NeonDB).
2. **Autenticação Real com Google OAuth**:
   - Implementar Firebase Auth ou Supabase Auth para login social de clientes e administradores.
3. **Integração do WhatsApp**:
   - Conectar o simulador do `WhatsAppView.tsx` a uma API real de WhatsApp (ex: Evolution API, Z-API ou Baileys).
4. **Gateway de Pagamento PIX/Cartão**:
   - Integrar Mercado Pago ou Asaas para receber pagamentos de agendamentos antecipados na tela de agendamento público (`PublicBookingModal`).
