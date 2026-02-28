import { ThemeDefinition } from "../types";
import DosPage from "./DosPage";

export const dosTheme: ThemeDefinition = {
  id: "dos",
  name: "DOS",
  description: "Classic DOS terminal experience",
  PageComponent: DosPage,
  transitionEffect: "glitch",
};
