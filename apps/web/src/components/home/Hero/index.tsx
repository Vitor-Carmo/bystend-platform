import { Button } from "@/components/ui/Button";
import { Box } from "@/lib/box";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <Box className={styles.blob} aria-hidden />
      <Box className={styles.content}>
        <p className={styles.eyebrow}>Prevenção com profundidade</p>
        <h1 className={styles.title}>Aprenda a reconhecer, refletir e agir com responsabilidade</h1>
        <p className={styles.subtitle}>
          Educação, prevenção e orientação inicial sobre assédio e condutas inadequadas no ambiente
          profissional — com conteúdos da Byst.end e conversa orientada por fontes.
        </p>
        <Box className={styles.actions}>
          <Button href="/trilha" size="lg">
            Começar trilha
          </Button>
          <Button href="/chat" variant="secondary" size="lg">
            Conversar com o chat
          </Button>
        </Box>
      </Box>
    </section>
  );
}
