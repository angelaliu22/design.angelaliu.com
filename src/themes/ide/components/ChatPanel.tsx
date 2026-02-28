"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What's Angela's current role?",
  "Tell me about Consent 2.0",
  "What's her design process?",
  "What tech does she ship?",
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;

      const userMsg: Message = { role: "user", content: text };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setStreaming(true);

      // Placeholder for streaming response
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) throw new Error("API error");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) return;

        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const { text } = JSON.parse(data);
              accumulated += text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: accumulated,
                };
                return updated;
              });
            } catch {}
          }
        }
      } catch (err) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content:
              "Sorry, the chat isn't available right now. Check back soon!",
          };
          return updated;
        });
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="ide-chat">
      <div className="ide-chat-header">
        <span>Ask about Angela</span>
        {streaming && <span className="ide-chat-streaming">●</span>}
      </div>

      <div className="ide-chat-messages">
        {messages.length === 0 && (
          <div className="ide-chat-empty">
            <div className="ide-chat-empty-title">Chat with Angela's portfolio</div>
            <div className="ide-chat-empty-sub">
              Ask anything about her work, process, or experience.
            </div>
            <div className="ide-chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="ide-chat-suggestion"
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`ide-chat-msg ide-chat-msg-${msg.role}`}
          >
            <div className="ide-chat-msg-label">
              {msg.role === "user" ? "You" : "Angela"}
            </div>
            <div className="ide-chat-msg-content">
              {msg.content}
              {streaming &&
                i === messages.length - 1 &&
                msg.role === "assistant" && (
                  <span className="ide-chat-cursor">▋</span>
                )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="ide-chat-input-area">
        <textarea
          ref={inputRef}
          className="ide-chat-input"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={streaming}
        />
        <button
          className="ide-chat-send"
          onClick={() => send(input)}
          disabled={streaming || !input.trim()}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
