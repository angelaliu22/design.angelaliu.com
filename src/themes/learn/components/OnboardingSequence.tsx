"use client";

import { useEffect, useState, RefObject, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate as fmAnimate,
} from "framer-motion";

interface OnboardingSequenceProps {
  targetRef: RefObject<HTMLElement | null>;
  onHighlight: (active: boolean) => void;
  onRevealCard: () => void;
  onComplete: () => void;
}

type LineRect = { left: number; top: number; width: number; height: number };

export function OnboardingSequence({
  targetRef,
  onHighlight,
  onRevealCard,
  onComplete,
}: OnboardingSequenceProps) {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const [cursorVisible, setCursorVisible] = useState(false);
  const [lineRects, setLineRects] = useState<LineRect[]>([]);
  const [highlightProgress, setHighlightProgress] = useState(0); // 0–1 overall
  const [showDragTooltip, setShowDragTooltip] = useState(false);
  const [showPanelTooltip, setShowPanelTooltip] = useState(false);
  const [alive, setAlive] = useState(true);

  const rafRef = useRef<number>(0);

  const moveTo = (x: number, y: number, stiffness = 80, damping = 18) => {
    fmAnimate(cursorX, x, { type: "spring", stiffness, damping });
    fmAnimate(cursorY, y, { type: "spring", stiffness, damping });
  };

  // Given overall 0–1 progress, return what fraction of a specific line is filled
  const lineProgress = (lineIndex: number, total: number, progress: number) => {
    const start = lineIndex / total;
    const end = (lineIndex + 1) / total;
    return Math.max(0, Math.min(1, (progress - start) / (end - start)));
  };

  // Cursor position while dragging across potentially multiple lines
  const cursorPosForProgress = (p: number, rects: LineRect[]) => {
    const n = rects.length;
    const scaled = p * n;
    const i = Math.min(Math.floor(scaled), n - 1);
    const frac = scaled - Math.floor(scaled);
    return {
      x: rects[i].left + frac * rects[i].width + 2,
      y: rects[i].top + rects[i].height * 0.55,
    };
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const el = targetRef.current;
    if (!el) return;

    t(50, () => {
      // getClientRects() gives one rect per visual line — works for wrapped text
      const rects = Array.from(el.getClientRects()).map((r) => ({
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      }));
      if (rects.length === 0) return;

      const firstRect = rects[0];
      const lastRect = rects[rects.length - 1];

      cursorX.set(window.innerWidth * 0.62);
      cursorY.set(window.innerHeight * 0.52);

      // ── 1. Cursor fades in ──────────────────────────────────────
      t(200, () => setCursorVisible(true));

      // ── 2. Cursor springs to start of phrase ────────────────────
      t(800, () => {
        moveTo(firstRect.left - 8, firstRect.top + firstRect.height * 0.55);
      });

      // ── 3. Drag starts — rAF grows highlight line by line ────────
      t(1700, () => {
        setShowDragTooltip(true);
        setLineRects(rects);

        const t0 = performance.now();
        const dur = 980;

        const frame = (now: number) => {
          const raw = Math.min((now - t0) / dur, 1);
          // ease-in-out
          const p = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
          setHighlightProgress(p);
          const pos = cursorPosForProgress(p, rects);
          cursorX.set(pos.x);
          cursorY.set(pos.y);
          if (raw < 1) {
            rafRef.current = requestAnimationFrame(frame);
          }
        };
        rafRef.current = requestAnimationFrame(frame);
      });

      // ── 4. Drag done — cursor lifts to bubble position ──────────
      t(2790, () => {
        onHighlight(true);
        moveTo(
          lastRect.left + lastRect.width * 0.5,
          firstRect.top - 46,
          120,
          22
        );
      });

      // ── 5. Reveal panel (longer pause so user can read the tooltip) ──
      t(4200, () => {
        setShowDragTooltip(false);
        setHighlightProgress(0);
        setLineRects([]);
        onRevealCard();
      });

      // ── 6. "To find out more!" tooltip ──────────────────────────
      t(4600, () => setShowPanelTooltip(true));

      // ── 7. Cursor + panel tooltip fade out ───────────────────────
      t(6400, () => {
        setCursorVisible(false);
        setShowPanelTooltip(false);
      });

      // ── 8. Done ─────────────────────────────────────────────────
      t(7200, () => {
        onHighlight(false);
        onComplete();
        setAlive(false);
      });
    });

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!alive) return null;

  return (
    <>
      {/* Per-line highlight overlays — each fills independently */}
      {lineRects.map((rect, i) => {
        const lp = lineProgress(i, lineRects.length, highlightProgress);
        if (lp === 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "fixed",
              left: rect.left,
              top: rect.top,
              width: rect.width * lp,
              height: rect.height,
              background: "rgba(232, 93, 58, 0.22)",
              pointerEvents: "none",
              zIndex: 190,
              borderRadius: 2,
            }}
          />
        );
      })}

      {/* "Highlight any text" tooltip — above the phrase, down-caret */}
      <AnimatePresence>
        {showDragTooltip && lineRects.length > 0 && (
          <motion.div
            key="drag-tip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "fixed",
              left: lineRects[0].left + lineRects[0].width / 2,
              top: lineRects[0].top,
              transform: "translate(-50%, calc(-100% - 14px))",
              zIndex: 202,
              pointerEvents: "none",
            }}
          >
            <div className="learn-onboarding-tip">
              Highlight any text
              <div className="learn-onboarding-caret-down" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "To find out more!" tooltip — left of panel, right-caret */}
      <AnimatePresence>
        {showPanelTooltip && (
          <motion.div
            key="panel-tip"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              right: 356,
              top: "38%",
              zIndex: 202,
              pointerEvents: "none",
            }}
          >
            <div className="learn-onboarding-tip learn-onboarding-tip--right">
              to find out more!
              <div className="learn-onboarding-caret-right" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big demo cursor */}
      <AnimatePresence>
        {cursorVisible && (
          <motion.div
            key="cursor"
            className="learn-fake-cursor"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.28 }}
            style={{ left: cursorX, top: cursorY }}
          >
            <svg viewBox="0 0 24 24" fill="none" width="48" height="48">
              <path
                d="M5 2L5 20L11 14.5L14.5 23L17 22L13.5 13.5H21L5 2Z"
                fill="#e85d3a"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <div className="learn-fake-cursor-label">demo</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
