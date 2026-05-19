"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { ChatSource, ChatResponse } from "@bystend/shared";
import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { SourcesPanel } from "@/components/chat/SourcesPanel";
import { TypingDots } from "@/components/chat/TypingDots";
import { api, getSessionId } from "@/lib/api";
import { markChatStarted } from "@/lib/gamification";
import styles from "./chat.module.css";

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

function ChatContent() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("prefill");

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState(prefill ?? "");
  const [loading, setLoading] = useState(false);
  const [lastSources, setLastSources] = useState<ChatSource[]>([]);

  useEffect(() => {
    if (prefill) setInput(prefill);
  }, [prefill]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    markChatStarted();
    const userMsg: ChatMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api<ChatResponse>("/chat", {
        method: "POST",
        body: JSON.stringify({ message: text, sessionId: getSessionId() }),
      });
      setLastSources(res.sources ?? []);
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
      <SectionHeader
        eyebrow="Orientação"
        title="Chat orientativo"
        subtitle="Converse sobre dúvidas ou situações hipotéticas. As respostas usam a base Byst.end e indicam fontes."
      />
      <Disclaimer />

      <div className={styles.layout}>
        <section className={styles.thread} aria-live="polite">
          <div className={styles.messages}>
            {messages.length === 0 && (
              <p className="text-muted">Escolha uma sugestão abaixo ou escreva sua dúvida.</p>
            )}
            {messages.map((msg, i) => (
              <ChatBubble
                key={i}
                role={msg.role}
                content={msg.content}
                sources={msg.role === "assistant" ? msg.sources : undefined}
                disclaimer={msg.disclaimer}
                highRisk={msg.highRisk}
              />
            ))}
            {loading && <TypingDots />}
          </div>

          <ChatComposer
            value={input}
            onChange={setInput}
            onSubmit={() => void send(input)}
            loading={loading}
            suggestions={messages.length === 0 ? SUGGESTIONS : []}
            onSuggestion={(s) => void send(s)}
          />
        </section>

        <SourcesPanel sources={lastSources} />
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<SectionHeader title="Chat orientativo" subtitle="Carregando…" />}>
      <ChatContent />
    </Suspense>
  );
}
