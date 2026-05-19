import Link from "next/link";
import styles from "./Breadcrumb.module.css";

interface BreadcrumbProps {
  category?: string;
  title: string;
}

export function Breadcrumb({ category, title }: BreadcrumbProps) {
  return (
    <nav className={styles.crumb} aria-label="Navegação">
      <Link href="/biblioteca">Biblioteca</Link>
      {category && (
        <>
          <span aria-hidden>›</span>
          <span>{category}</span>
        </>
      )}
      <span aria-hidden>›</span>
      <span className={styles.current}>{title}</span>
    </nav>
  );
}
