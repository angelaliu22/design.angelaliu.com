"use client";

import { useState, useCallback, useRef } from "react";
import { PortfolioData } from "@/content/portfolio";
import { TerminalLine } from "./commands";
import { useCommandParser } from "./hooks/useCommandParser";
import { useBootSequence, BootState } from "./hooks/useBootSequence";
import { CrtScreen } from "./components/CrtScreen";
import { Terminal } from "./components/Terminal";
import { CommandInput } from "./components/CommandInput";
import { MenuBar } from "./components/MenuBar";
import { StatusBar } from "./components/StatusBar";
import { DosWindow, DosWindowMedia } from "./components/DosWindow";
import "./dos.css";

interface DosPageProps {
  data: PortfolioData;
}

function buildBootLines(): TerminalLine[] {
  let id = 0;
  const ln = (content: string, type: TerminalLine["type"] = "output"): TerminalLine => ({
    id: `boot-${id++}`,
    content,
    type,
  });

  return [
    ln("BIOS v1.0 - Angela Liu Systems"),
    ln("Memory Test: 640K OK"),
    ln(""),
    ln("Detecting drives..."),
    ln("  C:\\ — PORTFOLIO (512MB)"),
    ln(""),
    ln("Loading PORTFOLIO.EXE..."),
    ln("[████████████████████████████████████████] 100%"),
    ln(""),
    ln("═══════════════════════════════════════════════════", "divider"),
    ln(""),
    ln("  ANGELA LIU DESIGN PORTFOLIO v2.0", "header"),
    ln("  (C) 2026 Angela C. Liu"),
    ln(""),
    ln("  Type HELP for available commands or click a menu item."),
    ln(""),
    ln("═══════════════════════════════════════════════════", "divider"),
    ln(""),
  ];
}

export default function DosPage({ data }: DosPageProps) {
  const { state: bootState, visibleLines, progressPercent, skip } =
    useBootSequence();
  const booted = bootState === "complete";

  const { execute } = useCommandParser(data);
  const lineIdCounter = useRef(0);

  const [initialized, setInitialized] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [activeSection, setActiveSection] = useState<string>();
  const [openMedia, setOpenMedia] = useState<DosWindowMedia | null>(null);

  // Once boot completes, seed terminal with boot text + about
  if (booted && !initialized) {
    const bootLines = buildBootLines();
    const aboutResult = execute("about");
    const aboutLines = aboutResult.clear ? [] : aboutResult.lines;
    setLines([...bootLines, ...aboutLines]);
    setActiveSection("about");
    setInitialized(true);
  }

  const handleCommand = useCallback(
    (input: string) => {
      const commandLine: TerminalLine = {
        id: `cmd-${lineIdCounter.current++}`,
        content: input.toUpperCase(),
        type: "command",
      };

      const result = execute(input);

      if (result.clear) {
        setLines([]);
        setActiveSection(undefined);
      } else {
        setLines((prev) => [...prev, commandLine, ...result.lines]);
        setActiveSection(input.trim().toLowerCase());
      }
    },
    [execute]
  );

  const handleOpenMedia = useCallback((media: DosWindowMedia) => {
    setOpenMedia(media);
  }, []);

  const handleCloseMedia = useCallback(() => {
    setOpenMedia(null);
  }, []);

  // Boot animation progress bar
  const progressBarWidth = 40;
  const filledChars = Math.floor((progressPercent / 100) * progressBarWidth);
  const progressBar =
    "█".repeat(filledChars) + "░".repeat(progressBarWidth - filledChars);

  return (
    <div className="dos-theme">
      <CrtScreen>
        {!booted ? (
          <div className="dos-boot crt-text" onClick={skip}>
            {visibleLines.map((line, i) => (
              <div key={i} className="terminal-line">
                {line}
              </div>
            ))}
            {bootState === "booting" && progressPercent > 0 && (
              <div className="terminal-line dos-progress-bar">
                [{progressBar}] {progressPercent}%
              </div>
            )}
            {bootState === "booting" && (
              <div
                className="terminal-line"
                style={{ opacity: 0.5, marginTop: "16px" }}
              >
                Click anywhere to skip...
              </div>
            )}
          </div>
        ) : (
          <>
            <MenuBar onCommand={handleCommand} activeSection={activeSection} />
            <Terminal
              lines={lines}
              onCommand={handleCommand}
              onOpenMedia={handleOpenMedia}
            />
            <CommandInput onSubmit={handleCommand} />
            <StatusBar />
          </>
        )}
      </CrtScreen>

      {openMedia && (
        <DosWindow media={openMedia} onClose={handleCloseMedia} />
      )}
    </div>
  );
}
