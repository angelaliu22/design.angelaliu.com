"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SelectionBubbleProps {
  bubble: { x: number; y: number; text: string } | null;
  onExplore: (text: string) => void;
}

export function SelectionBubble({ bubble, onExplore }: SelectionBubbleProps) {
  return (
    <AnimatePresence>
      {bubble && (
        <motion.button
          className="learn-selection-bubble"
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 450, damping: 26 }}
          style={{ left: bubble.x, top: bubble.y }}
          onMouseDown={(e) => {
            // Prevent mousedown from clearing the selection before click fires
            e.preventDefault();
          }}
          onClick={() => onExplore(bubble.text)}
        >
          ✦ Explore this
        </motion.button>
      )}
    </AnimatePresence>
  );
}
