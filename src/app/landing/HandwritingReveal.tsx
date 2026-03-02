"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface HandwritingRevealProps {
  startDelay?: number;
  charIntervalMs?: number;
  onComplete?: () => void;
}

function splitChars(text: string) {
  return text.split("").map((c, i) => ({ char: c === " " ? "\u00A0" : c, key: i }));
}

const HEADING = "Hey there, thanks for stopping by!";
const SUBTEXT =
  "Angela is a product designer by trade and operator at heart. She loves sketching in paper, code, and data models, and specializes in product led engineering and engineering led design.";

const HAND_FONT = "'HomemadeApple', cursive";

export function HandwritingReveal({
  startDelay = 0,
  charIntervalMs = 52,
  onComplete,
}: HandwritingRevealProps) {
  const headingChars = useMemo(() => splitChars(HEADING), []);
  const subtextChars = useMemo(() => splitChars(SUBTEXT), []);

  const headingDone = startDelay + (headingChars.length * charIntervalMs) / 1000;
  const subtextStart = headingDone + 0.4;
  const subtextDone = subtextStart + (subtextChars.length * charIntervalMs) / 1000;

  function Char({
    char,
    delay,
    isHeading,
    isLast,
  }: {
    char: string;
    delay: number;
    isHeading: boolean;
    isLast?: boolean;
  }) {
    return (
      <motion.span
        initial={{ clipPath: "inset(0 110% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: isHeading ? 0.07 : 0.05, delay, ease: "easeOut" }}
        onAnimationComplete={isLast ? onComplete : undefined}
        style={{
          display: "inline-block",
          fontFamily: HAND_FONT,
          fontSize: isHeading
            ? "clamp(1.6rem, 3.8vw, 2.6rem)"
            : "clamp(0.75rem, 1.4vw, 1rem)",
          fontWeight: 400,
          color: "#2a2520",
          lineHeight: isHeading ? 1.5 : 1.7,
        }}
      >
        {char}
      </motion.span>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // Shift center point ~15vh above true center
        justifyContent: "center",
        paddingBottom: "30vh",
        padding: "0 10% 30vh",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {/* Soft backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: startDelay, duration: 1.2 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 72% 52% at 50% 42%, rgba(255,252,248,0.78) 0%, rgba(255,252,248,0.28) 65%, transparent 100%)",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 660 }}>
        {/* Heading */}
        <div style={{ marginBottom: "1.4rem" }}>
          {headingChars.map(({ char, key }) => (
            <Char
              key={key}
              char={char}
              delay={startDelay + (key * charIntervalMs) / 1000}
              isHeading
            />
          ))}
        </div>

        {/* Subtext */}
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          {subtextChars.map(({ char, key }) => (
            <Char
              key={key}
              char={char}
              delay={subtextStart + (key * charIntervalMs) / 1000}
              isHeading={false}
              isLast={key === subtextChars.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
