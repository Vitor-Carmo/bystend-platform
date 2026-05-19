import { api, getSessionId } from "@/lib/api";

export interface UserProgressResponse {
  quizScore: number;
  quizTotal: number;
  completedIds: string[];
  completedLayers: string[];
}

export async function fetchProgress(): Promise<UserProgressResponse> {
  const sessionId = getSessionId();
  if (sessionId === "server") {
    return { quizScore: 0, quizTotal: 0, completedIds: [], completedLayers: [] };
  }
  return api<UserProgressResponse>(`/progress/${encodeURIComponent(sessionId)}`);
}

export async function markContentComplete(contentId: string, pathId?: string): Promise<UserProgressResponse> {
  const sessionId = getSessionId();
  return api<UserProgressResponse>("/progress", {
    method: "POST",
    body: JSON.stringify({
      sessionId,
      completedContentId: contentId,
      ...(pathId ? { pathId } : {}),
    }),
  });
}

export async function markLayerComplete(layerSlug: string): Promise<UserProgressResponse> {
  const sessionId = getSessionId();
  return api<UserProgressResponse>("/progress", {
    method: "POST",
    body: JSON.stringify({ sessionId, completedLayerSlug: layerSlug }),
  });
}
