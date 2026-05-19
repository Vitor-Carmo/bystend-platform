import { prisma } from "../lib/prisma.js";
import { searchContents } from "./search.js";

const MAX_CONTEXT_CHARS = 12_000;

export interface RagChunk {
  id: string;
  title: string;
  type: string;
  theme: string | null;
  violenceType: string | null;
  legalRisk: string | null;
  text: string;
}

/** Busca textual no SQLite e monta blocos de contexto para o Gemini. */
export async function retrieveContextForQuery(query: string, limit = 5): Promise<RagChunk[]> {
  const hits = await searchContents({ q: query, limit });

  const chunks: RagChunk[] = [];
  for (const hit of hits) {
    const full = await prisma.content.findUnique({
      where: { id: hit.id },
      include: { nanoCards: { orderBy: { order: "asc" } }, layer: true },
    });
    if (!full) continue;

    const nanoText = full.nanoCards.map((n) => n.text).join("\n");
    const bodyParts = [
      `Título: ${full.title}`,
      full.theme ? `Tema: ${full.theme}` : null,
      full.violenceType ? `Tipo de violência: ${full.violenceType}` : null,
      full.layer ? `Camada: ${full.layer.name}` : null,
      full.sensitivity ? `Sensibilidade: ${full.sensitivity}` : null,
      full.legalRisk ? `Risco jurídico: ${full.legalRisk}` : null,
      full.summary ? `Resumo: ${full.summary}` : null,
      nanoText ? `Nano conteúdos:\n${nanoText}` : null,
      full.body ? `Microconteúdo:\n${full.body.slice(0, 2500)}` : null,
    ].filter(Boolean);

    chunks.push({
      id: full.id,
      title: full.title,
      type: full.type,
      theme: full.theme,
      violenceType: full.violenceType,
      legalRisk: full.legalRisk,
      text: bodyParts.join("\n"),
    });
  }

  return trimChunksToBudget(chunks);
}

function trimChunksToBudget(chunks: RagChunk[]): RagChunk[] {
  let total = 0;
  const kept: RagChunk[] = [];
  for (const chunk of chunks) {
    if (total + chunk.text.length > MAX_CONTEXT_CHARS) break;
    kept.push(chunk);
    total += chunk.text.length;
  }
  return kept;
}

export function formatContextForPrompt(chunks: RagChunk[]): string {
  if (chunks.length === 0) {
    return "Nenhum conteúdo específico foi recuperado da base. Oriente com cautela e recomende buscar materiais na biblioteca da plataforma.";
  }
  return chunks
    .map(
      (c, i) =>
        `--- Fonte ${i + 1} (id: ${c.id}, tipo: ${c.type}, título: ${c.title}) ---\n${c.text}`
    )
    .join("\n\n");
}
