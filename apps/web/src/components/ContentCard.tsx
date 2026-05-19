import Link from "next/link";

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
  const badgeRow = (
    <span style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
      <span className="badge">{type}</span>
      {violenceType ? <span className="badge">{violenceType}</span> : null}
      {layerName ? <span className="badge">{layerName}</span> : null}
    </span>
  );

  return (
    <Link href={`/conteudo/${id}`} className="card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
      {badgeRow}
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>{title}</h3>
      {theme && theme !== title ? (
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.35rem" }}>{theme}</p>
      ) : null}
      {summary ? <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{summary.slice(0, 160)}…</p> : null}
    </Link>
  );
}
