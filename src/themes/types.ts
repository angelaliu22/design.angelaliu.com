import { ComponentType } from "react";
import { PortfolioData } from "@/content/portfolio";

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  PageComponent: ComponentType<{ data: PortfolioData }>;
  transitionEffect?: "glitch" | "dissolve" | "morph";
}
