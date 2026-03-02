"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { PortfolioData } from "@/content/portfolio";
import { useTheme } from "@/themes/ThemeProvider";
import { SelectionBubble } from "./components/SelectionBubble";
import { SidePanel } from "./components/SidePanel";
import { OnboardingSequence } from "./components/OnboardingSequence";
import { AICard } from "./components/AIContextCard";
import { bioParagraphs } from "./data/bio";
import "./learn.css";

// Hardcoded onboarding card — no API call, instant reveal
const ONBOARDING_CARD: AICard = {
  id: "onboarding",
  selectedText: "Lick Wilmerding High School",
  context:
    "A progressive San Francisco high school with roots as a trade school. Students learn woodworking, glass blowing, electronics, and jewelry alongside academics — one of the few high schools in the country that still teaches real craft.",
  messages: [],
  isStreaming: false,
  isPinned: false,
};

async function streamIntoCard(
  cardId: string,
  body: object,
  updateCard: (id: string, updater: (card: AICard) => AICard) => void
) {
  const res = await fetch("/api/learn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    updateCard(cardId, (c) => ({
      ...c,
      context: c.context || "Something went wrong. Try again.",
      isStreaming: false,
    }));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6);
      if (payload === "[DONE]") {
        updateCard(cardId, (c) => ({ ...c, isStreaming: false }));
        return;
      }
      try {
        const { text } = JSON.parse(payload);
        if (text) {
          updateCard(cardId, (c) => ({ ...c, context: c.context + text }));
        }
      } catch {
        // ignore malformed chunks
      }
    }
  }

  updateCard(cardId, (c) => ({ ...c, isStreaming: false }));
}

async function streamAnswerIntoCard(
  cardId: string,
  selectedText: string,
  question: string,
  history: { role: "user" | "assistant"; content: string }[],
  updateCard: (id: string, updater: (card: AICard) => AICard) => void
) {
  const res = await fetch("/api/learn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selectedText, question, history }),
  });

  if (!res.ok || !res.body) {
    updateCard(cardId, (c) => {
      const msgs = [...c.messages];
      const last = msgs[msgs.length - 1];
      if (last?.role === "assistant") {
        msgs[msgs.length - 1] = {
          ...last,
          content: last.content || "Something went wrong.",
        };
      }
      return { ...c, messages: msgs, isStreaming: false };
    });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6);
      if (payload === "[DONE]") {
        updateCard(cardId, (c) => ({ ...c, isStreaming: false }));
        return;
      }
      try {
        const { text } = JSON.parse(payload);
        if (text) {
          updateCard(cardId, (c) => {
            const msgs = [...c.messages];
            const last = msgs[msgs.length - 1];
            if (last?.role === "assistant") {
              msgs[msgs.length - 1] = {
                ...last,
                content: last.content + text,
              };
            }
            return { ...c, messages: msgs };
          });
        }
      } catch {
        // ignore
      }
    }
  }

  updateCard(cardId, (c) => ({ ...c, isStreaming: false }));
}

