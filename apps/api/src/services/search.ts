import type { SearchResult } from "@bystend/shared";
import { prisma } from "../lib/prisma.js";
import { stripEmojis } from "../lib/normalize.js";

function tokenize(q: string): string[] {
  return stripEmojis(q)
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreText(text: string, tokens: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (lower.includes(token)) score += 2;
    if (lower.startsWith(token)) score += 1;
  }
  return score;
}

export async function searchContents(params: {
  q: string;
  type?: string;
  category?: string;
  layer?: number;
  limit?: number;
}): Promise<SearchResult[]> {
  const tokens = tokenize(params.q);
  const limit = params.limit ?? 20;

  const where: Record<string, unknown> = {};
  if (params.type) where.type = params.type;
  if (params.category) {
    where.category = { slug: params.category };
  }
  if (params.layer) {
    where.layer = { number: params.layer };
  }

  const contents = await prisma.content.findMany({
    where,
    include: { layer: true, category: true, nanoCards: { orderBy: { order: "asc" }, take: 1 } },
    take: 200,
  });

  const scored = contents
    .map((c) => {
      const searchable = [c.title, c.summary, c.theme, c.searchText, c.violenceType, c.body]
        .filter(Boolean)
        .join(" ");
      const score = tokens.length ? scoreText(searchable, tokens) : 1;
      const snippet =
        c.summary ??
        c.nanoCards[0]?.text?.slice(0, 160) ??
        c.body?.slice(0, 160) ??
        undefined;
      return {
        id: c.id,
        type: c.type as SearchResult["type"],
        title: c.title,
        summary: c.summary,
        theme: c.theme,
        violenceType: c.violenceType,
        audience: c.audience,
        sensitivity: c.sensitivity,
        legalRisk: c.legalRisk,
        url: c.url,
        layer: c.layer ? { number: c.layer.number, name: c.layer.name } : null,
        category: c.category ? { slug: c.category.slug, name: c.category.name } : null,
        score,
        snippet,
      };
    })
    .filter((r) => (tokens.length ? r.score > 0 : true))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
