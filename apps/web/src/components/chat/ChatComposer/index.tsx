"use client";

import { useRef } from "react";
import { Send } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import styles from "./ChatComposer.module.css";

interface ChatComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  suggestions?: string[];
  onSuggestion?: (text: string) => void;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  loading,
  suggestions = [],
  onSuggestion,
}: ChatComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  return (
    <div className={styles.composer}>
      {suggestions.length > 0 && value.trim() === "" && (
        <div className={styles.suggestions}>
          {suggestions.map((s) => (
            <Chip key={s} onClick={() => onSuggestion?.(s)} disabled={loading}>
              {s.length > 48 ? `${s.slice(0, 48)}…` : s}
            </Chip>
          ))}
        </div>
      )}
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <textarea
          ref={ref}
          className={styles.textarea}
          value={value}
          onChange={handleInput}
          placeholder="Descreva uma situação hipotética..."
          rows={1}
          disabled={loading}
          aria-label="Sua mensagem"
        />
        <button type="submit" className={styles.send} disabled={loading || !value.trim()} aria-label="Enviar">
          <Send size={20} />
        </button>
      </form>
      <p className={styles.counter}>{value.length} caracteres</p>
    </div>
  );
}
