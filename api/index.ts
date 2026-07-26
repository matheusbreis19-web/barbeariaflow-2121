import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "BarberOS", env: process.env.NODE_ENV || "development" });
});

// AI WhatsApp Re-engagement Message Generator
app.post("/api/ai/re-engage-message", async (req, res) => {
  try {
    const { clientName, daysInactive, lastService, favoriteBarber, shopName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        message: `Fala ${clientName || "amigo"}! Tudo certo? Notamos que já faz ${daysInactive || 30} dias desde o seu último ${lastService || "corte"} na ${shopName || "Barbearia"}. Que tal dar aquele tapa no visual para esta semana? Agende em apenas 1 clique: ${process.env.APP_URL || "https://barberos.app"}/agendar`
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é um barbeiro amigável e profissional da barbearia "${shopName || "Barbearia Premium"}".
Escreva uma mensagem curta, direta e com tom descontraído porém respeitoso para enviar via WhatsApp para o cliente ${clientName || "Cliente"}.
Dados do cliente:
- Último serviço realizado: ${lastService || "Corte de Cabelo"}
- Dias sem retornar: ${daysInactive || 30} dias
- Barbeiro preferido: ${favoriteBarber || "João"}

A mensagem DEVE:
1. Chamar pelo primeiro nome.
2. Mencionar o tempo sem vir de forma sutil sem parecer chato.
3. Convidar para renovar o visual para o fim de semana/semana.
4. Incluir um call to action amigável para agendar pelo link.
5. Ter no máximo 3 ou 4 linhas e incluir emojis adequados (💈, ✂️, 🔥).
Retorne APENAS o texto da mensagem, sem aspas nem explicações adicionais.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const message = response.text?.trim() || `Fala ${clientName}! Bora renovar o visual? Já faz ${daysInactive} dias desde o último ${lastService}! Agende aqui: ${process.env.APP_URL || ""}/agendar`;
    res.json({ message });
  } catch (error: any) {
    console.error("Error generating WhatsApp message:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI message" });
  }
});

// AI Operational Insights Endpoint
app.post("/api/ai/daily-insights", async (req, res) => {
  try {
    const { dailyRevenue, dailyTarget, completedAppointments, totalSlots, inactiveClientsCount, occupancyRate } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        insight: `Sua taxa de ocupação hoje é de ${occupancyRate || 65}%. Você já atingiu R$ ${dailyRevenue || 320} dos R$ ${dailyTarget || 550} da meta diária. Recomendação: Use o Encaixe Inteligente para preencher as lacunas do período da tarde.`
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é o Diretor Operacional e Especialista de Dados em Negócios de Beleza da BarberOS.
Analise as métricas operacionais da barbearia hoje:
- Faturamento Atual: R$ ${dailyRevenue}
- Meta Diária: R$ ${dailyTarget}
- Atendimentos Concluídos: ${completedAppointments} de ${totalSlots} disponíveis
- Taxa de Ocupação da Agenda: ${occupancyRate}%
- Clientes Inativos sem Retorno (+25 dias): ${inactiveClientsCount} clientes

Forneça UMA análise acionável e direta em até 3 tópicos curtos:
1. Diagnóstico do ritmo atual em relação à meta.
2. Ação operacional recomendada para HOJE (ex: lançar encaixe rápido de barba/sobrancelha, contatar 3 clientes inativos, promover combo).
3. Uma dica estratégica rápida.
Seja direto, profissional e focado em aumentar faturamento sem enrolação.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ insight: response.text?.trim() });
  } catch (error: any) {
    console.error("Error generating daily insights:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI insight" });
  }
});

export default app;
