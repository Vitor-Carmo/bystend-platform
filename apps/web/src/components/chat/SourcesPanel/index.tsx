import Link from "next/link";
import type { ChatSource } from "@bystend/shared";
import styles from "./SourcesPanel.module.css";

interface SourcesPanelProps {
  sources: ChatSource[];
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>Fontes da última resposta</h2>
      {sources.length === 0 ? (
        <p className={styles.empty}>As fontes aparecerão aqui após a primeira resposta.</p>
      ) : (
        sources.map((s) => (
          <Link key={s.id} href={`/conteudo/${s.id}`} className={styles.card}>
            {s.title}
          </Link>
        ))
      )}
    </aside>
  );
}
