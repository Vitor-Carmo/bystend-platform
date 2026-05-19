import type { UserProgressResponse } from "@/lib/progress";

const STREAK_KEY = "bystend_streak";
const ACHIEVEMENTS_KEY = "bystend_achievements";
const CHAT_STARTED_KEY = "bystend_chat_started";

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_reflection", title: "Primeira reflexão", description: "Respondeu sua primeira pergunta no quiz." },
  { id: "streak_5", title: "Sequência atenta", description: "Acertou 5 perguntas seguidas." },
  { id: "path_step", title: "Passo na trilha", description: "Concluiu o primeiro conteúdo da trilha." },
  { id: "chat_started", title: "Conversa iniciada", description: "Enviou a primeira mensagem no chat." },
  { id: "quiz_complete", title: "Rodada completa", description: "Finalizou uma rodada inteira do quiz." },
];

const LEVEL_NAMES = ["Observador", "Aliado", "Multiplicador", "Referência", "Embaixador"];

export function computeXP(progress: UserProgressResponse): number {
  return progress.quizScore * 10 + progress.completedIds.length * 25;
}

export function computeLevel(xp: number): { level: number; name: string; progress: number; nextAt: number } {
  const level = Math.max(1, 1 + Math.floor(xp / 100));
  const currentLevelXp = (level - 1) * 100;
  const nextAt = level * 100;
  const progress = nextAt > currentLevelXp ? ((xp - currentLevelXp) / (nextAt - currentLevelXp)) * 100 : 100;
  const name = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)] ?? "Embaixador";
  return { level, name, progress: Math.min(100, Math.round(progress)), nextAt };
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(localStorage.getItem(STREAK_KEY) ?? 0);
  } catch {
    return 0;
  }
}

export function setStreak(value: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STREAK_KEY, String(Math.max(0, value)));
  } catch {
    /* ignore */
  }
}

export function incrementStreakOnCorrect(): number {
  const next = getStreak() + 1;
  setStreak(next);
  return next;
}

export function resetStreak(): void {
  setStreak(0);
}

export function getUnlockedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function unlockAchievement(id: string): boolean {
  const current = getUnlockedAchievements();
  if (current.includes(id)) return false;
  const next = [...current, id];
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function markChatStarted(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAT_STARTED_KEY, "1");
    unlockAchievement("chat_started");
  } catch {
    /* ignore */
  }
}

export function evaluateAchievements(opts: {
  correct?: boolean;
  streak?: number;
  completedCount?: number;
  quizFinished?: boolean;
  firstAnswer?: boolean;
}): Achievement[] {
  const newly: Achievement[] = [];

  if (opts.firstAnswer && unlockAchievement("first_reflection")) {
    newly.push(ACHIEVEMENTS.find((a) => a.id === "first_reflection")!);
  }
  if ((opts.streak ?? 0) >= 5 && unlockAchievement("streak_5")) {
    newly.push(ACHIEVEMENTS.find((a) => a.id === "streak_5")!);
  }
  if ((opts.completedCount ?? 0) >= 1 && unlockAchievement("path_step")) {
    newly.push(ACHIEVEMENTS.find((a) => a.id === "path_step")!);
  }
  if (opts.quizFinished && unlockAchievement("quiz_complete")) {
    newly.push(ACHIEVEMENTS.find((a) => a.id === "quiz_complete")!);
  }

  return newly;
}
