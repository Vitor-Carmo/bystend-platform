import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

export function readCsv(dataDir: string, filename: string): Record<string, string>[] {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`CSV not found: ${filePath}`);
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  }) as Record<string, string>[];
}

export const CSV_FILES = {
  videos: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 1. VÍDEOS (PALESTRAS, WEBINARES.csv",
  nano: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.3. NANO CONTEÚDOS.csv",
  layers: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.2. CAMADAS E TEMAS.csv",
  seasonal: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.4. CONTEÚDOS SAZONAIS.csv",
  slogans: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.5 SLOGANS.csv",
} as const;
