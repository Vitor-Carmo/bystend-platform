import { cn } from "@/lib/cn";
import styles from "./Field.module.css";

interface FieldProps {
  label?: string;
  htmlFor?: string;
  helper?: string;
  error?: string;
  size?: "default" | "large";
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, helper, error, size = "default", className, children }: FieldProps) {
  return (
    <div className={cn(styles.field, error && styles.hasError, size === "large" && styles.searchLarge, className)}>
      {label && (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {helper && !error && <p className={styles.helper}>{helper}</p>}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={styles.input} {...props} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={styles.textarea} {...props} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={styles.select} {...props} />;
}
