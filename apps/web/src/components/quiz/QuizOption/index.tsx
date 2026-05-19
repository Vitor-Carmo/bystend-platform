"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import styles from "./QuizOption.module.css";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

interface QuizOptionProps {
  index: number;
  label: string;
  state?: "idle" | "correct" | "wrong";
  disabled?: boolean;
  onClick: () => void;
}

export function QuizOption({ index, label, state = "idle", disabled, onClick }: QuizOptionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={cn(
        styles.option,
        state === "correct" && styles.correct,
        state === "wrong" && styles.wrong,
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={reduceMotion || disabled ? {} : { x: 4 }}
      whileTap={reduceMotion || disabled ? {} : { scale: 0.99 }}
    >
      <span className={styles.letter}>{LETTERS[index] ?? "?"}</span>
      <span className={styles.text}>{label}</span>
    </motion.button>
  );
}
