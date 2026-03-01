import { ThemeDefinition } from "../types";
import dynamic from "next/dynamic";

const LearnPage = dynamic(
  () => import("./LearnPage").then((m) => ({ default: m.LearnPage })),
  { ssr: false }
);

export const learnTheme: ThemeDefinition = {
  id: "learn",
  name: "Learn",
  description: "Interactive editorial bio with expandable hotspots",
  PageComponent: LearnPage,
  transitionEffect: "dissolve",
};
