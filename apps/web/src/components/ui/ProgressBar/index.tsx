import { cn } from "@/lib/cn";
import { Box } from "@/lib/box";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
  size?: "sm" | "lg";
  shimmer?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel,
  size = "sm",
  shimmer,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <Box className={className}>
      {(showLabel || label) && (
        <Box className={styles.label}>
          <span>{label}</span>
          <span className="tabular-nums">{Math.round(pct)}%</span>
        </Box>
      )}
      <Box
        className={cn(styles.track, size === "lg" && styles.trackLg, shimmer && styles.shimmer)}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className={styles.fill} style={{ width: `${pct}%` }} />
      </Box>
    </Box>
  );
}

interface SegmentedProgressProps {
  total: number;
  filled: number;
  className?: string;
}

export function SegmentedProgress({ total, filled, className }: SegmentedProgressProps) {
  return (
    <Box className={cn(styles.segments, className)} aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn(styles.segment, i < filled && styles.segmentFilled)} />
      ))}
    </Box>
  );
}
