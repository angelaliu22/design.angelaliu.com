import { ThemeDefinition } from "../types";
import dynamic from "next/dynamic";

const IdePage = dynamic(
  () => import("./IdePage").then((m) => ({ default: m.IdePage })),
  { ssr: false }
);

export const ideTheme: ThemeDefinition = {
  id: "ide",
  name: "IDE",
  description: "VS Code-inspired editor with AI chat",
  PageComponent: IdePage,
  transitionEffect: "dissolve",
};
