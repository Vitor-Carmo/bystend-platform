import Link from "next/link";
import { Shield } from "lucide-react";
import type { ChatSource } from "@bystend/shared";
import { cn } from "@/lib/cn";
import styles from "./ChatBubble.module.css";

const Box = "div" as const;

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  disclaimer?: string;
  highRisk?: boolean;
}

export function ChatBubble({ role, content, sources, disclaimer, highRisk }: ChatBubbleProps) {
  return (
    <Box className={cn(styles.bubble, styles[role])}>
      <span className={styles.avatar} aria-hidden>
        {role === "user" ? "Você" : "B"}
      </span>
      <Box className={cn(styles.content, highRisk && styles.highRisk)}>
        {highRisk && (
          <p className={styles.riskBanner}>
            <Shield size={14} aria-hidden />
            Tema sensível: priorize canais oficiais de apoio da sua organização.
          </p>
        )}
        <p>{content}</p>
        {sources && sources.length > 0 && (
          <Box className={styles.sources}>
            <p className={styles.sourcesTitle}>Fontes consultadas na base Byst.end</p>
            <Box className={styles.sourceList}>
              {sources.map((s) => (
                <Link key={s.id} href={`/conteudo/${s.id}`} className={styles.sourceLink}>
                  {s.title}
                </Link>
              ))}
            </Box>
          </Box>
        )}
        {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
      </Box>
    </Box>
  );
}
