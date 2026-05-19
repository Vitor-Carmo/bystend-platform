import { prisma } from "../lib/prisma.js";
import {
  buildSearchText,
  cleanCell,
  normalizeViolenceType,
  parseLayerNumber,
} from "../lib/normalize.js";
import { getCategoryId, getLayerId } from "./layers.js";
import { CSV_FILES, readCsv } from "./csv.js";

const NANO_KEYS = [
  "NANOCONTEÚDO 1",
  "NANOCONTEÚDO 2",
  "NANOCONTEÚDO 3",
  "NANOCONTEÚDO 4",
  "NANOCONTEÚDO 5",
  "NANOCONTEÚDO 6",
  "NANOCONTEÚDO 7",
];

function extractMicroText(row: Record<string, string>): string {
  const microKey = Object.keys(row).find((k) => k.toUpperCase().includes("MICRO"));
  const raw = microKey ? cleanCell(row[microKey]) : "";
  if (raw.length > 80) return raw;

  for (const val of Object.values(row)) {
    const v = cleanCell(val);
    if (v.includes("Microconteúdo") || (v.includes("TEMA:") && v.length > 200)) {
      return v;
    }
  }
  return raw;
}

export async function seedNanoContents(dataDir: string) {
  const rows = readCsv(dataDir, CSV_FILES.nano);
  let count = 0;

  for (const row of rows) {
    const externalId = cleanCell(row["ID"]);
    const theme = cleanCell(row["TEMA"]);
    const audience = cleanCell(row["PÚBLICO (TRILHA)"] ?? row["PUBLICO (TRILHA)"]) || "GERAL";
    const violenceType = normalizeViolenceType(
      row["TIPO DE VIOLÊNCIA (ASSUNTO)"] ?? row["TIPO DE VIOLENCIA (ASSUNTO)"] ?? ""
    );
    const layerField =
      row["PROCESSO EVOLUTIVO EDUCACIONAL (CAMADA + DEFINIÇÃO METODOLÓGICA)"] ?? "";
    const layerNumber = parseLayerNumber(layerField);
    const sensitivity = cleanCell(row["GRAU DE SENSIBILIDADE"]);
    const legalRisk = cleanCell(row["RISCO JURÍDICO"]);
    const weekSchedule = cleanCell(row["PROGRAMAÇÃO DISPARO (14 MESES)"]);

    if (!theme) continue;

    const nanoTexts: string[] = [];
    for (const key of NANO_KEYS) {
      const altKey = Object.keys(row).find((k) => k.replace(/\s/g, "").includes(key.replace(/\s/g, "")));
      const text = cleanCell(row[key] ?? (altKey ? row[altKey] : ""));
      if (text) nanoTexts.push(text);
    }

    const microBody = extractMicroText(row);
    const layerId = await getLayerId(layerNumber);
    const categoryId = await getCategoryId(violenceType);

    const content = await prisma.content.create({
      data: {
        externalId: externalId || undefined,
        type: microBody.length > 100 ? "micro" : "nano",
        title: `${theme} — ${violenceType}`,
        theme,
        body: microBody || nanoTexts.join("\n\n"),
        summary: nanoTexts[0]?.slice(0, 200) ?? theme,
        audience,
        violenceType,
        sensitivity: sensitivity || undefined,
        legalRisk: legalRisk || undefined,
        layerId: layerId ?? undefined,
        categoryId: categoryId ?? undefined,
        weekSchedule: weekSchedule || undefined,
        searchText: buildSearchText([theme, violenceType, ...nanoTexts, microBody, legalRisk]),
        metadata: JSON.stringify({ source: "nano_csv", layerField }),
        nanoCards: {
          create: nanoTexts.map((text, i) => ({ order: i + 1, text })),
        },
      },
    });
    count++;
    void content;
  }

  const layerRows = readCsv(dataDir, CSV_FILES.layers);
  for (const row of layerRows) {
    const theme = cleanCell(row["TEMA"]);
    if (!theme) continue;
    const exists = await prisma.content.findFirst({
      where: { theme, type: { in: ["micro", "nano"] } },
    });
    if (exists) continue;

    const violenceType = normalizeViolenceType(row["TIPO DE VIOLÊNCIA (ASSUNTO)"] ?? "");
    const layerNumber = parseLayerNumber(
      row["PROCESSO EVOLUTIVO EDUCACIONAL (CAMADA + DEFINIÇÃO METODOLÓGICA)"] ?? ""
    );
    const nanoTexts: string[] = [];
    for (let i = 1; i <= 7; i++) {
      const key = `NANOCONTEÚDO ${i}`;
      const alt = Object.keys(row).find((k) => k.includes(`NANOCONTEÚDO ${i}`) || k.includes(`NANOCONTEUDO ${i}`));
      const text = cleanCell(row[key] ?? (alt ? row[alt] : ""));
      if (text) nanoTexts.push(text);
    }
    if (nanoTexts.length === 0) continue;

    const layerId = await getLayerId(layerNumber);
    const categoryId = await getCategoryId(violenceType);
    const microUrl = cleanCell(row["micro (nivel 2)"] ?? "");

    await prisma.content.create({
      data: {
        type: "micro",
        title: `${theme} — ${violenceType}`,
        theme,
        url: microUrl.startsWith("http") ? microUrl : undefined,
        mediaUrl: microUrl.startsWith("http") ? microUrl : undefined,
        audience: cleanCell(row["PÚBLICO (TRILHA)"]) || "GERAL",
        violenceType,
        sensitivity: cleanCell(row["GRAU DE SENSIBILIDADE"]) || undefined,
        legalRisk: cleanCell(row["RISCO JURÍDICO"]) || undefined,
        layerId: layerId ?? undefined,
        categoryId: categoryId ?? undefined,
        body: nanoTexts.join("\n"),
        summary: nanoTexts[0]?.slice(0, 200),
        searchText: buildSearchText([theme, violenceType, ...nanoTexts]),
        metadata: JSON.stringify({ source: "layers_csv" }),
        nanoCards: {
          create: nanoTexts.map((text, i) => ({ order: i + 1, text })),
        },
      },
    });
    count++;
  }

  console.log(`Seeded ${count} nano/micro theme bundles`);
}
