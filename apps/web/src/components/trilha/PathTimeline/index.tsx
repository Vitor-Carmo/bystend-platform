"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import styles from "./PathTimeline.module.css";

interface PathItem {
  order: number;
  content: {
    id: string;
    title: string;
    type: string;
    layer?: { name: string } | null;
  };
}

interface PathTimelineProps {
  items: PathItem[];
  completedIds: Set<string>;
  activeIndex: number;
  savingId: string | null;
  onMarkComplete: (id: string) => void;
}

export function PathTimeline({
  items,
  completedIds,
  activeIndex,
  savingId,
  onMarkComplete,
}: PathTimelineProps) {
  return (
    <ol className={styles.timeline}>
      {items.map((item, idx) => {
        const done = completedIds.has(item.content.id);
        const active = idx === activeIndex && !done;
        return (
          <li key={item.content.id} className={styles.item}>
            <span
              className={cn(styles.dot, done && styles.dotDone, active && styles.dotActive)}
              aria-hidden
            >
              {done && <Check size={10} color="var(--bg)" style={{ margin: "1px" }} />}
            </span>
            <article className={cn(styles.step, done && styles.stepDone)}>
              <p className={styles.meta}>
                Etapa {idx + 1}
                {item.content.layer ? ` · ${item.content.layer.name}` : ""}
                {done ? " · Concluída" : ""}
              </p>
              <h3 className={styles.title}>
                <Link href={`/conteudo/${item.content.id}`}>{item.content.title}</Link>
              </h3>
              <Badge tone="muted">{item.content.type}</Badge>
              <div className={styles.actions}>
                <Button
                  variant={done ? "secondary" : "primary"}
                  size="sm"
                  disabled={done || savingId === item.content.id}
                  loading={savingId === item.content.id}
                  onClick={() => onMarkComplete(item.content.id)}
                >
                  {done ? "Concluída" : "Marcar como concluída"}
                </Button>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
