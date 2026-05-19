import { cn } from "@/lib/cn";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ eyebrow, title, subtitle, className, action }: SectionHeaderProps) {
  return (
    <header className={cn(styles.header, className)}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
        <div>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
