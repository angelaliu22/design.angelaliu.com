"use client";

interface StatusBarProps {
  themeLabel?: string;
}

export function StatusBar({ themeLabel = "DOS" }: StatusBarProps) {
  return (
    <div className="dos-status">
      <span>ANGELA LIU PORTFOLIO v2.0</span>
      <span>Theme: {themeLabel}</span>
    </div>
  );
}
