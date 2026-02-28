"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TransitionPhase = "idle" | "exit" | "enter";

interface ThemeTransitionProps {
  phase: TransitionPhase;
  effect?: "glitch" | "dissolve" | "morph";
  onMidpoint?: () => void;
  onComplete?: () => void;
}

export function ThemeTransition({
  phase,
  effect = "glitch",
  onMidpoint,
  onComplete,
}: ThemeTransitionProps) {
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    if (phase === "exit") {
      // Midpoint: screen is fully covered, swap theme
      const mid = setTimeout(() => {
        setShowLine(true);
        onMidpoint?.();
      }, 500);
      return () => clearTimeout(mid);
    }
    if (phase === "enter") {
      const done = setTimeout(() => {
        setShowLine(false);
        onComplete?.();
      }, 600);
      return () => clearTimeout(done);
    }
  }, [phase, onMidpoint, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "all",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* CRT shutdown line */}
          {effect === "glitch" && (
            <motion.div
              style={{
                width: showLine ? "60%" : "0%",
                height: "2px",
                background: "#fff",
                boxShadow: "0 0 20px #fff, 0 0 40px #fff, 0 0 80px #33ff33",
              }}
              animate={{
                width: phase === "exit" ? ["0%", "80%"] : ["80%", "0%"],
                opacity: phase === "enter" ? [1, 0] : [0, 1],
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          )}

          {effect === "dissolve" && (
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle, transparent 0%, #000 100%)",
              }}
              animate={{
                scale: phase === "exit" ? [3, 0] : [0, 3],
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          )}

          {/* Random noise/static during transition */}
          {effect === "glitch" && phase === "exit" && (
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.15,
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
                mixBlendMode: "screen",
              }}
              animate={{ opacity: [0, 0.3, 0.1, 0.25, 0] }}
              transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
