"use client";

import { VIOLENTOMETRO_ZONAS, type ViolentometroZona } from "@/data/violentometro";
import { cn } from "@/lib/cn";
import styles from "./ViolenceLegend.module.css";

import { Box } from "@/lib/box";

const LegendWrap = Box;

interface ViolenceLegendProps {
  activeZona?: ViolentometroZona;
  onSelect?: (zona: ViolentometroZona) => void;
}

export function ViolenceLegend({ activeZona, onSelect }: ViolenceLegendProps) {
  const zonas = Object.entries(VIOLENTOMETRO_ZONAS) as [ViolentometroZona, (typeof VIOLENTOMETRO_ZONAS)[ViolentometroZona]][];

  return (
    <LegendWrap className={styles.legend} role="tablist" aria-label="Zonas do violentômetro">
      {zonas.map(([key, z]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={activeZona === key}
          className={cn(styles.chip, activeZona === key && styles.active)}
          style={{ color: z.cor, borderColor: activeZona === key ? z.cor : undefined }}
          onClick={() => onSelect?.(key)}
        >
          <span className={styles.dot} style={{ background: z.cor }} aria-hidden />
          {z.label}
        </button>
      ))}
    </LegendWrap>
  );
}
