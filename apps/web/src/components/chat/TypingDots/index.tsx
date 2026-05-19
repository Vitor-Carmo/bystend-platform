import styles from "./TypingDots.module.css";

export function TypingDots() {
  return (
    <div className={styles.dots} aria-label="Preparando orientação">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
}
