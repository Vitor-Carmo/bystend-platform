import { cn } from "@/lib/cn";
import styles from "./Badge.module.css";

type Tone = "default" | "success" | "warning" | "muted";

interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Badge({ tone = "default", className, children, icon }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[tone], className)}>
      {icon}
      {children}
    </span>
  );
}
