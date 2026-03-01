import { ThemeDefinition } from "./types";
import { dosTheme } from "./dos";
import { ideTheme } from "./ide";
import { learnTheme } from "./learn";

export const themes: Record<string, ThemeDefinition> = {
  dos: dosTheme,
  ide: ideTheme,
  learn: learnTheme,
};

export const defaultThemeId = "dos";
