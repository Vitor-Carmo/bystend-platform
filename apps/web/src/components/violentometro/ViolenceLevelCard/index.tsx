import type { ViolentometroNivel } from "@/data/violentometro";
import { VIOLENTOMETRO_ZONAS } from "@/data/violentometro";
import styles from "./ViolenceLevelCard.module.css";

interface ViolenceLevelCardProps {
  nivel: ViolentometroNivel;
}

export function ViolenceLevelCard({ nivel }: ViolenceLevelCardProps) {
  const zona = VIOLENTOMETRO_ZONAS[nivel.zona];

  return (
    <article
      className={styles.card}
      style={{ "--zone-color": nivel.cor } as React.CSSProperties}
    >
      <span className={styles.faixa}>
        Nível {nivel.ordem} · {zona.label}
      </span>
      <h2 className={styles.title}>{nivel.titulo}</h2>
      <p className={styles.desc}>{nivel.descricao}</p>
      <p className={styles.block}>
        <strong>Exemplo: </strong>
        {nivel.exemplo}
      </p>
      <p className={styles.block}>
        <strong>Rota de saída: </strong>
        {nivel.rotaSaida}
      </p>
    </article>
  );
}
