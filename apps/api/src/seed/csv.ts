import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";

export const XLSX_BASENAME = "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx";

export const CSV_FILES = {
  videos: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 1. VÍDEOS (PALESTRAS, WEBINARES.csv",
  nano: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.3. NANO CONTEÚDOS.csv",
  layers: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.2. CAMADAS E TEMAS.csv",
  seasonal: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.4. CONTEÚDOS SAZONAIS.csv",
  slogans: "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.5 SLOGANS.csv",
} as const;

/** Prefixo do nome da aba no .xlsx (exportação Google Sheets). */
const CSV_TO_SHEET_PREFIX: Record<string, string> = {
  [CSV_FILES.videos]: "1. VÍDEOS",
  [CSV_FILES.nano]: "2.3. NANO",
  [CSV_FILES.layers]: "2.2. CAMADAS",
  [CSV_FILES.seasonal]: "2.4. CONTEÚDOS",
  [CSV_FILES.slogans]: "2.5 SLOGANS",
};

let workbookCache: { path: string; workbook: XLSX.WorkBook } | null = null;

function rowToStrings(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    const k = String(key).trim();
    if (!k) continue;
    out[k] = value == null ? "" : String(value).trim();
  }
  return out;
}

function findXlsxFile(dataDir: string): string | null {
  const exact = path.join(dataDir, XLSX_BASENAME);
  if (fs.existsSync(exact)) return exact;

  if (!fs.existsSync(dataDir)) return null;

  const files = fs.readdirSync(dataDir).filter((f) => f.toLowerCase().endsWith(".xlsx"));
  const preferred = files.find((f) => f.includes("NANO E MICRO"));
  if (preferred) return path.join(dataDir, preferred);
  if (files.length === 1) return path.join(dataDir, files[0]!);
  return null;
}

function getWorkbook(dataDir: string): XLSX.WorkBook | null {
  const xlsxPath = findXlsxFile(dataDir);
  if (!xlsxPath) return null;

  if (workbookCache?.path === xlsxPath) return workbookCache.workbook;

  const workbook = XLSX.readFile(xlsxPath);
  workbookCache = { path: xlsxPath, workbook };
  console.log(`Using Excel workbook: ${xlsxPath}`);
  return workbook;
}

function findSheetName(sheetNames: string[], prefix: string): string | undefined {
  return sheetNames.find((name) => name.startsWith(prefix) || name.includes(prefix));
}

function readXlsxSheet(dataDir: string, csvFilename: string): Record<string, string>[] {
  const workbook = getWorkbook(dataDir);
  if (!workbook) return [];

  const prefix = CSV_TO_SHEET_PREFIX[csvFilename];
  if (!prefix) return [];

  const sheetName = findSheetName(workbook.SheetNames, prefix);
  if (!sheetName) {
    console.warn(`Sheet not found for prefix "${prefix}" in ${findXlsxFile(dataDir)}`);
    return [];
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  return rows.map(rowToStrings);
}

export function hasXlsxData(dataDir: string): boolean {
  return findXlsxFile(dataDir) !== null;
}

export function readCsv(dataDir: string, filename: string): Record<string, string>[] {
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    return parse(raw, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      bom: true,
    }) as Record<string, string>[];
  }

  const fromXlsx = readXlsxSheet(dataDir, filename);
  if (fromXlsx.length > 0) return fromXlsx;

  if (!findXlsxFile(dataDir)) {
    console.warn(`CSV not found: ${filePath}`);
  }
  return [];
}
