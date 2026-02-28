import { ThemeDefinition } from "./types";
import { dosTheme } from "./dos";

export const themes: Record<string, ThemeDefinition> = {
  dos: dosTheme,
};

export const defaultThemeId = "dos";
