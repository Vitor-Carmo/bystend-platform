import { BookOpen, Lightbulb, Shield } from "lucide-react";
import styles from "./HowItHelps.module.css";

const cols = [
  {
    icon: BookOpen,
    title: "Educar",
    desc: "Conteúdos organizados por camadas e temas para construir repertório com segurança.",
  },
  {
    icon: Lightbulb,
    title: "Refletir",
    desc: "Quiz e violentômetro para exercitar o olhar crítico sem julgamentos definitivos.",
  },
  {
    icon: Shield,
    title: "Agir",
    desc: "Orientações iniciais e rotas de saída — sempre priorizando canais oficiais da sua organização.",
  },
];

export function HowItHelps() {
  return (
    <div className={styles.grid}>
      {cols.map((c) => (
        <article key={c.title} className={styles.col}>
          <c.icon className={styles.icon} size={28} aria-hidden />
          <h3 className={styles.title}>{c.title}</h3>
          <p className={styles.desc}>{c.desc}</p>
        </article>
      ))}
    </div>
  );
}
