"use client";

import { useEffect, useState, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingSequenceProps {
  targetRef: RefObject<HTMLElement | null>;
  onHighlight: (active: boolean) => void;
  onRevealCard: () => void;
  onComplete: () => void;
}

export function OnboardingSequence({
  targetRef,
  onHighlight,
  onRevealCard,
  onComplete,
}: OnboardingSequenceProps) {
  const [cursorPos, setCursorPos] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth * 0.7 : 600,
    y: typeof window !== "undefined" ? window.innerHeight * 0.75 : 500,
  }));
  const [cursorVisible, setCursorVisible] = useState(false);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const t = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timers.push(id);
    };

    // 200ms — cursor fades in at start position
    t(200, () => setCursorVisible(true));

    // 700ms — cursor moves toward target text
    t(700, () => {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setCursorPos({
        x: rect.left + rect.width * 0.55,
        y: rect.top + rect.height / 2,
      });
    });

    // 1900ms — highlight activates
    t(1900, () => onHighlight(true));

    // 2300ms — panel + card reveal
    t(2300, () => onRevealCard());

    // 3500ms — cursor fades out
    t(3500, () => {
      setCursorVisible(false);
      setAnimating(false);
    });

    // 4100ms — done
    t(4100, () => {
      onHighlight(false);
      onComplete();
    });

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!animating && !cursorVisible) return null;

  return (
    <AnimatePresence>
      {cursorVisible && (
        <motion.div
          className="learn-fake-cursor"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            left: cursorPos.x,
            top: cursorPos.y,
          }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          style={{ left: cursorPos.x, top: cursorPos.y }}
        >
          <svg viewBox="0 0 22 22" fill="none" width="22" height="22">
            <path
              d="M4 2L4 17L8.5 13L11.5 20L13.5 19L10.5 12H16L4 2Z"
              fill="#1a1a1a"
              stroke="white"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
