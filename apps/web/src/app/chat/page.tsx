"use client";

import { useState } from "react";
import Link from "next/link";
import type { ChatSource, ChatResponse } from "@bystend/shared";
import { Disclaimer } from "@/components/Disclaimer";
import { api, getSessionId } from "@/lib/api";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  disclaimer?: string;
  highRisk?: boolean;
}

const SUGGESTIONS = [
  "Meu líder me chama de incompetente na frente da equipe. Isso é assédio?",
  "Meu gestor faz piadas constrangedoras comigo em reuniões.",
  "Como reconhecer microagressões no trabalho?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: ChatMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api<ChatResponse>("/chat", {
        method: "POST",
        body: JSON.stringify({ message: text, sessionId: getSessionId() }),
      });
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.message,
          sources: res.sources,
          disclaimer: res.disclaimer,
          highRisk: res.highRisk,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Não foi possível processar sua mensagem. Verifique se a API está em execução.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 style={{ marginBottom: "0.5rem" }}>Chat orientativo</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        Converse sobre dúvidas ou situações hipotéticas. As respostas usam a base Byst.end e indicam fontes.
      </p>
      <Disclaimer />

      <section className="chat-messages">
        {messages.length === 0 && (
          <p style={{ color: "var(--muted)" }}>Sugestões para começar:</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`msg msg-${msg.role}`}>
            <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
            {msg.highRisk && (
              <p style={{ color: "var(--warning)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                Tema sensível: priorize canais oficiais de apoio da sua organização.
              </p>
            )}
            {msg.sources && msg.sources.length > 0 && (
              <div className="sources-block">
                <p className="sources-block-title">
                  📚 Fontes consultadas na base da Byst.end:
                </p>
                <div className="sources-badges">
                  {msg.sources.map((s) => (
                    <Link key={s.id} href={`/conteudo/${s.id}`} className="source-badge">
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {msg.disclaimer && (
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem" }}>{msg.disclaimer}</p>
            )}
          </div>
        ))}
        {loading && <p style={{ color: "var(--muted)" }}>Preparando orientação...</p>}
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="btn btn-secondary" onClick={() => send(s)} disabled={loading}>
            {s.slice(0, 50)}…
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <div className="field">
          <label htmlFor="chat-input">Sua mensagem</label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Descreva uma situação hipotética..."
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Enviar
        </button>
      </form>
    </>
  );
}
