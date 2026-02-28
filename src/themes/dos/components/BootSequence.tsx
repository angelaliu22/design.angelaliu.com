"use client";

import { useEffect, useRef } from "react";
import { useBootSequence } from "../hooks/useBootSequence";

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const { state, visibleLines, progressPercent, skip } = useBootSequence();
  const calledComplete = useRef(false);

  useEffect(() => {
    if (state === "complete" && !calledComplete.current) {
      calledComplete.current = true;
      onComplete();
    }
  }, [state, onComplete]);

  if (state === "complete") {
    return null;
  }

  const progressBarWidth = 40;
  const filledChars = Math.floor((progressPercent / 100) * progressBarWidth);
  const progressBar =
    "█".repeat(filledChars) + "░".repeat(progressBarWidth - filledChars);

  return (
    <div className="dos-boot crt-text" onClick={skip}>
      {visibleLines.map((line, i) => (
        <div key={i} className="terminal-line">
          {line}
        </div>
      ))}
      {state === "booting" && progressPercent > 0 && (
        <div className="terminal-line dos-progress-bar">
          [{progressBar}] {progressPercent}%
        </div>
      )}
      {state === "booting" && (
        <div
          className="terminal-line"
          style={{ opacity: 0.5, marginTop: "16px" }}
        >
          Click anywhere to skip...
        </div>
      )}
    </div>
  );
}
