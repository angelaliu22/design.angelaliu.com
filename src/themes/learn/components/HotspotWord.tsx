"use client";

import { motion } from "framer-motion";

interface HotspotWordProps {
  phrase: string;
  hotspotId: string;
  isOpen: boolean;
  onExpand: (id: string) => void;
}

export function HotspotWord({ phrase, hotspotId, isOpen, onExpand }: HotspotWordProps) {
  return (
    <motion.span
      className={`learn-hotspot${isOpen ? " learn-hotspot-open" : ""}`}
      onClick={() => onExpand(hotspotId)}
      whileHover={{ backgroundColor: "var(--learn-accent-light)", scale: 1.005 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={`Learn more about ${phrase}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onExpand(hotspotId);
        }
      }}
    >
      {phrase}
    </motion.span>
  );
}
