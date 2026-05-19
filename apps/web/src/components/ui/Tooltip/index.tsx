import styles from "./Tooltip.module.css";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className={styles.wrapper}>
      {children}
      <span className={styles.tip} role="tooltip">
        {label}
      </span>
    </span>
  );
}
