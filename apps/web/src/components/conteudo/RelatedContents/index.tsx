"use client";

import { useEffect, useState } from "react";
import { ContentCard } from "@/components/biblioteca/ContentCard";
import { api } from "@/lib/api";

interface RelatedContentsProps {
  categorySlug?: string;
  excludeId: string;
}

interface Item {
  id: string;
  title: string;
  type: string;
  summary?: string | null;
}

export function RelatedContents({ categorySlug, excludeId }: RelatedContentsProps) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!categorySlug) return;
    const qs = new URLSearchParams({ category: categorySlug, limit: "4" });
    api<{ items: Item[] }>(`/contents?${qs}`)
      .then((res) => setItems(res.items.filter((i) => i.id !== excludeId).slice(0, 3)))
      .catch(() => setItems([]));
  }, [categorySlug, excludeId]);

  if (items.length === 0) return null;

  return (
    <section style={{ marginTop: "var(--space-10)" }}>
      <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-4)" }}>Conteúdos relacionados</h2>
      <div className="grid grid-3">
        {items.map((c) => (
          <ContentCard key={c.id} id={c.id} title={c.title} type={c.type} summary={c.summary} />
        ))}
      </div>
    </section>
  );
}
