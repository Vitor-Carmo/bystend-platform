import Link from "next/link";
import {
  Library,
  Search,
  Route,
  Gauge,
  MessageCircle,
} from "lucide-react";
import styles from "./FeatureGrid.module.css";

const features = [
  {
    href: "/biblioteca",
    icon: Library,
    title: "Biblioteca",
    desc: "Vídeos, nano e microconteúdos organizados por tema e camada educacional.",
  },
  {
    href: "/busca",
    icon: Search,
    title: "Busca inteligente",
    desc: "Encontre materiais por palavra-chave, tema ou situação prática.",
  },
  {
    href: "/trilha",
    icon: Route,
    title: "Trilha educativa",
    desc: "Percorra as 8 camadas do processo evolutivo educacional da Byst.end.",
  },
  {
    href: "/violentometro",
    icon: Gauge,
    title: "Violentômetro",
    desc: "Entenda a escalada da violência no trabalho, do cuidado inicial até situações graves.",
  },
  {
    href: "/chat",
    icon: MessageCircle,
    title: "Chat orientativo",
    desc: "Tire dúvidas hipotéticas com respostas baseadas na base e indicação de fontes.",
  },
];

export function FeatureGrid() {
  return (
    <div className={styles.grid}>
      {features.map((f) => (
        <Link key={f.href} href={f.href} className={styles.card}>
          <span className={styles.icon}>
            <f.icon size={22} aria-hidden />
          </span>
          <h3 className={styles.title}>{f.title}</h3>
          <p className={styles.desc}>{f.desc}</p>
        </Link>
      ))}
    </div>
  );
}
