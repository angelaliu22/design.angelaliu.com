"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeDefinition } from "./types";
import { themes, defaultThemeId } from "./index";

interface ThemeContextValue {
  activeTheme: ThemeDefinition;
  setTheme: (id: string) => void;
  availableThemes: ThemeDefinition[];
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

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored && themes[stored]) {
      setThemeId(stored);
    }
  }, []);

  const setTheme = (id: string) => {
    if (themes[id]) {
      setThemeId(id);
      localStorage.setItem("portfolio-theme", id);
    }
  };

  const activeTheme = themes[themeId] || themes[defaultThemeId];
  const availableThemes = Object.values(themes);

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}
