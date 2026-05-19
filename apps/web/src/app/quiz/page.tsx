"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { api, getSessionId } from "@/lib/api";

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
  const [score, setScore] = useState(0);

  useEffect(() => {
    api<QuizQuestion[]>("/quiz").then(setQuestions).catch(() => setQuestions([]));
  }, []);

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
      if (res.correct) setScore((s) => s + 1);
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

  if (questions.length === 0) {
    return (
      <>
        <h1>Quiz educativo</h1>
        <p style={{ color: "var(--muted)" }}>Carregando perguntas ou API indisponível.</p>
      </>
    );
  }

  if (!current) {
    return (
      <>
        <h1>Quiz concluído</h1>
        <p>
          Você acertou {score} de {questions.length}.
        </p>
        <Link href="/trilha" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-flex" }}>
          Voltar à trilha
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 style={{ marginBottom: "0.5rem" }}>Quiz: isso merece atenção?</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        Pergunta {index + 1} de {questions.length}
      </p>
      <Disclaimer />

      <article className="card">
        <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>{current.question}</h2>
        {current.options.map((opt, i) => {
          let cls = "quiz-option";
          if (feedback && selected === i) cls += feedback.correct ? " correct" : " wrong";
          if (feedback && i === selected && !feedback.correct) cls += " wrong";
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => submitAnswer(i)}
              disabled={!!feedback}
            >
              {opt}
            </button>
          );
        })}

        {feedback && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--bg)", borderRadius: "var(--radius)" }}>
            <p style={{ fontWeight: 600, color: feedback.correct ? "var(--success)" : "var(--warning)" }}>
              {feedback.correct ? "Boa reflexão!" : "Vamos revisar juntos"}
            </p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>{feedback.explanation}</p>
            <button type="button" className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={next}>
              Próxima pergunta
            </button>
          </div>
        )}
      </article>
    </>
  );
}
