import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { Breadcrumb } from "@/components/conteudo/Breadcrumb";
import { RelatedContents } from "@/components/conteudo/RelatedContents";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { api } from "@/lib/api";
import { Box } from "@/lib/box";
import styles from "./conteudo.module.css";

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
  category?: { name: string; slug?: string } | null;
  nanoCards: NanoCard[];
}

function sensitivityPercent(s?: string | null): number {
  if (!s) return 0;
  const map: Record<string, number> = { low: 25, medium: 50, high: 75, critical: 100 };
  return map[s.toLowerCase()] ?? 40;
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

  const sensPct = sensitivityPercent(content.sensitivity);

  return (
    <>
      <Breadcrumb category={content.category?.name} title={content.title} />

      <header className={styles.hero}>
        <h1 className={styles.title}>{content.title}</h1>
        <div className={styles.badges}>
          <Badge>{content.type}</Badge>
          {content.violenceType && <Badge tone="muted">{content.violenceType}</Badge>}
          {content.layer && (
            <Badge tone="muted">
              Camada {content.layer.number}: {content.layer.name}
            </Badge>
          )}
        </div>
      </header>

      <Disclaimer />

      <Box className={styles.layout}>
        <main className={styles.main}>
          {content.summary && <p className={styles.summary}>{content.summary}</p>}

          {content.nanoCards.length > 0 && (
            <section className={styles.nanoSection}>
              <h2 className={styles.sectionTitle}>Nano conteúdos</h2>
              <ol className={styles.nanoList}>
                {content.nanoCards.map((n) => (
                  <li key={n.order} className={styles.nanoItem}>
                    <span className={styles.nanoNum}>{n.order}</span>
                    <p>{n.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {content.body && (
            <Card variant="surface" className={styles.bodyCard}>
              <h2 className={styles.sectionTitle}>Microconteúdo</h2>
              <div className={`prose ${styles.body}`}>{content.body.slice(0, 8000)}</div>
            </Card>
          )}
        </main>

        <aside className={styles.sidebar}>
          {content.sensitivity && (
            <Card padding="md" className={styles.metaCard}>
              <h3 className={styles.metaTitle}>Sensibilidade do tema</h3>
              <ProgressBar value={sensPct} showLabel label={content.sensitivity} />
            </Card>
          )}

          {content.url && (
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalBtn}
            >
              Abrir vídeo / recurso externo
            </a>
          )}

          {(content.sensitivity || content.legalRisk) && (
            <p className={styles.metaNote}>
              Sensibilidade: {content.sensitivity ?? "—"}
              <br />
              Risco jurídico: {content.legalRisk ?? "—"}
            </p>
          )}

          <Link href="/trilha" className={styles.trilhaLink}>
            Ver na trilha educativa →
          </Link>
        </aside>
      </Box>

      <RelatedContents categorySlug={content.category?.slug} excludeId={content.id} />
    </>
  );
}
