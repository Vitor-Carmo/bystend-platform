"use client";

import { useState } from "react";
import { VIOLENTOMETRO_NIVEIS, type ViolentometroNivel, type ViolentometroZona } from "@/data/violentometro";
import { ViolenceMeter } from "../ViolenceMeter";
import { ViolenceLevelCard } from "../ViolenceLevelCard";
import { ViolenceLegend } from "../ViolenceLegend";
import { Button } from "@/components/ui/Button";
import styles from "./ViolentometroExplorer.module.css";

export function ViolentometroExplorer() {
  const [selected, setSelected] = useState<ViolentometroNivel>(VIOLENTOMETRO_NIVEIS[0]!);
  const [filterZona, setFilterZona] = useState<ViolentometroZona | undefined>();

  const filtered = filterZona
    ? VIOLENTOMETRO_NIVEIS.filter((n) => n.zona === filterZona)
    : VIOLENTOMETRO_NIVEIS;

  function selectFromZona(zona: ViolentometroZona) {
    setFilterZona(zona === filterZona ? undefined : zona);
    const first = VIOLENTOMETRO_NIVEIS.find((n) => n.zona === zona);
    if (first) setSelected(first);
  }

  const chatPrefill = encodeURIComponent(
    `Gostaria de conversar sobre uma situação parecida com: ${selected.titulo}`,
  );

  return (
    <>
      <ViolenceLegend activeZona={filterZona} onSelect={selectFromZona} />

      <div className={styles.layout}>
        <div className={styles.desktopMeter}>
          <ViolenceMeter
            selectedId={selected.id}
            onSelect={(n) => {
              setSelected(n);
              setFilterZona(undefined);
            }}
          />
        </div>
        <ViolenceLevelCard nivel={selected} key={selected.id} />
      </div>

      <div className={styles.timeline}>
        <ol style={{ listStyle: "none", paddingLeft: "1.5rem", position: "relative" }}>
          {filtered.map((n) => (
            <li key={n.id} style={{ marginBottom: "1rem", position: "relative" }}>
              <button
                type="button"
                onClick={() => setSelected(n)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "1rem",
                  borderRadius: "var(--radius-lg)",
                  borderLeft: `4px solid ${n.cor}`,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-subtle)",
                  borderLeftWidth: 4,
                  borderLeftColor: n.cor,
                  cursor: "pointer",
                }}
              >
                <strong>Nível {n.ordem}</strong> — {n.titulo}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.cta}>
        <p className="text-muted" style={{ marginBottom: "var(--space-4)" }}>
          Quer refletir sobre uma situação parecida com orientação baseada em fontes?
        </p>
        <Button href={`/chat?prefill=${chatPrefill}`}>Conversar no chat orientativo</Button>
      </div>
    </>
  );
}
