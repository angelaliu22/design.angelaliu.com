"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface AICard {
  id: string;
  selectedText: string;
  context: string;
  messages: { role: "user" | "assistant"; content: string }[];
  isStreaming: boolean;
  isPinned: boolean;
}

interface AIContextCardProps {
  card: AICard;
  onPin: (id: string) => void;
  onArchive: (id: string) => void;
  onAsk: (cardId: string, question: string) => void;
}

export function AIContextCard({ card, onPin, onArchive, onAsk }: AIContextCardProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [card.messages, card.context]);

  const truncatedQuote =
    card.selectedText.length > 80
      ? card.selectedText.slice(0, 80).trimEnd() + "…"
      : card.selectedText;

  const handleSend = () => {
    const q = inputValue.trim();
    if (!q || card.isStreaming) return;
    setInputValue("");
    onAsk(card.id, q);
  };

  // Determine if currently streaming a follow-up answer
  const lastMsg = card.messages[card.messages.length - 1];
  const isAnswering =
    card.isStreaming && lastMsg?.role === "assistant" && card.messages.length > 0;

  return (
    <motion.div
      layout
      className="learn-card"
      initial={{ y: 18, opacity: 0, scale: 0.97 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ x: 60, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {/* Quoted selection */}
      <p className="learn-card-quote">"{truncatedQuote}"</p>

      {/* AI-generated context */}
      <p className="learn-card-context">
        {card.context || (card.isStreaming && !isAnswering ? "" : "")}
        {card.isStreaming && !isAnswering && (
          <span className="learn-stream-cursor" />
        )}
      </p>

      {/* Q&A thread */}
      {card.messages.length > 0 && (
        <div className="learn-card-messages">
          {card.messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.role === "user"
                  ? "learn-card-msg-user"
                  : "learn-card-msg-assistant"
              }
            >
              {msg.content}
              {isAnswering &&
                i === card.messages.length - 1 &&
                msg.role === "assistant" && (
                  <span className="learn-stream-cursor" />
                )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Ask input */}
      {!card.isStreaming || card.context ? (
        <div className="learn-card-input-row">
          <input
            ref={inputRef}
            className="learn-card-input"
            placeholder={
              card.isStreaming ? "Generating…" : "Ask something about this…"
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={card.isStreaming}
          />
          <button
            className="learn-card-send-btn"
            onClick={handleSend}
            disabled={card.isStreaming || !inputValue.trim()}
          >
            Ask
          </button>
        </div>
      ) : null}

      {/* Pin / Archive */}
      <div className="learn-card-actions">
        <button
          className={`learn-card-action-btn${card.isPinned ? " learn-btn-pinned" : ""}`}
          onClick={() => onPin(card.id)}
        >
          {card.isPinned ? "Pinned" : "Pin"}
        </button>
        <button
          className="learn-card-action-btn"
          onClick={() => onArchive(card.id)}
        >
          Archive
        </button>
      </div>
    </motion.div>
  );
}
