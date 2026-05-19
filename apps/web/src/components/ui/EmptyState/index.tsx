import { Box } from "@/lib/box";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box className={styles.empty}>
      {icon && <Box className={styles.icon}>{icon}</Box>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.desc}>{description}</p>}
      {action}
    </Box>
  );
}
