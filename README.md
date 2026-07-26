# BarberOS — Sistema de Gestão ERP & CRM para Barbearias

**BarberOS** é uma plataforma completa e moderna desenvolvida para barbearias, salões masculinos e profissionais autônomos (Barbeiros Solo). O sistema integra gestão de agendamentos, controle de caixa/finanças, controle de estoque com alertas, inteligência artificial integrada (Google Gemini) para WhatsApp e análise preditiva, além de painel para TV de salão e link público de agendamentos.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js com Express (TypeScript via `tsx` em dev e `esbuild` em prod).
- **Inteligência Artificial**: Google Gen AI SDK (`@google/genai`) com modelo Gemini 2.5/3.0.
- **Bundler**: Vite.

---

## 🚀 Como Rodar o Projeto Localmente

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env` baseado no `.env.example`:
   ```env
   PORT=3000
   GEMINI_API_KEY=SuaChaveDoGoogleGemini
   ```

3. **Iniciar o Servidor em Desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação no seu navegador em `http://localhost:3000`.

4. **Gerar o Build de Produção**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📋 Módulos do Sistema e Funcionalidades

### 1. Agenda e Grade de Horários
- Visualização por dia ou semana.
- Filtro por barbeiro individual ou visão geral do salão.
- Indicador de status em tempo real (`Agendado`, `Em Atendimento`, `Concluído`, `Cancelado`).
- Botão rápido para **Novo Agendamento**.

### 2. Comanda & Atendimento (PDV)
- Abertura e fechamento de comandas de clientes.
- Lançamento de serviços e adição de produtos consumidos/vendidos.
- Cálculo automático de comissão do barbeiro e formas de pagamento (PIX, Cartão, Dinheiro).

### 3. CRM & Base de Clientes
- Cadastro completo de clientes com histórico de atendimentos.
- Filtros inteligentes para clientes "Em Risco" (sem cortar há mais de 30 dias).
- Registro de preferências e observações do cliente.

### 4. Estoque de Produtos
- Controle de produtos para uso interno e revenda.
- Alertas automáticos para itens com quantidade abaixo do estoque mínimo.
- Entrada e saída de mercadorias.

### 5. Financeiro e DRE Rápido
- Fluxo de caixa com entradas e saídas.
- Indicadores de Faturamento Diário vs Meta do Dia.
- DRE simplificado e relatórios de desempenho por período.

### 6. IA WhatsApp & Insights (Google Gemini)
- Agente virtual de atendimento para tirar dúvidas de clientes e sugerir horários.
- Gerador de relatórios e insights de negócios com inteligência artificial.

### 7. Painel TV para o Salão
- Exibição em tela cheia do cliente atual e próximos da fila para TV do salão.

### 8. Link Público de Agendamento
- Página simplificada para o próprio cliente escolher a unidade, barbeiro, serviço e horário disponível.

---

## 🔒 Arquitetura para Continuidade (Guia do Desenvolvedor)

O projeto segue uma arquitetura modular focada em fácil expansão:
- `/src/types.ts`: Contém todas as interfaces TypeScript principais.
- `/src/mockData.ts`: Armazena dados simulados caso o banco de dados não esteja configurado.
- `/server.ts`: Servidor Node.js Express responsável por servir a aplicação e intermediar as chamadas à API da IA.

---

## ⚠️ Cuidados com Variáveis de Ambiente no Vite & React

- **Não usar `process.env` no Frontend (`/src`)**: O navegador não possui o objeto `process` do Node.js. Acessar `process.env` diretamente no React gerará o erro `ReferenceError: process is not defined`.
- **Forma Correta no Frontend**:
  - Para obter a URL do projeto dinamicamente: use `window.location.origin`.
  - Para variáveis do Vite: declare como `VITE_SUA_VARIAVEL` no `.env` e acesse via `import.meta.env.VITE_SUA_VARIAVEL`.
- **Forma Correta no Backend (`server.ts`)**:
  - Chaves privadas (como `GEMINI_API_KEY`) devem ser lidas via `process.env.GEMINI_API_KEY` apenas no servidor Express e nunca expostas no cliente.

Para mais detalhes sobre as regras de negócio e guia completo para desenvolvedores e agentes de IA, consulte o arquivo **`AGENTS.md`**.
