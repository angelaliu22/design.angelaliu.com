import { ThemeDefinition } from "../types";
import WrightPage from "./WrightPage";

export const wrightTheme: ThemeDefinition = {
  id: "wright",
  name: "Wright",
  description: "Frank Lloyd Wright Prairie style",
  PageComponent: WrightPage,
  transitionEffect: "dissolve",
};