export function LearnPage({ data: _data }: { data: PortfolioData }) {
  const { availableThemes, activeTheme, setTheme } = useTheme();

  const [aiCards, setAiCards] = useState<AICard[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);
  const [selectionBubble, setSelectionBubble] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  // Onboarding state
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingHighlight, setOnboardingHighlight] = useState(false);
  const onboardingTargetRef = useRef<HTMLSpanElement>(null);

  // ── Card updater ──
  const updateCard = useCallback(
    (id: string, updater: (card: AICard) => AICard) => {
      setAiCards((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
    },
    []
  );

  // ── Add new AI card from selection ──
  const handleAddCard = useCallback(
    (text: string) => {
      window.getSelection()?.removeAllRanges();
      setSelectionBubble(null);

      const id = `card-${Date.now()}`;
      const newCard: AICard = {
        id,
        selectedText: text,
        context: "",
        messages: [],
        isStreaming: true,
        isPinned: false,
      };

      setAiCards((prev) => [newCard, ...prev]);
      setPanelVisible(true);

      streamIntoCard(id, { selectedText: text }, updateCard);
    },
    [updateCard]
  );

  // ── Onboarding reveal ──
  const handleOnboardingReveal = useCallback(() => {
    setAiCards([ONBOARDING_CARD]);
    setPanelVisible(true);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setOnboardingDone(true);
  }, []);

  // ── Ask follow-up question ──
  const handleAsk = useCallback(
    (cardId: string, question: string) => {
      const card = aiCards.find((c) => c.id === cardId);
      if (!card || card.isStreaming) return;

      const history = card.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      updateCard(cardId, (c) => ({
        ...c,
        isStreaming: true,
        messages: [
          ...c.messages,
          { role: "user", content: question },
          { role: "assistant", content: "" },
        ],
      }));

      streamAnswerIntoCard(
        cardId,
        card.selectedText,
        question,
        history,
        updateCard
      );
    },
    [aiCards, updateCard]
  );

  // ── Pin / Archive ──
  const handlePin = useCallback((id: string) => {
    setAiCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  }, []);

  const handleArchive = useCallback((id: string) => {
    setAiCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) setPanelVisible(false);
      return next;
    });
  }, []);

  const handleClosePanel = useCallback(() => {
    setAiCards((prev) => {
      const pinned = prev.filter((c) => c.isPinned);
      if (pinned.length === 0) setPanelVisible(false);
      return pinned;
    });
  }, []);

  // ── Text selection listener ──
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if ((e.target as Element).closest(".learn-side-panel")) return;
      if ((e.target as Element).closest(".learn-selection-bubble")) return;

      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (!text || text.length < 3) {
        setSelectionBubble(null);
        return;
      }

      const range = selection!.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionBubble({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
        text,
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as Element).closest(".learn-selection-bubble")) return;
      setSelectionBubble(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // ── Split p1 to wrap the onboarding target phrase ──
  const p1 = bioParagraphs[0];
  const targetPhrase = "Lick Wilmerding High School";
  const p1Parts = p1.text.split(targetPhrase);

  return (
    <div className="learn-theme">
      {/* Onboarding cursor animation */}
      {!onboardingDone && (
        <OnboardingSequence
          targetRef={onboardingTargetRef}
          onHighlight={setOnboardingHighlight}
          onRevealCard={handleOnboardingReveal}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Header */}
      <header className="learn-header">
        <span className="learn-header-name">Angela Liu</span>
        <nav className="learn-header-nav">
          <span>Theme:</span>
          {availableThemes.map((t) => (
            <button
              key={t.id}
              className={`learn-header-theme-btn${
                t.id === activeTheme.id ? " learn-theme-active" : ""
              }`}
              onClick={() => setTheme(t.id)}
              disabled={t.id === activeTheme.id}
            >
              {t.name}
            </button>
          ))}
        </nav>
      </header>

      {/* Reading column */}
      <main className="learn-body">
        <p className="learn-eyebrow">Profile</p>

        {/* Paragraph 1: contains the onboarding target span */}
        <p className="learn-paragraph">
          {p1Parts[0]}
          <span
            ref={onboardingTargetRef}
            className={
              onboardingHighlight ? "learn-onboarding-target" : undefined
            }
          >
            {targetPhrase}
          </span>
          {p1Parts[1]}
        </p>

        {/* Paragraphs 2–4: plain */}
        {bioParagraphs.slice(1).map((para) => (
          <p key={para.id} className="learn-paragraph">
            {para.text}
          </p>
        ))}

        <p className="learn-hint">
          <span className="learn-hint-dot" />
          Highlight any text to explore it.
        </p>
      </main>

      {/* Selection bubble */}
      <AnimatePresence>
        {selectionBubble && (
          <SelectionBubble
            bubble={selectionBubble}
            onExplore={handleAddCard}
          />
        )}
      </AnimatePresence>

      {/* Side panel */}
      <SidePanel
        visible={panelVisible}
        cards={aiCards}
        onPin={handlePin}
        onArchive={handleArchive}
        onAsk={handleAsk}
        onClose={handleClosePanel}
      />
    </div>
  );
}
