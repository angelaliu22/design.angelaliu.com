"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotspot } from "../data/bio";
import { ExpansionCard } from "./ExpansionCard";

interface SidePanelProps {
  visible: boolean;
  cards: Array<{ hotspot: Hotspot; isPinned: boolean }>;
  onPin: (id: string) => void;
  onArchive: (id: string) => void;
  onClose: () => void;
}

export function SidePanel({ visible, cards, onPin, onArchive, onClose }: SidePanelProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 800);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const slideProps = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { x: 340 }, animate: { x: 0 }, exit: { x: 340 } };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          className="learn-side-panel"
          {...slideProps}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="learn-panel-header">
            <span className="learn-panel-title">Notes ({cards.length})</span>
            <button className="learn-panel-close" onClick={onClose} aria-label="Close panel">
              ×
            </button>
          </div>

          <div className="learn-panel-cards">
            <AnimatePresence mode="popLayout">
              {cards.map(({ hotspot, isPinned }) => (
                <ExpansionCard
                  key={hotspot.id}
                  hotspot={hotspot}
                  isPinned={isPinned}
                  onPin={onPin}
                  onArchive={onArchive}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
