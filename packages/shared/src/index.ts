export type ContentType =
  | "video"
  | "nano"
  | "micro"
  | "seasonal"
  | "slogan"
  | "theme_bundle"
  | "reference";

export interface ContentSummary {
  id: string;
  type: ContentType;
  title: string;
  summary?: string | null;
  theme?: string | null;
  violenceType?: string | null;
  audience?: string;
  sensitivity?: string | null;
  legalRisk?: string | null;
  url?: string | null;
  layer?: { number: number; name: string } | null;
  category?: { slug: string; name: string } | null;
}

export interface SearchResult extends ContentSummary {
  score: number;
  snippet?: string;
}

export interface ChatSource {
  id: string;
  title: string;
  type: ContentType;
  theme?: string | null;
}

export interface ChatResponse {
  message: string;
  sources: ChatSource[];
  disclaimer: string;
  highRisk: boolean;
}

export interface QuizAnswerResponse {
  correct: boolean;
  explanation: string;
  relatedContentIds: string[];
}

export const CHAT_DISCLAIMER =
  "Esta orientação é educativa e baseada nos materiais da Byst.end. Não substitui RH, jurídico, compliance, canal de denúncia ou apoio especializado.";

export const LAYER_DEFINITIONS = [
  { number: 1, slug: "conhecimento-basico", name: "Conhecimento Básico", description: "Informativo" },
  { number: 2, slug: "diferenciacao-limites", name: "Diferenciação de Limites", description: "Educativo" },
  { number: 3, slug: "reconhecimento-condutas", name: "Reconhecimento de Condutas", description: "Exemplificativo" },
  { number: 4, slug: "impacto-consequencias", name: "Impacto e Consequências", description: "Alerta" },
  { number: 5, slug: "responsabilidades", name: "Responsabilidades", description: "Responsabilização" },
  { number: 6, slug: "orientacao-vitima", name: "Orientação à Vítima", description: "Proteção" },
  { number: 7, slug: "papel-testemunhas", name: "Papel das Testemunhas", description: "Ação Coletiva" },
  { number: 8, slug: "prevencao-continua", name: "Prevenção Contínua", description: "Cultura" },
] as const;
