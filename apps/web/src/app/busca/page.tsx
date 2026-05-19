"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { api } from "@/lib/api";
import { Box } from "@/lib/box";
import styles from "./busca.module.css";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  snippet?: string;
  theme?: string | null;
  violenceType?: string | null;
  score: number;
}

const SUGGESTIONS = [
  "piadas constrangedoras em reuniões",
  "microagressões no trabalho",
  "como reconhecer assédio moral",
];

const RECENT_KEY = "bystend_recent_searches";

function highlightTerms(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className={styles.mark}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function BuscaPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  function saveRecent(term: string) {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  async function handleSearch(term: string) {
    const query = term.trim();
    if (!query) return;
    setQ(query);
    setLoading(true);
    setSearched(true);
    saveRecent(query);
    try {
      const res = await api<{ results: SearchResult[] }>(`/search?q=${encodeURIComponent(query)}`);
      setResults(res.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const maxScore = results.length ? Math.max(...results.map((r) => r.score), 1) : 1;

  return (
    <>
      <SectionHeader
        eyebrow="Descoberta"
        title="Busca inteligente"
        subtitle='Ex.: "Meu gestor faz piadas constrangedoras comigo em reuniões. Isso pode ser assédio?"'
      />
      <Disclaimer />

      <div className={styles.hero}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSearch(q);
          }}
        >
          <Field label="Sua pergunta ou palavra-chave" htmlFor="q" size="large">
            <div className={styles.inputWrap}>
              <Search className={styles.searchIcon} size={20} aria-hidden />
              <Input
                id="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Descreva a situação ou busque um tema..."
                className={styles.searchInput}
              />
            </div>
          </Field>
          <Button type="submit" loading={loading}>
            Buscar
          </Button>
        </form>
      </div>

      {!searched && (
        <div className={styles.suggestions}>
          {recent.length > 0 && (
            <Box>
              <p className={styles.suggestLabel}>Buscas recentes</p>
              <Box className="row">
                {recent.map((r) => (
                  <Chip key={r} onClick={() => void handleSearch(r)}>
                    {r.slice(0, 40)}
                  </Chip>
                ))}
              </Box>
            </Box>
          )}
          <p className={styles.suggestLabel}>Sugestões</p>
          <div className="row">
            {SUGGESTIONS.map((s) => (
              <Chip key={s} onClick={() => void handleSearch(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {searched && (
        <Reveal>
          <section>
            <h2 className={styles.resultsTitle}>{results.length} resultados</h2>
            {results.length === 0 ? (
              <EmptyState
                icon={<Search size={40} />}
                title="Nenhum conteúdo encontrado"
                description="Tente outros termos ou explore a biblioteca."
              />
            ) : (
              <ul className={styles.results}>
                {results.map((r) => (
                  <li key={r.id}>
                    <Card variant="interactive" padding="md">
                      <Link href={`/conteudo/${r.id}`} className={styles.resultLink}>
                        <Box className="row" style={{ marginBottom: "var(--space-2)" }}>
                          <Badge>{r.type}</Badge>
                          {r.violenceType && <Badge tone="muted">{r.violenceType}</Badge>}
                        </Box>
                        <h3 className={styles.resultTitle}>{r.title}</h3>
                        {r.snippet && (
                          <p className={styles.snippet}>{highlightTerms(r.snippet, q)}</p>
                        )}
                        <ProgressBar value={(r.score / maxScore) * 100} label="Relevância" showLabel className={styles.relevance} />
                      </Link>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>
      )}
    </>
  );
}
