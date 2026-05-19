import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { ContentCard } from "@/components/ContentCard";
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

export default async function HomePage() {
  let seasonal: ContentItem[] = [];
  let featured: ContentItem[] = [];

  try {
    const seasonalRes = await api<{ items: ContentItem[] }>("/seasonal");
    seasonal = seasonalRes.items.slice(0, 3);
    const contentsRes = await api<{ items: ContentItem[] }>("/contents?type=micro&limit=6");
    featured = contentsRes.items;
  } catch {
    /* API may be offline during build */
  }

  return (
    <>
      <section className="hero" style={{ marginBottom: "2rem" }}>
        <h1>Byst.end</h1>
        <p>
          Educação, prevenção e orientação inicial sobre assédio e condutas inadequadas no ambiente
          profissional. Aprenda, busque conteúdos e converse com responsabilidade.
        </p>
      </section>

      <Disclaimer />

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Comece por aqui</h2>
        <div className="grid grid-2">
          <Link href="/biblioteca" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <h3>Biblioteca</h3>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              Vídeos, nano e microconteúdos organizados por tema e camada educacional.
            </p>
          </Link>
          <Link href="/busca" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <h3>Busca inteligente</h3>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              Encontre materiais por palavra-chave, tema ou situação prática.
            </p>
          </Link>
          <Link href="/trilha" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <h3>Trilha educativa</h3>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              Percorra as 8 camadas do processo evolutivo educacional da Byst.end.
            </p>
          </Link>
          <Link href="/violentometro" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <h3>Violentômetro</h3>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              Entenda a escalada da violência no trabalho, do cuidado inicial até situações graves.
            </p>
          </Link>
          <Link href="/chat" className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <h3>Chat orientativo</h3>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              Tire dúvidas hipotéticas com respostas baseadas na base e indicação de fontes.
            </p>
          </Link>
        </div>
      </section>

      {seasonal.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Em destaque agora</h2>
          <div className="grid grid-2">
            {seasonal.map((c) => (
              <ContentCard
                key={c.id}
                id={c.id}
                title={c.title}
                type={c.type}
                summary={c.summary}
                theme={c.theme}
                violenceType={c.violenceType}
              />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section>
          <h2 style={{ marginBottom: "1rem" }}>Microconteúdos em destaque</h2>
          <div className="grid grid-2">
            {featured.map((c) => (
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
        </section>
      )}
    </>
  );
}

