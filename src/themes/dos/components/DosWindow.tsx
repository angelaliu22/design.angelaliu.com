"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface DosWindowMedia {
  type: "image" | "video" | "youtube";
  src: string;
  filename: string;
}

interface DosWindowProps {
  media: DosWindowMedia;
  onClose: () => void;
}

export function DosWindow({ media, onClose }: DosWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  // Center window on mount
  useEffect(() => {
    setPos({
      x: Math.max(20, (window.innerWidth - 700) / 2),
      y: Math.max(20, (window.innerHeight - 500) / 2),
    });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true);
      dragOffset.current = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      };
    },
    [pos]
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const programName =
    media.type === "youtube" || media.type === "video"
      ? "VIDPLAY.EXE"
      : "IMGVIEW.EXE";

  const extractYouTubeId = (url: string): string => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
    );
    return match?.[1] || "";
  };

  const getYouTubeStart = (url: string): number => {
    const match = url.match(/[?&]t=(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  return (
    <div className="dos-window-overlay" onClick={onClose}>
      <div
        ref={windowRef}
        className="dos-window"
        style={{ left: pos.x, top: pos.y }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="dos-window-titlebar" onMouseDown={handleMouseDown}>
          <span className="dos-window-title">
            {programName} ── {media.filename}
          </span>
          <button className="dos-window-close" onClick={onClose}>
            [×]
          </button>
        </div>

        {/* Content area */}
        <div className="dos-window-content">
          {/* Scanline overlay */}
          <div className="dos-window-scanlines" />

          {media.type === "image" && (
            <img
              src={media.src}
              alt={media.filename}
              className={`dos-window-image ${loaded ? "loaded" : ""}`}
              onLoad={() => setLoaded(true)}
              draggable={false}
            />
          )}

          {media.type === "video" && (
            <video
              src={media.src}
              controls
              className="dos-window-video"
              onLoadedData={() => setLoaded(true)}
            />
          )}

          {media.type === "youtube" && (
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(media.src)}?start=${getYouTubeStart(media.src)}&rel=0`}
              className="dos-window-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>

        {/* Status bar */}
        <div className="dos-window-status">
          <span>{media.filename}</span>
          <span>
            {media.type === "image"
              ? "256 colors"
              : media.type === "youtube"
                ? "STREAM"
                : "AVI"}
          </span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
