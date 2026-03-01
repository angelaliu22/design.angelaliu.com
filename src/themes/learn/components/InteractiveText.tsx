"use client";

import React from "react";
import { BioParagraph, Hotspot } from "../data/bio";
import { HotspotWord } from "./HotspotWord";

interface InteractiveTextProps {
  paragraph: BioParagraph;
  hotspots: Hotspot[];
  openCardIds: string[];
  onExpand: (id: string) => void;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseText(
  text: string,
  hotspots: Hotspot[],
  openCardIds: string[],
  onExpand: (id: string) => void
): React.ReactNode[] {
  // Sort longest first to avoid partial matches
  const sorted = [...hotspots].sort((a, b) => b.phrase.length - a.phrase.length);
  const pattern = sorted.map((h) => escapeRegex(h.phrase)).join("|");
  const regex = new RegExp(`(${pattern})`, "g");

  const parts = text.split(regex);
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    const match = hotspots.find((h) => h.phrase === part);
    if (match) {
      nodes.push(
        <HotspotWord
          key={`${match.id}-${i}`}
          phrase={match.phrase}
          hotspotId={match.id}
          isOpen={openCardIds.includes(match.id)}
          onExpand={onExpand}
        />
      );
    } else {
      nodes.push(part);
    }
  }

  return nodes;
}

export function InteractiveText({ paragraph, hotspots, openCardIds, onExpand }: InteractiveTextProps) {
  const nodes = parseText(paragraph.text, hotspots, openCardIds, onExpand);
  return <p className="learn-paragraph">{nodes}</p>;
}
