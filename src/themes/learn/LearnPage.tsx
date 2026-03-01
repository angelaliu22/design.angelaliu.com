"use client";

import { useState, useCallback } from "react";
import { PortfolioData } from "@/content/portfolio";
import { useTheme } from "@/themes/ThemeProvider";
import { InteractiveText } from "./components/InteractiveText";
import { SidePanel } from "./components/SidePanel";
import { bioParagraphs, hotspots } from "./data/bio";
import "./learn.css";

export function LearnPage({ data: _data }: { data: PortfolioData }) {
  const { availableThemes, activeTheme, setTheme } = useTheme();

  const [openCards, setOpenCards] = useState<string[]>([]);
  const [pinnedCards, setPinnedCards] = useState<string[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);

  const handleExpand = useCallback(
    (hotspotId: string) => {
      setOpenCards((prev) => {
        if (prev.includes(hotspotId)) {
          // Toggle off if not pinned
          if (pinnedCards.includes(hotspotId)) return prev;
          const next = prev.filter((id) => id !== hotspotId);
          if (next.length === 0) setPanelVisible(false);
          return next;
        } else {
          setPanelVisible(true);
          return [...prev, hotspotId];
        }
      });
    },
    [pinnedCards]
  );

  const handlePin = useCallback((hotspotId: string) => {
    setPinnedCards((prev) =>
      prev.includes(hotspotId)
        ? prev.filter((id) => id !== hotspotId)
        : [...prev, hotspotId]
    );
  }, []);

  const handleArchive = useCallback((hotspotId: string) => {
    setOpenCards((prev) => {
      const next = prev.filter((id) => id !== hotspotId);
      if (next.length === 0) setPanelVisible(false);
      return next;
    });
    setPinnedCards((prev) => prev.filter((id) => id !== hotspotId));
  }, []);

  const handleClosePanel = useCallback(() => {
    // Keep only pinned cards; hide panel if none remain
    setOpenCards((prev) => {
      const pinned = prev.filter((id) => pinnedCards.includes(id));
      if (pinned.length === 0) setPanelVisible(false);
      return pinned;
    });
  }, [pinnedCards]);

  const sidePanelCards = openCards
    .map((id) => {
      const hotspot = hotspots.find((h) => h.id === id);
      if (!hotspot) return null;
      return { hotspot, isPinned: pinnedCards.includes(id) };
    })
    .filter(Boolean) as Array<{ hotspot: (typeof hotspots)[0]; isPinned: boolean }>;

  return (
    <div className="learn-theme">
      {/* Header */}
      <header className="learn-header">
        <span className="learn-header-name">Angela Liu</span>
        <nav className="learn-header-nav">
          <span>Theme:</span>
          {availableThemes.map((t) => (
            <button
              key={t.id}
              className={`learn-header-theme-btn${t.id === activeTheme.id ? " learn-theme-active" : ""}`}
              onClick={() => setTheme(t.id)}
              disabled={t.id === activeTheme.id}
            >
              {t.name}
            </button>
          ))}
        </nav>
      </header>

      {/* Reading column */}
      <main className="learn-body">
        <p className="learn-eyebrow">Profile</p>

        {bioParagraphs.map((para) => (
          <InteractiveText
            key={para.id}
            paragraph={para}
            hotspots={hotspots}
            openCardIds={openCards}
            onExpand={handleExpand}
          />
        ))}

        <p className="learn-hint">
          <span className="learn-hint-dot" />
          Click any underlined phrase to explore further.
        </p>
      </main>

      {/* Side panel */}
      <SidePanel
        visible={panelVisible}
        cards={sidePanelCards}
        onPin={handlePin}
        onArchive={handleArchive}
        onClose={handleClosePanel}
      />
    </div>
  );
}
