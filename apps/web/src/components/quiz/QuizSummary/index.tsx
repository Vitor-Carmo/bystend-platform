"use client";

import { Button } from "@/components/ui/Button";
import { StreakIndicator } from "@/components/gamification/StreakIndicator";
import styles from "./QuizSummary.module.css";

const Box = "div" as const;

interface QuizSummaryProps {
  runScore: number;
  total: number;
  xpGained: number;
  streak: number;
  savedScore: number;
  savedTotal: number;
  onRetry: () => void;
}

export function QuizSummary({
  runScore,
  total,
  xpGained,
  streak,
  savedScore,
  savedTotal,
  onRetry,
}: QuizSummaryProps) {
  const pct = total ? Math.round((runScore / total) * 100) : 0;

  return (
    <article className={styles.summary}>
      <Box className={styles.confetti} aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className={styles.dot}
            style={{
              left: `${10 + i * 7}%`,
              top: `${20 + (i % 3) * 10}%`,
              background: i % 2 ? "var(--accent)" : "var(--accent-2)",
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </Box>
      <Box className={styles.ring} style={{ "--pct": pct } as React.CSSProperties}>
        <Box className={styles.ringInner}>
          <span className={styles.score}>
            {runScore}/{total}
          </span>
          <span className="text-muted" style={{ fontSize: "var(--text-xs)" }}>
            acertos
          </span>
        </Box>
      </Box>
      <h2>Quiz concluído</h2>
      <p className={styles.xp}>+{xpGained} XP nesta rodada</p>
      <StreakIndicator count={streak} />
      <p className="text-muted" style={{ marginTop: "var(--space-4)", fontSize: "var(--text-sm)" }}>
        Histórico na sessão: {savedScore} acertos em {savedTotal} respostas.
      </p>
      <Box className={styles.actions}>
        <Button variant="secondary" onClick={onRetry}>
          Refazer
        </Button>
        <Button href="/trilha">Voltar à trilha</Button>
      </Box>
    </article>
  );
}
