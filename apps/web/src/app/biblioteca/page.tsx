import { Suspense } from "react";
import { ContentCard } from "@/components/biblioteca/ContentCard";
import { BibliotecaFilters, BibliotecaLayout } from "@/components/biblioteca/BibliotecaFilters";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Library } from "lucide-react";
import { api } from "@/lib/api";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  summary?: string | null;
  theme?: string | null;
  violenceType?: string | null;
  layer?: { name: string } | null;
}

interface Category {
  slug: string;
  name: string;
}

async function BibliotecaContent({
  params,
}: {
  params: { type?: string; category?: string; layer?: string };
}) {
  const qs = new URLSearchParams();
  if (params.type) qs.set("type", params.type);
  if (params.category) qs.set("category", params.category);
  if (params.layer) qs.set("layer", params.layer);
  qs.set("limit", "48");

  let items: ContentItem[] = [];
  let categories: Category[] = [];

  try {
    const res = await api<{ items: ContentItem[] }>(`/contents?${qs}`);
    items = res.items;
    categories = await api<Category[]>("/categories");
  } catch {
    /* offline */
  }

  return (
    <BibliotecaLayout
      filters={
        <BibliotecaFilters
          categories={categories}
          currentType={params.type ?? ""}
          currentCategory={params.category ?? ""}
          currentLayer={params.layer ?? ""}
        />
      }
    >
      <div>
        <p className="text-muted" style={{ marginBottom: "var(--space-4)" }}>
          {items.length} conteúdo{items.length !== 1 ? "s" : ""}
        </p>
        {items.length === 0 ? (
          <EmptyState
            icon={<Library size={40} />}
            title="Nenhum conteúdo encontrado"
            description="Tente outros filtros ou volte mais tarde se a API estiver offline."
          />
        ) : (
          <div className="grid grid-2">
            {items.map((c) => (
              <ContentCard
                key={c.id}
                id={c.id}
                title={c.title}
                type={c.type}
                summary={c.summary}
                theme={c.theme}
                violenceType={c.violenceType}
                layerName={c.layer?.name}
              />
            ))}
          </div>
        )}
      </div>
    </BibliotecaLayout>
  );
}

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; layer?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <SectionHeader
        eyebrow="Conteúdos"
        title="Biblioteca"
        subtitle="Vídeos, nano e microconteúdos, slogans e materiais sazonais da base Byst.end."
      />
      <Disclaimer />
      <Suspense fallback={<p className="text-muted">Carregando filtros…</p>}>
        <BibliotecaContent params={params} />
      </Suspense>
    </>
  );
}
