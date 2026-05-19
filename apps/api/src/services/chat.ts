import { GoogleGenerativeAI } from "@google/generative-ai";
import { CHAT_DISCLAIMER, type ChatResponse, type ChatSource } from "@bystend/shared";
import { isHighLegalRisk } from "../lib/normalize.js";
import { prisma } from "../lib/prisma.js";
import { searchContents } from "./search.js";
import { formatContextForPrompt, retrieveContextForQuery } from "./rag-context.js";

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-1.5-flash",
  "gemini-2.5-flash",
].filter((m): m is string => Boolean(m));

const SYSTEM_PROMPT = `Você é um assistente virtual empático da Byst.end. Baseie suas respostas EXCLUSIVAMENTE no contexto fornecido. NUNCA afirme categoricamente que uma situação é assédio; use frases como "Isso pode conter sinais de conduta inadequada". Sempre oriente o usuário a buscar o RH ou canal de denúncias em casos graves.

Regras adicionais:
- Trate relatos como situações educativas ou hipotéticas.
- Não dê diagnóstico psicológico nem parecer jurídico definitivo.
- Não invente políticas internas, canais ou promessas de confidencialidade.
- Seja acolhedor, claro e objetivo.
- Quando citar informações do contexto, mencione o título do material quando possível.
- Quando a dúvida do usuário envolver responsabilidade da empresa, cite a NR-1 e a Convenção 190 da OIT.
- Quando envolver recortes de gênero, utilize os conceitos da Think Eva.
- Se o contexto não for suficiente, diga isso e oriente a explorar a biblioteca da plataforma.`;

async function generateWithGemini(userMessage: string, contextBlock: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const userPrompt = `CONTEXTO RECUPERADO DA BASE BYST.END (use apenas estas informações como fonte):

${contextBlock}

---

PERGUNTA OU SITUAÇÃO DESCRITA PELO USUÁRIO:
${userMessage}

Responda em português do Brasil, de forma empática e educativa, em no máximo 4 parágrafos curtos.`;

  let lastError: unknown;
  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      });
      const result = await model.generateContent(userPrompt);
      const text = result.response.text().trim();
      if (text) return text;
    } catch (err) {
      lastError = err;
      console.warn(`Gemini model ${modelName} failed, trying next...`);
    }
  }
  throw lastError ?? new Error("Nenhum modelo Gemini disponível");
}

/** Fallback quando Gemini não está disponível. */
function buildFallbackReply(
  userMessage: string,
  sources: Awaited<ReturnType<typeof searchContents>>,
  highRisk: boolean
): string {
  const top = sources.slice(0, 3);
  let reply =
    "Sinto muito que você esteja passando por isso. Situações como a que você descreve podem conter sinais de conduta inadequada e merecem atenção. ";
  reply +=
    "Com base nos materiais da Byst.end, observe frequência, contexto, impacto e existência de testemunhas. ";

  if (top.length > 0) {
    reply += `Conteúdos relacionados: ${top.map((s) => s.title).join("; ")}. `;
  }

  if (userMessage.toLowerCase().includes("gestor") || userMessage.toLowerCase().includes("líder")) {
    reply += "Em relações hierárquicas, o desequilíbrio de poder pode intensificar o impacto. ";
  }

  reply +=
    "Recomenda-se registrar os episódios e buscar orientação no RH, compliance ou canal de denúncia da organização. ";

  if (highRisk) {
    reply += "Por envolver tema sensível, priorize canais oficiais de apoio. ";
  }

  return reply;
}

export async function handleChat(sessionId: string, message: string): Promise<ChatResponse> {
  const chunks = await retrieveContextForQuery(message, 5);
  const contextBlock = formatContextForPrompt(chunks);

  const sourcesFromSearch = await searchContents({ q: message, limit: 5 });
  const highRisk =
    chunks.some((c) => isHighLegalRisk(c.legalRisk ?? undefined)) ||
    sourcesFromSearch.some((s) => isHighLegalRisk(s.legalRisk ?? undefined));

  let reply: string;
  try {
    reply = await generateWithGemini(message, contextBlock);
  } catch (err) {
    console.error("Gemini chat error, using fallback:", err);
    reply = buildFallbackReply(message, sourcesFromSearch, highRisk);
  }

  let session = await prisma.chatSession.findUnique({ where: { sessionId } });
  if (!session) {
    session = await prisma.chatSession.create({ data: { sessionId } });
  }

  await prisma.chatMessage.create({
    data: { sessionId: session.id, role: "user", content: message },
  });

  const sourcePayload: ChatSource[] =
    chunks.length > 0
      ? chunks.map((c) => ({
          id: c.id,
          title: c.title,
          type: c.type as ChatSource["type"],
          theme: c.theme,
        }))
      : sourcesFromSearch.map((s) => ({
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
