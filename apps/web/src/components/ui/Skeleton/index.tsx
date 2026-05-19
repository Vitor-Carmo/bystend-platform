import { cn } from "@/lib/cn";
import styles from "./Skeleton.module.css";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn(styles.skeleton, className)} aria-hidden />;
}

export function SkeletonCard() {
  return (
    <div className={cn(styles.skeleton, styles.card)} aria-hidden>
      <Skeleton className={styles.line} />
      <Skeleton className={cn(styles.line, styles.lineShort)} />
    </div>
  );
}
