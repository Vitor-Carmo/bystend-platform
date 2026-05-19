import { ContentCard } from "@/components/biblioteca/ContentCard";
import styles from "./SeasonalCarousel.module.css";

const Carousel = "div" as const;
const Slide = "div" as const;

interface CarouselItem {
  id: string;
  title: string;
  type: string;
  summary?: string | null;
  theme?: string | null;
  violenceType?: string | null;
}

export function SeasonalCarousel({ items }: { items: CarouselItem[] }) {
  return (
    <Carousel className={styles.carousel}>
      {items.map((c) => (
        <Slide key={c.id} className={styles.item}>
          <ContentCard
            id={c.id}
            title={c.title}
            type={c.type}
            summary={c.summary}
            theme={c.theme}
            violenceType={c.violenceType}
          />
        </Slide>
      ))}
    </Carousel>
  );
}
