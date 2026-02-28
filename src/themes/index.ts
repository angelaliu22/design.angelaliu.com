import { ThemeDefinition } from "./types";
import { dosTheme } from "./dos";
import { ideTheme } from "./ide";

export const themes: Record<string, ThemeDefinition> = {
  dos: dosTheme,
  ide: ideTheme,
};

export const defaultThemeId = "dos";
