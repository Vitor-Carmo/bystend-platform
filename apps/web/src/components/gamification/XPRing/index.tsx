"use client";

import styles from "./XPRing.module.css";

const Box = "div" as const;

interface XPRingProps {
  percent: number;
  label?: string;
}

export function XPRing({ percent, label = "progresso" }: XPRingProps) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <Box className={styles.wrap} role="img" aria-label={`${Math.round(percent)}% ${label}`}>
      <svg className={styles.svg} viewBox="0 0 88 88">
        <defs>
          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle className={styles.track} cx="44" cy="44" r={r} />
        <circle
          className={styles.fill}
          cx="44"
          cy="44"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <Box className={styles.center}>
        <span className={styles.pct}>{Math.round(percent)}%</span>
        <span className={styles.label}>{label}</span>
      </Box>
    </Box>
  );
}
