import { Flame } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./StreakIndicator.module.css";

interface StreakIndicatorProps {
  count: number;
  minShow?: number;
}

export function StreakIndicator({ count, minShow = 1 }: StreakIndicatorProps) {
  if (count < minShow) {
    return <span className={cn(styles.streak, styles.inactive)}>Sem sequência ainda</span>;
  }

  return (
    <span className={styles.streak}>
      <Flame size={16} aria-hidden />
      {count} {count === 1 ? "acerto seguido" : "acertos seguidos"}
    </span>
  );
}
