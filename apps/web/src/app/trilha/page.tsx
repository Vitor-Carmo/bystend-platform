"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { PathTimeline } from "@/components/trilha/PathTimeline";
import { XPRing } from "@/components/gamification/XPRing";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { AchievementGrid } from "@/components/gamification/AchievementGrid";
import { api } from "@/lib/api";
import { fetchProgress, markContentComplete } from "@/lib/progress";
import { computeXP, computeLevel, evaluateAchievements } from "@/lib/gamification";
import styles from "./trilha.module.css";

interface PathItem {
  order: number;
  content: {
    id: string;
    title: string;
    type: string;
    layer?: { number: number; name: string } | null;
  };
}

interface LearningPath {
  id?: string;
  slug: string;
  title: string;
  description?: string | null;
  items: PathItem[];
}

const PATH_SLUG = "reconhecer-e-agir";

export default function TrilhaPage() {
  const [path, setPath] = useState<LearningPath | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [quizScore, setQuizScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pathData, progress] = await Promise.all([
        api<LearningPath>(`/learning-paths/${PATH_SLUG}`),
        fetchProgress(),
      ]);
      setPath(pathData);
      setCompletedIds(new Set(progress.completedIds));
      setQuizScore(progress.quizScore);
    } catch {
      setPath(null);
      setError("Não foi possível carregar a trilha. Verifique se a API está em execução.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleMarkComplete(contentId: string) {
    if (completedIds.has(contentId) || savingId) return;
    setSavingId(contentId);
    setError(null);
    try {
      const progress = await markContentComplete(contentId, path?.id);
      setCompletedIds(new Set(progress.completedIds));
      evaluateAchievements({ completedCount: progress.completedIds.length });
      setToast("Etapa salva no seu progresso.");
      setTimeout(() => setToast(null), 3000);
    } catch {
      setError("Não foi possível salvar seu progresso. Tente novamente.");
    } finally {
      setSavingId(null);
    }
  }

  const total = path?.items.length ?? 0;
  const completed = path?.items.filter((item) => completedIds.has(item.content.id)).length ?? 0;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const xp = computeXP({ quizScore, quizTotal: 0, completedIds: [...completedIds], completedLayers: [] });
  const level = computeLevel(xp);
  const activeIndex = path?.items.findIndex((i) => !completedIds.has(i.content.id)) ?? 0;

  if (loading) {
    return (
      <>
        <SectionHeader title="Trilha educativa" subtitle="Carregando sua jornada..." />
      </>
    );
  }

  return (
    <>
      <SectionHeader
        eyebrow="Jornada"
        title="Trilha educativa"
        subtitle={path?.description ?? "Percorra conteúdos organizados pelas camadas educacionais da Byst.end."}
      />
      <Disclaimer />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {path ? (
        <>
          <div className={styles.hero}>
            <XPRing percent={pct} label="trilha" />
            <div>
              <h2 className={styles.pathTitle}>{path.title}</h2>
              <LevelBadge level={level.level} name={level.name} />
              <p className="text-muted" style={{ marginTop: "var(--space-3)" }}>
                {completed} de {total} etapas · {pct}% concluído
              </p>
              <ProgressBar value={pct} shimmer className={styles.bar} />
            </div>
          </div>

          <PathTimeline
            items={path.items}
            completedIds={completedIds}
            activeIndex={activeIndex < 0 ? total - 1 : activeIndex}
            savingId={savingId}
            onMarkComplete={(id) => void handleMarkComplete(id)}
          />

          <section className={styles.achievements}>
            <h3 className={styles.achTitle}>Conquistas</h3>
            <AchievementGrid />
          </section>

          <Button href="/quiz" iconRight={<ArrowRight size={18} />}>
            Fazer quiz da trilha
          </Button>
        </>
      ) : (
        <p>Trilha indisponível. Verifique se a API está rodando.</p>
      )}

      <Toast message={toast} variant="success" />
    </>
  );
}
