"use client";

import { useState } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { api } from "@/lib/api";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  snippet?: string;
  theme?: string | null;
  violenceType?: string | null;
  score: number;
}

export default function BuscaPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api<{ results: SearchResult[] }>(`/search?q=${encodeURIComponent(q)}`);
      setResults(res.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 style={{ marginBottom: "0.5rem" }}>Busca inteligente</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Exemplo: &quot;Meu gestor faz piadas constrangedoras comigo em reuniões. Isso pode ser assédio?&quot;
      </p>
      <Disclaimer />

      <form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
        <div className="field">
          <label htmlFor="q">Sua pergunta ou palavra-chave</label>
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Descreva a situação ou busque um tema..."
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {searched && (
        <section>
          <h2 style={{ marginBottom: "1rem" }}>{results.length} resultados</h2>
          {results.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>Nenhum conteúdo encontrado. Tente outros termos.</p>
          ) : (
            <ul style={{ listStyle: "none" }}>
              {results.map((r) => (
                <li key={r.id} className="card" style={{ marginBottom: "1rem" }}>
                  <Link href={`/conteudo/${r.id}`}>
                    <span className="badge">{r.type}</span>
                    {r.violenceType && <span className="badge" style={{ marginLeft: "0.5rem" }}>{r.violenceType}</span>}
                    <h3 style={{ margin: "0.5rem 0" }}>{r.title}</h3>
                    {r.snippet && <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{r.snippet}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
