"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Box } from "@/lib/box";
import styles from "./BibliotecaFilters.module.css";

const TYPES = [
  { value: "", label: "Todos" },
  { value: "video", label: "Vídeo" },
  { value: "nano", label: "Nano" },
  { value: "micro", label: "Micro" },
  { value: "seasonal", label: "Sazonal" },
  { value: "slogan", label: "Slogan" },
];

interface BibliotecaFiltersProps {
  categories: { slug: string; name: string }[];
  currentType?: string;
  currentCategory?: string;
  currentLayer?: string;
}

export function BibliotecaFilters({
  categories,
  currentType = "",
  currentCategory = "",
  currentLayer = "",
}: BibliotecaFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`/biblioteca?${params.toString()}`);
  }

  function clearAll() {
    router.push("/biblioteca");
  }

  const filterContent = (
    <>
      <Box className={styles.group}>
        <p className={styles.groupTitle}>Tipo</p>
        <Box className={styles.chips}>
          {TYPES.map((t) => (
            <Chip
              key={t.value || "all"}
              active={currentType === t.value}
              onClick={() => navigate({ type: t.value })}
            >
              {t.label}
            </Chip>
          ))}
        </Box>
      </Box>

      <Box className={styles.group}>
        <p className={styles.groupTitle}>Tema</p>
        <Box className={styles.chips}>
          <Chip active={!currentCategory} onClick={() => navigate({ category: "" })}>
            Todos
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c.slug}
              active={currentCategory === c.slug}
              onClick={() => navigate({ category: c.slug })}
            >
              {c.name}
            </Chip>
          ))}
        </Box>
      </Box>

      <Box className={styles.group}>
        <p className={styles.groupTitle}>Camada</p>
        <Box className={styles.chips}>
          <Chip active={!currentLayer} onClick={() => navigate({ layer: "" })}>
            Todas
          </Chip>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Chip
              key={n}
              active={currentLayer === String(n)}
              onClick={() => navigate({ layer: String(n) })}
            >
              {n}
            </Chip>
          ))}
        </Box>
      </Box>

      <Button variant="ghost" size="sm" onClick={clearAll}>
        Limpar filtros
      </Button>
    </>
  );

  return (
    <>
      <aside className={styles.rail}>{filterContent}</aside>
      <Box className={styles.sheet}>{filterContent}</Box>
    </>
  );
}

export function BibliotecaLayout({ children, filters }: { children: React.ReactNode; filters: React.ReactNode }) {
  return (
    <Box className={styles.layout}>
      {filters}
      {children}
    </Box>
  );
}
