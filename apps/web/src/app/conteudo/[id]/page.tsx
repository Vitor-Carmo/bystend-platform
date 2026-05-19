import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { api } from "@/lib/api";

interface NanoCard {
  order: number;
  text: string;
}

interface ContentDetail {
  id: string;
  title: string;
  type: string;
  summary?: string | null;
  body?: string | null;
  url?: string | null;
  theme?: string | null;
  violenceType?: string | null;
  sensitivity?: string | null;
  legalRisk?: string | null;
  layer?: { number: number; name: string } | null;
  category?: { name: string } | null;
  nanoCards: NanoCard[];
}

export default async function ConteudoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let content: ContentDetail | null = null;
  try {
    content = await api<ContentDetail>(`/contents/${id}`);
  } catch {
    notFound();
  }

  if (!content) notFound();

  return (
    <>
      <Link href="/biblioteca" style={{ fontSize: "0.9rem" }}>
        ← Voltar à biblioteca
      </Link>
      <h1 style={{ margin: "1rem 0 0.5rem" }}>{content.title}</h1>
      <p style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <span className="badge">{content.type}</span>
        {content.violenceType && <span className="badge">{content.violenceType}</span>}
        {content.layer && <span className="badge">Camada {content.layer.number}: {content.layer.name}</span>}
      </p>
      <Disclaimer />

      {content.summary && <p style={{ marginBottom: "1rem" }}>{content.summary}</p>}

      {content.nanoCards.length > 0 && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ marginBottom: "0.75rem" }}>Nano conteúdos</h2>
          <ol style={{ paddingLeft: "1.25rem" }}>
            {content.nanoCards.map((n) => (
              <li key={n.order} style={{ marginBottom: "0.75rem" }}>
                {n.text}
              </li>
            ))}
          </ol>
        </section>
      )}

      {content.body && (
        <section className="card" style={{ marginBottom: "1.5rem", whiteSpace: "pre-wrap" }}>
          <h2 style={{ marginBottom: "0.75rem" }}>Microconteúdo</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>{content.body.slice(0, 8000)}</p>
        </section>
      )}

      {content.url && (
        <a href={content.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Abrir vídeo / recurso externo
        </a>
      )}

      {(content.sensitivity || content.legalRisk) && (
        <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
          Sensibilidade: {content.sensitivity ?? "—"} · Risco jurídico: {content.legalRisk ?? "—"}
        </p>
      )}
    </>
  );
}
