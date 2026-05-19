import { CHAT_DISCLAIMER, type ChatResponse, type ChatSource } from "@bystend/shared";
import { isHighLegalRisk } from "../lib/normalize.js";
import { prisma } from "../lib/prisma.js";
import { searchContents } from "./search.js";

const SAFE_OPENING =
  "Sinto muito que você esteja passando por uma situação difícil. ";

function buildEducationalReply(
  userMessage: string,
  sources: Awaited<ReturnType<typeof searchContents>>,
  highRisk: boolean
): string {
  const top = sources.slice(0, 3);
  const themes = [...new Set(top.map((s) => s.theme || s.title))].join("; ");

  let reply = SAFE_OPENING;
  reply +=
    "Situações de exposição, humilhação, comentários depreciativos recorrentes ou pressão podem conter sinais de conduta inadequada e merecem atenção. ";
  reply += "Com base nos materiais da Byst.end, é importante observar frequência, contexto, impacto e existência de testemunhas. ";

  if (userMessage.toLowerCase().includes("gestor") || userMessage.toLowerCase().includes("líder")) {
    reply +=
      "Quando há relação hierárquica, o desequilíbrio de poder pode intensificar o impacto da situação. ";
  }

  if (top.length > 0) {
    reply += `Conteúdos relacionados na base: ${themes}. `;
    if (top[0].snippet) {
      reply += `${top[0].snippet} `;
    }
  }

  reply +=
    "Recomenda-se registrar os episódios com datas e contexto e buscar orientação nos canais oficiais da organização (RH, ética, compliance ou canal de denúncia), conforme a gravidade. ";

  if (highRisk) {
    reply +=
      "Por envolver tema sensível ou possível ilícito, priorize acolhimento imediato, sigilo e encaminhamento aos canais adequados da instituição ou autoridades competentes, quando necessário. ";
  }

  reply += "Esta resposta não conclui categoricamente que houve assédio; oferece orientação educativa inicial.";
  return reply;
}

export async function handleChat(sessionId: string, message: string): Promise<ChatResponse> {
  const sources = await searchContents({ q: message, limit: 5 });
  const highRisk = sources.some((s) => isHighLegalRisk(s.legalRisk ?? undefined));

  const reply = buildEducationalReply(message, sources, highRisk);

  let session = await prisma.chatSession.findUnique({ where: { sessionId } });
  if (!session) {
    session = await prisma.chatSession.create({ data: { sessionId } });
  }

  await prisma.chatMessage.create({
    data: { sessionId: session.id, role: "user", content: message },
  });

  const sourcePayload: ChatSource[] = sources.map((s) => ({
    id: s.id,
    title: s.title,
    type: s.type,
    theme: s.theme,
  }));

  await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      role: "assistant",
      content: reply,
      sources: JSON.stringify(sourcePayload),
    },
  });

  return {
    message: reply,
    sources: sourcePayload,
    disclaimer: CHAT_DISCLAIMER,
    highRisk,
  };
}
