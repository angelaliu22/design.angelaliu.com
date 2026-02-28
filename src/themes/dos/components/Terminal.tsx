"use client";

import { useEffect, useRef, useCallback } from "react";
import { TerminalLine } from "../commands";
import { DosWindowMedia } from "./DosWindow";

interface TerminalProps {
  lines: TerminalLine[];
  onCommand?: (command: string) => void;
  onOpenMedia?: (media: DosWindowMedia) => void;
}

const SCROLL_STEP = 80;

export function Terminal({ lines, onCommand, onOpenMedia }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyScroll = useCallback((e: KeyboardEvent) => {
    const el = containerRef.current;
    if (!el) return;

    // Don't hijack if user is typing in the command input
    const active = document.activeElement;
    if (active && active.tagName === "INPUT") {
      // Only capture Page Up/Down and Home/End even when input is focused
      if (!["PageUp", "PageDown", "Home", "End"].includes(e.key)) return;
    }

    switch (e.key) {
      case "PageUp":
        e.preventDefault();
        el.scrollTop -= el.clientHeight - 40;
        break;
      case "PageDown":
        e.preventDefault();
        el.scrollTop += el.clientHeight - 40;
        break;
      case "Home":
        e.preventDefault();
        el.scrollTop = 0;
        break;
      case "End":
        e.preventDefault();
        el.scrollTop = el.scrollHeight;
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyScroll);
    return () => window.removeEventListener("keydown", handleKeyScroll);
  }, [handleKeyScroll]);

  return (
    <div ref={containerRef} className="dos-terminal crt-text" tabIndex={-1}>
      {lines.map((line) => {
        switch (line.type) {
          case "header":
            return (
              <div key={line.id} className="terminal-line dos-header">
                {line.content}
              </div>
            );
          case "divider":
            return (
              <div key={line.id} className="terminal-line dos-divider">
                {line.content}
              </div>
            );
          case "subheader":
            return (
              <div key={line.id} className="terminal-line dos-subheader">
                {line.content}
              </div>
            );
          case "link":
            if (line.action) {
              return (
                <div key={line.id} className="terminal-line">
                  <button
                    className="dos-link"
                    onClick={() => onCommand?.(line.action!)}
                  >
                    {line.content}
                  </button>
                </div>
              );
            }
            return (
              <div key={line.id} className="terminal-line">
                <a
                  href={line.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dos-link"
                >
                  {line.content}
                </a>
              </div>
            );
          case "media":
            return (
              <div key={line.id} className="terminal-line">
                <button
                  className="dos-media-btn"
                  onClick={() =>
                    line.media &&
                    onOpenMedia?.({
                      type: line.media.type,
                      src: line.media.src,
                      filename: line.media.filename,
                    })
                  }
                >
                  {line.content}
                </button>
              </div>
            );
          case "command":
            return (
              <div key={line.id} className="terminal-line">
                <span className="dos-prompt">C:\PORTFOLIO&gt; </span>
                {line.content}
              </div>
            );
          default:
            return (
              <div key={line.id} className="terminal-line">
                {line.content}
              </div>
            );
        }
      })}
    </div>
  );
}
