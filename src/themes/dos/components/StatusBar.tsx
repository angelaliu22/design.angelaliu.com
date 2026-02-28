"use client";

import { useState } from "react";
import { useTheme } from "@/themes/ThemeProvider";
import { setSoundEnabled, isSoundEnabled } from "@/lib/sounds";

export function StatusBar() {
  const { activeTheme, availableThemes, setTheme } = useTheme();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  return (
    <div className="dos-status">
      <span>ANGELA LIU PORTFOLIO v2.0</span>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button className="dos-status-btn" onClick={toggleSound}>
          SND:{soundOn ? "ON" : "OFF"}
        </button>
        <span>│</span>
        <span>Theme:</span>
        {availableThemes.map((t) => (
          <button
            key={t.id}
            className={`dos-status-btn ${t.id === activeTheme.id ? "active" : ""}`}
            onClick={() => setTheme(t.id)}
            disabled={t.id === activeTheme.id}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
