"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { api } from "@/lib/api";
import { fetchProgress, markContentComplete } from "@/lib/progress";

interface PathItem {
  order: number;
  content: {
    id: string;
    title: string;
    type: string;
    theme?: string | null;
    layer?: { number: number; name: string; slug?: string } | null;
  };
}

interface LearningPath {
  id?: string;
  slug: string;
  title: string;
  description?: string | null;
  items: PathItem[];
}

const PATH_SLUG = "reconhecer-e-agir";

export default function TrilhaPage() {
  const [path, setPath] = useState<LearningPath | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pathData, progress] = await Promise.all([
        api<LearningPath>(`/learning-paths/${PATH_SLUG}`),
        fetchProgress(),
      ]);
      setPath(pathData);
      setCompletedIds(new Set(progress.completedIds));
    } catch {
      setPath(null);
      setError("Não foi possível carregar a trilha. Verifique se a API está em execução.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleMarkComplete(contentId: string) {
    if (completedIds.has(contentId) || savingId) return;
    setSavingId(contentId);
    setError(null);
    try {
      const progress = await markContentComplete(contentId, path?.id);
      setCompletedIds(new Set(progress.completedIds));
    } catch {
      setError("Não foi possível salvar seu progresso. Tente novamente.");
    } finally {
      setSavingId(null);
    }
  }

  const total = path?.items.length ?? 0;
  const completed =
    path?.items.filter((item) => completedIds.has(item.content.id)).length ?? 0;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  if (loading) {
    return (
      <>
        <h1 style={{ marginBottom: "0.5rem" }}>Trilha educativa</h1>
        <p style={{ color: "var(--muted)" }}>Carregando sua jornada...</p>
      </>
    );
  }

  return (
    <>
      <h1 style={{ marginBottom: "0.5rem" }}>Trilha educativa</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        {path?.description ?? "Percorra conteúdos organizados pelas camadas educacionais da Byst.end."}
      </p>
      <Disclaimer />

      {error && (
        <p style={{ color: "var(--warning)", marginBottom: "1rem" }} role="alert">
          {error}
        </p>
      )}

      {path ? (
        <>
          <h2 style={{ marginBottom: "0.5rem" }}>{path.title}</h2>
          <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
            {completed} de {total} etapas concluídas · {pct}% da trilha
          </p>
          <p className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${pct}%` }} />
          </p>

          <ol style={{ listStyle: "none", marginTop: "1.5rem" }}>
            {path.items.map((item, idx) => {
              const done = completedIds.has(item.content.id);
              return (
                <li
                  key={item.content.id}
                  className="card"
                  style={{
                    marginBottom: "0.75rem",
                    borderColor: done ? "var(--success)" : undefined,
                  }}
                >
                  <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    Etapa {idx + 1}
                    {item.content.layer ? ` · ${item.content.layer.name}` : ""}
                    {done ? " · Concluída" : ""}
                  </span>
                  <h3 style={{ margin: "0.35rem 0" }}>
                    <Link href={`/conteudo/${item.content.id}`}>{item.content.title}</Link>
                  </h3>
                  <span className="badge">{item.content.type}</span>
                  <div style={{ marginTop: "0.75rem" }}>
                    <button
                      type="button"
                      className={done ? "btn btn-secondary" : "btn btn-primary"}
                      disabled={done || savingId === item.content.id}
                      onClick={() => handleMarkComplete(item.content.id)}
                    >
                      {done ? "Concluída" : savingId === item.content.id ? "Salvando..." : "Marcar como concluída"}
                    </button>
                  </div>
                </li>
              );
            })}
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
