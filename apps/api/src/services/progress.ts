import { prisma } from "../lib/prisma.js";

export interface ProgressPayload {
  quizScore: number;
  quizTotal: number;
  completedIds: string[];
  completedLayers: string[];
}

const EMPTY_PROGRESS: ProgressPayload = {
  quizScore: 0,
  quizTotal: 0,
  completedIds: [],
  completedLayers: [],
};

function parseStringArray(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return [];
  }
}

function mergeUnique(existing: string[], additions: string[]): string[] {
  return [...new Set([...existing, ...additions])];
}

export function toProgressPayload(row: {
  quizScore: number;
  quizTotal: number;
  completedIds: string;
  completedLayers: string;
}): ProgressPayload {
  return {
    quizScore: Math.max(0, row.quizScore),
    quizTotal: Math.max(0, row.quizTotal),
    completedIds: parseStringArray(row.completedIds),
    completedLayers: parseStringArray(row.completedLayers),
  };
}

export async function getProgressBySessionId(sessionId: string): Promise<ProgressPayload> {
  const progress = await prisma.userProgress.findUnique({ where: { sessionId } });
  if (!progress) return { ...EMPTY_PROGRESS };
  return toProgressPayload(progress);
}

export async function upsertProgressFields(
  sessionId: string,
  fields: {
    completedContentId?: string;
    completedLayerSlug?: string;
    pathId?: string;
  }
): Promise<ProgressPayload> {
  const existing = await prisma.userProgress.findUnique({ where: { sessionId } });

  let completedIds = existing ? parseStringArray(existing.completedIds) : [];
  let completedLayers = existing ? parseStringArray(existing.completedLayers) : [];

  if (fields.completedContentId) {
    completedIds = mergeUnique(completedIds, [fields.completedContentId]);
  }
  if (fields.completedLayerSlug) {
    completedLayers = mergeUnique(completedLayers, [fields.completedLayerSlug]);
  }

  const row = await prisma.userProgress.upsert({
    where: { sessionId },
    create: {
      sessionId,
      pathId: fields.pathId ?? null,
      completedIds: JSON.stringify(completedIds),
      completedLayers: JSON.stringify(completedLayers),
    },
    update: {
      ...(fields.pathId !== undefined ? { pathId: fields.pathId } : {}),
      completedIds: JSON.stringify(completedIds),
      completedLayers: JSON.stringify(completedLayers),
    },
  });

  return toProgressPayload(row);
}
