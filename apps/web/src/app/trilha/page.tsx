import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { api } from "@/lib/api";

interface PathItem {
  order: number;
  content: {
    id: string;
    title: string;
    type: string;
    theme?: string | null;
    layer?: { number: number; name: string } | null;
  };
}

interface LearningPath {
  slug: string;
  title: string;
  description?: string | null;
  items: PathItem[];
}

export default async function TrilhaPage() {
  let path: LearningPath | null = null;
  try {
    path = await api<LearningPath>("/learning-paths/reconhecer-e-agir");
  } catch {
    /* offline */
  }

  const completed = 0;
  const total = path?.items.length ?? 0;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      <h1 style={{ marginBottom: "0.5rem" }}>Trilha educativa</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        {path?.description ?? "Percorra conteúdos organizados pelas camadas educacionais da Byst.end."}
      </p>
      <Disclaimer />

      {path ? (
        <>
          <h2 style={{ marginBottom: "0.5rem" }}>{path.title}</h2>
          <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
            {total} etapas · progresso demonstrativo {pct}%
          </p>
          <p className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${pct}%` }} />
          </p>

          <ol style={{ listStyle: "none", marginTop: "1.5rem" }}>
            {path.items.map((item, idx) => (
              <li key={item.content.id} className="card" style={{ marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                  Etapa {idx + 1}
                  {item.content.layer ? ` · ${item.content.layer.name}` : ""}
                </span>
                <h3 style={{ margin: "0.35rem 0" }}>
                  <Link href={`/conteudo/${item.content.id}`}>{item.content.title}</Link>
                </h3>
                <span className="badge">{item.content.type}</span>
              </li>
            ))}
          </ol>

          <Link href="/quiz" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
            Fazer quiz da trilha
          </Link>
        </>
      ) : (
        <p>Trilha indisponível. Verifique se a API está rodando.</p>
      )}
    </>
  );
}
