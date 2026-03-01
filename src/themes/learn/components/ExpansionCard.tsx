"use client";

import { motion } from "framer-motion";
import { Hotspot } from "../data/bio";

interface ExpansionCardProps {
  hotspot: Hotspot;
  isPinned: boolean;
  onPin: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ExpansionCard({ hotspot, isPinned, onPin, onArchive }: ExpansionCardProps) {
  const { expansion } = hotspot;

  return (
    <motion.div
      layout
      className={`learn-card learn-card-${expansion.type}`}
      initial={{ y: 16, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ x: 60, opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <div className="learn-card-top">
        <span className="learn-card-label">{expansion.label}</span>
        <span className={`learn-card-badge learn-badge-${expansion.type}`}>
          {expansion.type}
        </span>
      </div>

      {expansion.type === "image" && (
        <div className="learn-card-image-placeholder">
          <span>{expansion.label}</span>
        </div>
      )}

      <p className="learn-card-content">{expansion.content}</p>

      {expansion.type === "link" && expansion.url && (
        <a
          href={expansion.url}
          target="_blank"
          rel="noopener noreferrer"
          className="learn-card-link-btn"
        >
          Visit ↗
        </a>
      )}

      <div className="learn-card-actions">
        <button
          className={`learn-card-action-btn${isPinned ? " learn-btn-pinned" : ""}`}
          onClick={() => onPin(hotspot.id)}
        >
          {isPinned ? "Pinned" : "Pin"}
        </button>
        <button
          className="learn-card-action-btn"
          onClick={() => onArchive(hotspot.id)}
        >
          Archive
        </button>
      </div>
    </motion.div>
  );
}
