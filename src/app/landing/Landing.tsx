"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { DosPC } from "./objects/DosPC";
import { MacBookPro } from "./objects/MacBookPro";
import { MagicBook } from "./objects/MagicBook";
import { HandwritingReveal } from "./HandwritingReveal";

const BotanicalScene = dynamic(
  () => import("./BotanicalScene").then((m) => ({ default: m.BotanicalScene })),
  { ssr: false }
);

type Stage = "video" | "zooming";
type ThemeId = "dos" | "ide" | "learn";

interface LandingProps {
  onEnter: (themeId: ThemeId) => void;
}

const objects: { id: ThemeId; label: string; Component: React.ComponentType }[] = [
  { id: "dos", label: "DOS Machine", Component: DosPC },
  { id: "ide", label: "IDE", Component: MacBookPro },
  { id: "learn", label: "Learn", Component: MagicBook },
];

// Wrapper that applies grayscale by default, removes it on hover
function SketchObject({
  children,
  onClick,
  animDelay,
  show,
}: {
  children: React.ReactNode;
  onClick: () => void;
  animDelay: number;
  show: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.05, y: 30 }}
      animate={show ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.05, y: 30 }}
      transition={{
        opacity: { duration: 0.7, delay: animDelay },
        scale: { type: "spring", stiffness: 90, damping: 18, delay: animDelay },
        y: { duration: 0.6, delay: animDelay, ease: "easeOut" },
      }}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        transformOrigin: "center center",
      }}
    >
      <motion.div
        animate={{
          filter: hovered
            ? "grayscale(0%) opacity(100%) brightness(1)"
            : "grayscale(100%) opacity(55%) brightness(1.05)",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
      <motion.span
        animate={{ opacity: hovered ? 0.9 : 0.4 }}
        transition={{ duration: 0.3 }}
        style={{
          fontFamily: "'HomemadeApple', cursive",
          fontSize: "0.65rem",
          color: "#2a2520",
          letterSpacing: "0.05em",
        }}
      >
      </motion.span>
    </motion.div>
  );
}

export function Landing({ onEnter }: LandingProps) {
  const [stage, setStage] = useState<Stage>("video");
  const [showHandwriting, setShowHandwriting] = useState(false);
  const [showObjects, setShowObjects] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger handwriting 3s after video starts playing
  const handleVideoPlaying = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setTimeout(() => setShowHandwriting(true), 3000);
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => setShowHandwriting(true));
    const onError = () => setShowHandwriting(true);
    vid.addEventListener("error", onError);
    return () => {
      vid.removeEventListener("error", onError);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleWritingComplete = useCallback(() => {
    setShowObjects(true);
  }, []);

  const handleSelectTheme = useCallback(
    (id: ThemeId) => {
      setSelectedTheme(id);
      setStage("zooming");
      setTimeout(() => onEnter(id), 950);
    },
    [onEnter]
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>

      {/* Video layer */}
      <AnimatePresence>
        {stage === "video" && (
          <motion.div
            key="video"
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
            style={{ position: "absolute", inset: 0, zIndex: 2 }}
          >
            <video
              ref={videoRef}
              muted
              playsInline
              onPlaying={handleVideoPlaying}
              style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botanical scene — fades in behind once objects are showing */}
      <AnimatePresence>
        {showObjects && (
          <motion.div
            key="botanical"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            <BotanicalScene />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Handwriting text overlay — on top of video */}
      {showHandwriting && stage === "video" && (
        <HandwritingReveal
          startDelay={0}
          charIntervalMs={52}
          onComplete={handleWritingComplete}
        />
      )}

      {/* Objects — appear below the text after writing finishes */}
      <AnimatePresence>
        {showObjects && (
          <motion.div
            key="objects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: "8vh",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "clamp(32px, 6vw, 88px)",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {objects.map((obj, i) => {
                const isSelected = selectedTheme === obj.id;
                const isDeselected = selectedTheme !== null && !isSelected;
                const Comp = obj.Component;

                return (
                  <motion.div
                    key={obj.id}
                    animate={
                      stage === "zooming"
                        ? isSelected
                          ? { scale: 14, opacity: 0, transition: { duration: 0.9, ease: "easeInOut" as const } }
                          : { scale: 0.5, opacity: 0, transition: { duration: 0.5, ease: "easeIn" as const } }
                        : {}
                    }
                    style={{ transformOrigin: "center bottom" }}
                  >
                    <SketchObject
                      onClick={() => stage !== "zooming" && handleSelectTheme(obj.id)}
                      animDelay={0.1 + i * 0.15}
                      show={!isDeselected}
                    >
                      <Comp />
                    </SketchObject>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
