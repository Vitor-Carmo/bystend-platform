import Link from "next/link";
import { Film, FileText, Layers, Sparkles, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import styles from "./ContentCard.module.css";

const typeIcons: Record<string, React.ReactNode> = {
  video: <Film size={12} aria-hidden />,
  nano: <Layers size={12} aria-hidden />,
  micro: <FileText size={12} aria-hidden />,
  seasonal: <Sparkles size={12} aria-hidden />,
  slogan: <Megaphone size={12} aria-hidden />,
};

interface ContentCardProps {
  id: string;
  title: string;
  type: string;
  summary?: string | null;
  theme?: string | null;
  violenceType?: string | null;
  layerName?: string | null;
}

export function ContentCard({ id, title, type, summary, theme, violenceType, layerName }: ContentCardProps) {
  return (
    <Link href={`/conteudo/${id}`} className={styles.card}>
      <div className={styles.badges}>
        <Badge icon={typeIcons[type]}>{type}</Badge>
        {violenceType && <Badge tone="muted">{violenceType}</Badge>}
        {layerName && <Badge tone="muted">{layerName}</Badge>}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {theme && theme !== title && <p className={styles.theme}>{theme}</p>}
      {summary && <p className={styles.summary}>{summary.slice(0, 160)}…</p>}
    </Link>
  );
}
