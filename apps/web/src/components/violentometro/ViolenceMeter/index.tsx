"use client";

import { VIOLENTOMETRO_NIVEIS, type ViolentometroNivel } from "@/data/violentometro";
import { cn } from "@/lib/cn";
import styles from "./ViolenceMeter.module.css";

interface ViolenceMeterProps {
  selectedId: string;
  onSelect: (nivel: ViolentometroNivel) => void;
}

export function ViolenceMeter({ selectedId, onSelect }: ViolenceMeterProps) {
  return (
    <div className={styles.meter} role="listbox" aria-label="Níveis do violentômetro">
      {VIOLENTOMETRO_NIVEIS.map((n) => (
        <button
          key={n.id}
          type="button"
          role="option"
          aria-selected={selectedId === n.id}
          className={cn(styles.marker, selectedId === n.id && styles.markerActive)}
          onClick={() => onSelect(n)}
        >
          <span className={styles.num} style={{ background: n.cor, color: "#fff" }}>
            {n.ordem}
          </span>
          <span className={styles.label}>{n.titulo}</span>
        </button>
      ))}
    </div>
  );
}
