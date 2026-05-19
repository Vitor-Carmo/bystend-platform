import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma.js";
import { buildSearchText } from "../lib/normalize.js";
import { getCategoryIdBySlug } from "./layers.js";

const CHUNK_SIZE = 8_000;
const MAX_CHUNKS_PER_SOURCE = 15;

type SourceDef = {
  file: string;
  title: string;
  categorySlug: "fontes-oficiais-marco-legal" | "visao-mercado";
  theme: string;
  legalRisk: string;
  sensitivity: string;
  violenceType?: string;
};

const SOURCES: SourceDef[] = [
  {
    file: "nr1.txt",
    title: "NR-1 — Disposições Gerais e Gerenciamento de Riscos Ocupacionais (atualizada)",
    categorySlug: "fontes-oficiais-marco-legal",
    theme: "Responsabilidade do empregador, GRO/PGR e prevenção de violência no trabalho",
    legalRisk: "ALTO",
    sensitivity: "ALTO",
    violenceType: "GERAL",
  },
  {
    file: "oit-c190.txt",
    title: "Convenção 190 da OIT — Violência e Assédio no Mundo do Trabalho (2019)",
    categorySlug: "fontes-oficiais-marco-legal",
    theme: "Marco internacional, definições e deveres de prevenção",
    legalRisk: "ALTO",
    sensitivity: "ALTO",
    violenceType: "GERAL",
  },
  {
    file: "oit-relatorio-2018.txt",
    title: "OIT — Relatório V(1): Acabar com violência e assédio no mundo do trabalho (2018)",
    categorySlug: "fontes-oficiais-marco-legal",
    theme: "Prevalência, impacto, fatores de risco e enquadramento internacional",
    legalRisk: "MÉDIO",
    sensitivity: "MÉDIO",
    violenceType: "GERAL",
  },
  {
    file: "oit-ambientes-seguros.txt",
    title: "OIT — Ambientes de trabalho seguros e saudáveis livres de violência e assédio",
    categorySlug: "fontes-oficiais-marco-legal",
    theme: "Boas práticas e orientações da OIT para ambientes livres de violência",
    legalRisk: "MÉDIO",
    sensitivity: "MÉDIO",
    violenceType: "GERAL",
  },
  {
    file: "think-eva.txt",
    title: "Think Eva — Assédio Moral e Sexual (visão de mercado e recorte de gênero)",
    categorySlug: "visao-mercado",
    theme: "Equidade de gênero, pesquisa Trabalho Sem Assédio e cultura organizacional",
    legalRisk: "BAIXO",
    sensitivity: "MÉDIO",
    violenceType: "GERAL",
  },
];

function resolveKnowledgeDir(): string {
  const candidates = [
    path.resolve(process.cwd(), "data/knowledge-sources"),
    path.resolve(process.cwd(), "../../data/knowledge-sources"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "nr1.txt"))) return dir;
  }
  return candidates[0];
}

function chunkText(text: string, maxSize = CHUNK_SIZE): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let start = 0;
  while (start < normalized.length && chunks.length < MAX_CHUNKS_PER_SOURCE) {
    let end = Math.min(start + maxSize, normalized.length);
    if (end < normalized.length) {
      const paragraphBreak = normalized.lastIndexOf("\n\n", end);
      if (paragraphBreak > start + maxSize * 0.4) end = paragraphBreak;
    }
    const slice = normalized.slice(start, end).trim();
    if (slice) chunks.push(slice);
    start = end;
  }
  return chunks;
}

function summarizeChunk(chunk: string, maxLen = 280): string {
  const line = chunk.split("\n").find((l) => l.trim().length > 40) ?? chunk;
  const clean = line.replace(/\s+/g, " ").trim();
  return clean.length <= maxLen ? clean : `${clean.slice(0, maxLen - 1)}…`;
}

export async function seedKnowledgeSources(): Promise<void> {
  const knowledgeDir = resolveKnowledgeDir();
  let total = 0;

  for (const source of SOURCES) {
    const filePath = path.join(knowledgeDir, source.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Knowledge source not found, skipping: ${filePath}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const chunks = chunkText(raw);
    const categoryId = await getCategoryIdBySlug(source.categorySlug);

    for (let i = 0; i < chunks.length; i++) {
      const part = chunks.length > 1 ? ` (parte ${i + 1}/${chunks.length})` : "";
      const title = `${source.title}${part}`;
      const body = chunks[i];

      await prisma.content.create({
        data: {
          type: "reference",
          title,
          summary: summarizeChunk(body),
          body,
          audience: "GERAL",
          violenceType: source.violenceType ?? "GERAL",
          theme: source.theme,
          categoryId,
          sensitivity: source.sensitivity,
          legalRisk: source.legalRisk,
          searchText: buildSearchText([
            title,
            source.theme,
            source.categorySlug,
            body.slice(0, 12_000),
          ]),
          metadata: JSON.stringify({
            source: "knowledge_pdf",
            file: source.file,
            categorySlug: source.categorySlug,
            chunkIndex: i,
            chunkTotal: chunks.length,
          }),
        },
      });
      total++;
    }
  }

  console.log(`Seeded ${total} knowledge reference chunks from ${SOURCES.length} sources`);
}
