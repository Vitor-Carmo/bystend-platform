import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./QuizFeedback.module.css";

interface QuizFeedbackProps {
  correct: boolean;
  explanation: string;
}

export function QuizFeedback({ correct, explanation }: QuizFeedbackProps) {
  return (
    <div className={styles.feedback}>
      <p className={cn(styles.header, correct ? styles.correct : styles.wrong)}>
        <Lightbulb size={18} aria-hidden />
        {correct ? "Boa reflexão!" : "Vamos revisar juntos"}
      </p>
      <p className={styles.body}>{explanation}</p>
    </div>
  );
}
