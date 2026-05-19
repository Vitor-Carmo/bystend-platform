import { ContentCard } from "@/components/ContentCard";
import { Disclaimer } from "@/components/Disclaimer";
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

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; layer?: string }>;
}) {
  const params = await searchParams;
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
    <>
      <h1 style={{ marginBottom: "0.5rem" }}>Biblioteca de conteúdos</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Vídeos, nano e microconteúdos, slogans e materiais sazonais da base Byst.end.
      </p>
      <Disclaimer />

      <form className="filters" method="get">
        <select name="type" defaultValue={params.type ?? ""}>
          <option value="">Todos os tipos</option>
          <option value="video">Vídeo</option>
          <option value="nano">Nano</option>
          <option value="micro">Micro</option>
          <option value="seasonal">Sazonal</option>
          <option value="slogan">Slogan</option>
        </select>
        <select name="category" defaultValue={params.category ?? ""}>
          <option value="">Todos os temas</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="layer" defaultValue={params.layer ?? ""}>
          <option value="">Todas as camadas</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={String(n)}>
              Camada {n}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Filtrar
        </button>
      </form>

      <p style={{ marginBottom: "1rem", color: "var(--muted)" }}>{items.length} conteúdos</p>
      <section className="grid grid-2">
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
      </section>
    </>
  );
}
