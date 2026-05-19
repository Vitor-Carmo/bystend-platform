import { prisma } from "../lib/prisma.js";
import { buildSearchText, cleanCell, normalizeViolenceType, parseLayerNumber } from "../lib/normalize.js";
import { getCategoryId, getLayerId } from "./layers.js";
import { CSV_FILES, readCsv } from "./csv.js";

function parseSeasonalDate(period: string): Date | null {
  const p = cleanCell(period);
  const match = p.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const [, d, m, y] = match;
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  }
  return null;
}

export async function seedSeasonal(dataDir: string) {
  const rows = readCsv(dataDir, CSV_FILES.seasonal);
  let count = 0;

  for (const row of rows) {
    const period = cleanCell(row["PERIODO"] ?? row["PERÍODO"]);
    const theme = cleanCell(row["TEMA"]);
    const externalId = cleanCell(row["ID"]);
    const violenceRaw = row["TIPO DE VIOLÊNCIA  (N"] ?? row["TIPO DE VIOLÊNCIA (ASSUNTO)"] ?? "";
    const violenceType = normalizeViolenceType(violenceRaw || "GERAL");
    const layerNumber = parseLayerNumber(
      row["PROCESSO EVOLUTIVO EDUCACIONAL (CAMADA + DEFINIÇÃO METODOLÓGICA)"] ?? ""
    );

    const nanoUnique = cleanCell(
      row["NANOCONTEÚDO -  ÚNICO"] ?? row["NANOCONTEÚDO - ÚNICO"] ?? ""
    );
    const nanoTexts: string[] = [];
    if (nanoUnique) nanoTexts.push(nanoUnique);
    for (let i = 1; i <= 7; i++) {
      const key = `NANOCONTEÚDO ${i}`;
      const text = cleanCell(row[key] ?? "");
      if (text) nanoTexts.push(text);
    }

    const title = theme || period || `Conteúdo sazonal ${externalId}`;
    const layerId = await getLayerId(layerNumber);
    const categoryId = await getCategoryId(violenceType);

    await prisma.content.create({
      data: {
        externalId: externalId || undefined,
        type: "seasonal",
        title,
        theme: title,
        body: nanoTexts.join("\n\n"),
        summary: nanoUnique.slice(0, 300) || title,
        audience: cleanCell(row["PÚBLICO (TRILHA)"]) || "GERAL",
        violenceType,
        sensitivity: cleanCell(row["GRAU DE SENSIBILIDADE"]) || undefined,
        legalRisk: cleanCell(row["RISCO JURÍDICO"]) || undefined,
        layerId: layerId ?? undefined,
        categoryId: categoryId ?? undefined,
        seasonalDate: parseSeasonalDate(period),
        seasonalPeriod: period || undefined,
        searchText: buildSearchText([title, period, violenceType, ...nanoTexts]),
        metadata: JSON.stringify({ source: "seasonal_csv", period }),
        nanoCards: {
          create: nanoTexts.map((text, i) => ({ order: i + 1, text })),
        },
      },
    });
    count++;
  }
  console.log(`Seeded ${count} seasonal contents`);
}
