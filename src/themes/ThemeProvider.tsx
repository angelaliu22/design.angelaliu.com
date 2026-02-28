"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { ThemeDefinition } from "./types";
import { themes, defaultThemeId } from "./index";
import { ThemeTransition, TransitionPhase } from "./ThemeTransition";

interface ThemeContextValue {
  activeTheme: ThemeDefinition;
  setTheme: (id: string) => void;
  availableThemes: ThemeDefinition[];
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState(defaultThemeId);
  const [pendingThemeId, setPendingThemeId] = useState<string | null>(null);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>("idle");
  const [transitionEffect, setTransitionEffect] = useState<"glitch" | "dissolve" | "morph">("glitch");

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored && themes[stored]) {
      setThemeId(stored);
    }
  }, []);

  const setTheme = useCallback(
    (id: string) => {
      if (!themes[id] || id === themeId) return;

      // Determine transition effect based on the target theme
      const targetTheme = themes[id];
      setTransitionEffect(targetTheme.transitionEffect || "glitch");
      setPendingThemeId(id);
      setTransitionPhase("exit");
    },
    [themeId]
  );

  const handleMidpoint = useCallback(() => {
    if (pendingThemeId) {
      setThemeId(pendingThemeId);
      localStorage.setItem("portfolio-theme", pendingThemeId);
      setTransitionPhase("enter");
    }
  }, [pendingThemeId]);

  const handleComplete = useCallback(() => {
    setTransitionPhase("idle");
    setPendingThemeId(null);
  }, []);

  const activeTheme = themes[themeId] || themes[defaultThemeId];
  const availableThemes = Object.values(themes);
  const isTransitioning = transitionPhase !== "idle";

  return (
    <ThemeContext.Provider
      value={{ activeTheme, setTheme, availableThemes, isTransitioning }}
    >
      {children}
      <ThemeTransition
        phase={transitionPhase}
        effect={transitionEffect}
        onMidpoint={handleMidpoint}
        onComplete={handleComplete}
      />
    </ThemeContext.Provider>
  );
}
