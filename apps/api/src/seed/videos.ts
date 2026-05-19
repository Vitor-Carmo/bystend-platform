import { prisma } from "../lib/prisma.js";
import {
  buildSearchText,
  categorySlugFromViolence,
  cleanCell,
  normalizeViolenceType,
} from "../lib/normalize.js";
import { getCategoryId } from "./layers.js";
import { CSV_FILES, readCsv } from "./csv.js";

function inferViolenceFromTitle(title: string): string {
  const t = title.toUpperCase();
  if (t.includes("SEXUAL") || t.includes("IMPORTUN")) return "ASSÉDIO SEXUAL";
  if (t.includes("MICRO") || t.includes("MICROAGRESS")) return "MICROAGRESSÕES";
  if (t.includes("DISCRIMIN") || t.includes("RACIAL")) return "DISCRIMINAÇÃO";
  if (t.includes("MORAL") || t.includes("HUMILHA") || t.includes("ABUSO")) return "ASSÉDIO MORAL";
  return "ASSÉDIO MORAL";
}

export async function seedVideos(dataDir: string) {
  const rows = readCsv(dataDir, CSV_FILES.videos);
  for (const row of rows) {
    const title = cleanCell(row["TÍTULO"] ?? row["TITULO"]);
    const url = cleanCell(row["LINK / URL"] ?? row["LINK"]);
    if (!title || !url) continue;

    const violenceType = inferViolenceFromTitle(title);
    const categoryId = await getCategoryId(violenceType);

    await prisma.content.create({
      data: {
        type: "video",
        title,
        url,
        audience: "GERAL",
        violenceType,
        theme: title,
        categoryId,
        sensitivity: "MÉDIO",
        legalRisk: "BAIXO",
        summary: `Vídeo educativo sobre ${violenceType.toLowerCase()}.`,
        searchText: buildSearchText([title, violenceType, url]),
        metadata: JSON.stringify({ source: "videos_csv" }),
      },
    });
  }
  console.log(`Seeded ${rows.length} videos`);
}
