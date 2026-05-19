export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function stripEmojis(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanCell(value: string | undefined | null): string {
  if (!value) return "";
  return value.replace(/\r\n/g, "\n").trim();
}

export function parseLayerNumber(layerText: string): number | null {
  const match = layerText.match(/CAMADA\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

export function normalizeViolenceType(raw: string): string {
  const t = cleanCell(raw).toUpperCase();
  if (t.includes("MICROAGRESS")) return "MICROAGRESSÕES";
  if (t.includes("DISCRIMIN")) return "DISCRIMINAÇÃO";
  if (t.includes("ASSÉDIO MORAL") || t.includes("ASSEDIO MORAL")) return "ASSÉDIO MORAL";
  if (t.includes("ASSÉDIO SEXUAL") || t.includes("ASSEDIO SEXUAL")) return "ASSÉDIO SEXUAL";
  if (t.includes("IMPORTUNA")) return "IMPORTUNAÇÃO SEXUAL";
  if (t.includes("ESTUPRO")) return "ESTUPRO";
  if (t.includes("VIOLÊNCIA DIGITAL") || t.includes("BULLYING")) return "VIOLÊNCIA DIGITAL";
  return cleanCell(raw) || "GERAL";
}

export function categorySlugFromViolence(violence: string): string {
  const map: Record<string, string> = {
    "MICROAGRESSÕES": "microagressoes",
    "DISCRIMINAÇÃO": "discriminacao",
    "ASSÉDIO MORAL": "assedio-moral",
    "ASSÉDIO SEXUAL": "assedio-sexual",
    "IMPORTUNAÇÃO SEXUAL": "importunacao-sexual",
    "ESTUPRO": "estupro",
    "VIOLÊNCIA DIGITAL": "violencia-digital",
  };
  return map[violence] ?? slugify(violence);
}

export function buildSearchText(parts: (string | null | undefined)[]): string {
  return stripEmojis(parts.filter(Boolean).join(" ")).toLowerCase();
}

export function isHighLegalRisk(risk: string | null | undefined): boolean {
  if (!risk) return false;
  const r = risk.toUpperCase();
  return r.includes("ALTO") || r.includes("CRÍTICO") || r.includes("CRITICO") || r.includes("MUITO ALTO");
}
