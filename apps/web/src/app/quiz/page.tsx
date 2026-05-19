"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QuizOption } from "@/components/quiz/QuizOption";
import { QuizFeedback } from "@/components/quiz/QuizFeedback";
import { QuizSummary } from "@/components/quiz/QuizSummary";
import { AchievementToast } from "@/components/gamification/AchievementToast";
import { api, getSessionId } from "@/lib/api";
import { fetchProgress, type UserProgressResponse } from "@/lib/progress";
import {
  getStreak,
  incrementStreakOnCorrect,
  resetStreak,
  evaluateAchievements,
  type Achievement,
} from "@/lib/gamification";
import { slideRight } from "@/lib/motion";
import styles from "./quiz.module.css";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [runScore, setRunScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [saved, setSaved] = useState<UserProgressResponse>({
    quizScore: 0,
    quizTotal: 0,
    completedIds: [],
    completedLayers: [],
  });
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [firstAnswerDone, setFirstAnswerDone] = useState(false);

  const loadProgress = useCallback(async () => {
    try {
      const progress = await fetchProgress();
      setSaved(progress);
    } catch {
      /* API offline */
    } finally {
      setLoadingProgress(false);
    }
  }, []);

  useEffect(() => {
    api<QuizQuestion[]>("/quiz").then(setQuestions).catch(() => setQuestions([]));
    void loadProgress();
    setStreak(getStreak());
  }, [loadProgress]);

  useEffect(() => {
    if (questions.length > 0 && index >= questions.length) {
      const achievements = evaluateAchievements({ quizFinished: true });
      if (achievements.length) setNewAchievements((a) => [...a, ...achievements]);
    }
  }, [index, questions.length]);

  const current = questions[index];

  async function submitAnswer(optionIndex: number) {
    if (!current || feedback) return;
    setSelected(optionIndex);
    try {
      const res = await api<{ correct: boolean; explanation: string }>("/quiz/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId: current.id,
          selectedIndex: optionIndex,
          sessionId: getSessionId(),
        }),
      });
      setFeedback(res);
      if (res.correct) {
        setRunScore((s) => s + 1);
        const newStreak = incrementStreakOnCorrect();
        setStreak(newStreak);
      } else {
        resetStreak();
        setStreak(0);
      }

      const achievements = evaluateAchievements({
        correct: res.correct,
        streak: res.correct ? getStreak() : 0,
        firstAnswer: !firstAnswerDone,
      });
      if (!firstAnswerDone) setFirstAnswerDone(true);
      if (achievements.length) setNewAchievements((a) => [...a, ...achievements]);

      await loadProgress();
    } catch {
      setFeedback({
        correct: false,
        explanation: "Não foi possível avaliar a resposta. Tente novamente.",
      });
    }
  }

  function next() {
    setSelected(null);
    setFeedback(null);
    setIndex((i) => i + 1);
  }

  function retry() {
    setIndex(0);
    setSelected(null);
    setFeedback(null);
    setRunScore(0);
    resetStreak();
    setStreak(0);
    setNewAchievements([]);
    setFirstAnswerDone(false);
  }

  if (questions.length === 0) {
    return (
      <>
        <SectionHeader title="Quiz educativo" subtitle="Carregando perguntas ou API indisponível." />
      </>
    );
  }

  if (!current) {
    return (
      <>
        <AchievementToast items={newAchievements} />
        <QuizSummary
          runScore={runScore}
          total={questions.length}
          xpGained={runScore * 10}
          streak={streak}
          savedScore={saved.quizScore}
          savedTotal={saved.quizTotal}
          onRetry={retry}
        />
      </>
    );
  }

  return (
    <>
      <SectionHeader
        eyebrow="Reflexão"
        title="Quiz: isso merece atenção?"
        subtitle="Exercite o olhar crítico — sem vereditos definitivos."
      />
      {!loadingProgress && saved.quizTotal > 0 && (
        <p className="text-muted" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
          Progresso salvo: {saved.quizScore} acertos em {saved.quizTotal} respostas anteriores.
        </p>
      )}
      <Disclaimer />

      <QuizProgress current={index + 1} total={questions.length} streak={streak} />

      <AchievementToast items={newAchievements} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          variants={slideRight}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <Card className={styles.card}>
            <h2 className={styles.question}>{current.question}</h2>
            <div className={styles.options}>
              {current.options.map((opt, i) => {
                let state: "idle" | "correct" | "wrong" = "idle";
                if (feedback && selected === i) {
                  state = feedback.correct ? "correct" : "wrong";
                }
                return (
                  <QuizOption
                    key={i}
                    index={i}
                    label={opt}
                    state={state}
                    disabled={!!feedback}
                    onClick={() => void submitAnswer(i)}
                  />
                );
              })}
            </div>

            {feedback && (
              <>
                <QuizFeedback correct={feedback.correct} explanation={feedback.explanation} />
                <Button className={styles.nextBtn} onClick={next}>
                  Próxima pergunta
                </Button>
              </>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
