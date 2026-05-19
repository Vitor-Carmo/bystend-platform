import { Disclaimer } from "@/components/Disclaimer";
import { Hero } from "@/components/home/Hero";
import { StatsRow } from "@/components/home/StatsRow";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { SeasonalCarousel } from "@/components/home/SeasonalCarousel";
import { HowItHelps } from "@/components/home/HowItHelps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ContentCard } from "@/components/biblioteca/ContentCard";
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
    seasonal = seasonalRes.items.slice(0, 6);
    const contentsRes = await api<{ items: ContentItem[] }>("/contents?type=micro&limit=6");
    featured = contentsRes.items;
  } catch {
    /* API offline */
  }

  return (
    <>
      <Hero />
      <StatsRow />
      <Disclaimer />

      <section style={{ marginBottom: "var(--space-12)" }}>
        <SectionHeader eyebrow="Explorar" title="Comece por aqui" subtitle="Escolha um caminho para mergulhar no conteúdo Byst.end." />
        <FeatureGrid />
      </section>

      {seasonal.length > 0 && (
        <Reveal>
          <section style={{ marginBottom: "var(--space-12)" }}>
            <SectionHeader title="Em destaque agora" subtitle="Conteúdos sazonais selecionados para o momento." />
            <SeasonalCarousel items={seasonal} />
          </section>
        </Reveal>
      )}

      {featured.length > 0 && (
        <Reveal delay={0.1}>
          <section style={{ marginBottom: "var(--space-12)" }}>
            <SectionHeader title="Microconteúdos em destaque" />
            <div className="grid grid-3">
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
        </Reveal>
      )}

      <Reveal delay={0.15}>
        <section>
          <SectionHeader title="Como a Byst.end ajuda" subtitle="Uma jornada pensada para contextos sensíveis no trabalho." />
          <HowItHelps />
        </section>
      </Reveal>
    </>
  );
}
