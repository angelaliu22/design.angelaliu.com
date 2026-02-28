import { ThemeDefinition } from "./types";
import { dosTheme } from "./dos";
import { wrightTheme } from "./wright";

export const themes: Record<string, ThemeDefinition> = {
  dos: dosTheme,
  wright: wrightTheme,
};

export const defaultThemeId = "dos";
