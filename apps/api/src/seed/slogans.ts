import { prisma } from "../lib/prisma.js";
import { cleanCell, normalizeViolenceType } from "../lib/normalize.js";
import { getCategoryId } from "./layers.js";
import { CSV_FILES, readCsv } from "./csv.js";

const VIOLENCE_COLUMNS = [
  "ASSÉDIO MORAL",
  "ASSÉDIO SEXUAL",
  "VIOLÊNCIA DIGITAL (BULLYING E CYBERBULLYING)",
  "DISCRIMINAÇÃO",
  "ESTUPRO",
  "IMPORTUNAÇÃO SEXUAL",
  "MICROAGRESSÕES",
];

export async function seedSlogans(dataDir: string) {
  const rows = readCsv(dataDir, CSV_FILES.slogans);
  let count = 0;

  for (const row of rows) {
    for (const col of VIOLENCE_COLUMNS) {
      const altCol = Object.keys(row).find((k) => k.toUpperCase().includes(col.split(" ")[0]));
      const text = cleanCell(row[col] ?? (altCol ? row[altCol] : ""));
      if (!text) continue;

      const violenceType = normalizeViolenceType(col);
      const categoryId = await getCategoryId(violenceType);

      await prisma.slogan.create({
        data: { text, violenceType, categoryId: categoryId ?? undefined },
      });

      await prisma.content.create({
        data: {
          type: "slogan",
          title: text.slice(0, 80),
          summary: text,
          body: text,
          violenceType,
          categoryId: categoryId ?? undefined,
          audience: "GERAL",
          searchText: text.toLowerCase(),
          metadata: JSON.stringify({ source: "slogans_csv" }),
        },
      });
      count++;
    }
  }
  console.log(`Seeded ${count} slogans`);
}
