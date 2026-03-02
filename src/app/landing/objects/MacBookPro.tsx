"use client";

// CSS art: MacBook Pro 16" with IDE interface visible on screen
export function MacBookPro() {
  return (
    <div style={{ position: "relative", width: 200, height: 150, filter: "drop-shadow(0 8px 28px rgba(0,0,0,0.22))" }}>
      {/* Lid / screen */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 115,
        background: "linear-gradient(170deg, #d0d0d0 0%, #b8b8b8 40%, #a8a8a8 100%)",
        borderRadius: "8px 8px 2px 2px",
        border: "1.5px solid #909090",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
        overflow: "hidden",
      }}>
        {/* Screen area */}
        <div style={{
          position: "absolute", top: 5, left: 5, right: 5, bottom: 5,
          background: "#1e1e2e",
          borderRadius: 5,
          overflow: "hidden",
        }}>
          {/* IDE chrome: title bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 4, padding: "4px 7px",
            background: "#252535",
            borderBottom: "1px solid #333355",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#28c840" }} />
            <div style={{ flex: 1, textAlign: "center", fontSize: 5, color: "#888", fontFamily: "system-ui" }}>
              portfolio.ts — IDE
            </div>
          </div>
          {/* IDE body */}
          <div style={{ display: "flex", height: "calc(100% - 15px)" }}>
            {/* Sidebar */}
            <div style={{
              width: 32, background: "#1a1a2a",
              borderRight: "1px solid #2a2a3a",
              padding: "4px 0",
            }}>
              {["▸", "◈", "⊞", "⊟"].map((icon, i) => (
                <div key={i} style={{
                  textAlign: "center", fontSize: 6, color: i === 0 ? "#7090ff" : "#556",
                  padding: "3px 0", lineHeight: 1,
                }}>{icon}</div>
              ))}
            </div>
            {/* File tree */}
            <div style={{
              width: 36, background: "#1c1c2c",
              borderRight: "1px solid #2a2a3a",
              padding: "3px 3px",
            }}>
              {["src/", "  theme", "  ide/", "  page", "  api/"].map((f, i) => (
                <div key={i} style={{
                  fontSize: 4.5, color: i === 2 ? "#7090ff" : "#667",
                  lineHeight: "9px", whiteSpace: "nowrap",
                  fontFamily: "monospace",
                }}>{f}</div>
              ))}
            </div>
            {/* Code area */}
            <div style={{ flex: 1, padding: "4px", overflow: "hidden" }}>
              {[
                { text: "import React from", color: "#c792ea" },
                { text: "const IDE = () => {", color: "#82aaff" },
                { text: "  return (", color: "#eee" },
                { text: "    <main>", color: "#f07178" },
                { text: "  // ...", color: "#546e7a" },
              ].map((line, i) => (
                <div key={i} style={{
                  fontFamily: "monospace",
                  fontSize: 4.5,
                  color: line.color,
                  lineHeight: "8px",
                  whiteSpace: "nowrap",
                }}>{line.text}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Notch */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 18, height: 4,
          background: "#2a2a2a",
          borderRadius: "0 0 4px 4px",
        }} />
      </div>

      {/* Hinge */}
      <div style={{
        position: "absolute", top: 112, left: 10, right: 10, height: 4,
        background: "linear-gradient(180deg, #888 0%, #aaa 100%)",
        borderRadius: "0 0 2px 2px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }} />

      {/* Base */}
      <div style={{
        position: "absolute", top: 114, left: 0, right: 0, height: 26,
        background: "linear-gradient(180deg, #b8b8b8 0%, #a0a0a0 50%, #909090 100%)",
        borderRadius: "2px 2px 6px 6px",
        border: "1.5px solid #888",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}>
        {/* Trackpad */}
        <div style={{
          position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
          width: 50, height: 14,
          background: "rgba(0,0,0,0.06)",
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.1)",
        }} />
        {/* Speaker grilles */}
        {[-1, 1].map((side) =>
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`${side}-${i}`} style={{
              position: "absolute",
              top: 6 + i * 4,
              left: side === -1 ? 8 + i * 0.5 : undefined,
              right: side === 1 ? 8 + i * 0.5 : undefined,
              width: 10, height: 1.5,
              background: "rgba(0,0,0,0.15)",
              borderRadius: 1,
            }} />
          ))
        )}
      </div>
    </div>
  );
}
