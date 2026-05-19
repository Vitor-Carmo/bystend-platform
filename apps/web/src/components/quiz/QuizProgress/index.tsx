import { ProgressBar, SegmentedProgress } from "@/components/ui/ProgressBar";
import { StreakIndicator } from "@/components/gamification/StreakIndicator";
import styles from "./QuizProgress.module.css";

interface QuizProgressProps {
  current: number;
  total: number;
  streak: number;
}

export function QuizProgress({ current, total, streak }: QuizProgressProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.top}>
        <span>
          Pergunta {current} de {total}
        </span>
        <StreakIndicator count={streak} minShow={3} />
      </div>
      <SegmentedProgress total={total} filled={current - 1} />
      <ProgressBar value={(current / total) * 100} shimmer />
    </div>
  );
}
