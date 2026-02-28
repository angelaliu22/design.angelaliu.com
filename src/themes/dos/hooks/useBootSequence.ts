"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type BootState = "idle" | "booting" | "complete";

interface BootLine {
  text: string;
  delay: number; // ms before showing this line
}

const BOOT_LINES: BootLine[] = [
  { text: "BIOS v1.0 - Angela Liu Systems", delay: 0 },
  { text: "Memory Test: 640K OK", delay: 400 },
  { text: "", delay: 200 },
  { text: "Detecting drives...", delay: 300 },
  { text: "  C:\\ — PORTFOLIO (512MB)", delay: 400 },
  { text: "", delay: 100 },
  { text: "Loading PORTFOLIO.EXE...", delay: 500 },
  { text: "PROGRESS_BAR", delay: 100 },
  { text: "", delay: 600 },
  { text: "═══════════════════════════════════════════════════", delay: 200 },
  { text: "", delay: 100 },
  { text: "  ANGELA LIU DESIGN PORTFOLIO v2.0", delay: 100 },
  { text: "  (C) 2026 Angela C. Liu", delay: 100 },
  { text: "", delay: 100 },
  {
    text: "  Type HELP for available commands or click a menu item.",
    delay: 100,
  },
  { text: "", delay: 100 },
  { text: "═══════════════════════════════════════════════════", delay: 200 },
  { text: "", delay: 300 },
];

export function useBootSequence() {
  const [state, setState] = useState<BootState>("idle");
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const hasBooted = useRef(false);

  const skip = useCallback(() => {
    setState("complete");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("portfolio-booted", "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("portfolio-booted") === "true") {
        setState("complete");
        hasBooted.current = true;
        return;
      }
    }

    if (hasBooted.current) return;
    hasBooted.current = true;

    setState("booting");

    let totalDelay = 0;
    const timeouts: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((bootLine, i) => {
      totalDelay += bootLine.delay;

      if (bootLine.text === "PROGRESS_BAR") {
        // Animate progress bar
        const barStart = totalDelay;
        for (let p = 0; p <= 100; p += 5) {
          const t = setTimeout(() => {
            setProgressPercent(p);
          }, barStart + p * 15);
          timeouts.push(t);
        }
        totalDelay += 1500;
        return;
      }

      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, bootLine.text]);
      }, totalDelay);
      timeouts.push(t);
    });

    // Complete boot
    totalDelay += 200;
    const completeTimeout = setTimeout(() => {
      setState("complete");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("portfolio-booted", "true");
      }
    }, totalDelay);
    timeouts.push(completeTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return { state, visibleLines, progressPercent, skip };
}
