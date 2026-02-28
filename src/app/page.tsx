"use client";

import { ThemeProvider, useTheme } from "@/themes/ThemeProvider";
import { portfolioData } from "@/content/portfolio";

function ThemeRenderer() {
  const { activeTheme } = useTheme();
  const PageComponent = activeTheme.PageComponent;
  return <PageComponent data={portfolioData} />;
}

export default function Home() {
  return (
    <ThemeProvider>
      <ThemeRenderer />
    </ThemeProvider>
  );
}
