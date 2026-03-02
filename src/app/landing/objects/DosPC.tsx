"use client";

// CSS art: old beige PC tower + CRT monitor with DOS green screen
export function DosPC() {
  return (
    <div className="dos-pc" style={{ position: "relative", width: 180, height: 200, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}>
      {/* Monitor */}
      <div style={{
        position: "absolute", top: 0, left: 20, width: 130, height: 110,
        background: "linear-gradient(160deg, #d4cdbf 0%, #c8c0af 60%, #b5ad9c 100%)",
        borderRadius: "6px 6px 4px 4px",
        border: "3px solid #a09688",
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.15)",
      }}>
        {/* Screen bezel */}
        <div style={{
          position: "absolute", top: 8, left: 8, right: 8, bottom: 14,
          background: "#1a1a0e",
          borderRadius: 3,
          border: "2px solid #888070",
          overflow: "hidden",
          boxShadow: "inset 0 0 12px rgba(0,0,0,0.8)",
        }}>
          {/* CRT phosphor glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 40%, rgba(0,255,80,0.08) 0%, transparent 70%)",
          }} />
          {/* DOS text lines */}
          {["C:\\>", "C:\\> DIR", "Volume in drive C", "  PORTFOLIO    <DIR>", "C:\\>_"].map((line, i) => (
            <div key={i} style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 7,
              color: i === 4 ? "#00ff50" : "#00cc40",
              lineHeight: "11px",
              padding: "2px 4px 0",
              opacity: i === 4 ? 1 : 0.85,
            }}>{line}</div>
          ))}
        </div>
        {/* Monitor brand dot */}
        <div style={{
          position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
          width: 6, height: 6, borderRadius: "50%",
          background: "#888",
          boxShadow: "0 0 2px rgba(0,0,0,0.3)",
        }} />
      </div>

      {/* Monitor neck/stand */}
      <div style={{
        position: "absolute", top: 108, left: 75, width: 20, height: 8,
        background: "#b5ad9c",
        borderRadius: "0 0 2px 2px",
      }} />
      <div style={{
        position: "absolute", top: 114, left: 60, width: 50, height: 6,
        background: "#a09688",
        borderRadius: 3,
      }} />

      {/* Tower */}
      <div style={{
        position: "absolute", top: 55, right: 0, width: 48, height: 130,
        background: "linear-gradient(170deg, #d8d0c0 0%, #c4bba8 50%, #b0a895 100%)",
        borderRadius: "4px 4px 3px 3px",
        border: "2px solid #a09080",
        boxShadow: "inset 2px 0 4px rgba(255,255,255,0.3), inset -1px 0 3px rgba(0,0,0,0.1)",
      }}>
        {/* Drive bay */}
        <div style={{
          position: "absolute", top: 10, left: 6, right: 6, height: 12,
          background: "#222",
          borderRadius: 2,
          border: "1px solid #555",
        }} />
        {/* Floppy slot */}
        <div style={{
          position: "absolute", top: 28, left: 6, right: 6, height: 6,
          background: "#1a1a1a",
          borderRadius: 1,
          border: "1px solid #444",
        }} />
        {/* Power button */}
        <div style={{
          position: "absolute", top: 42, left: 13, width: 10, height: 10,
          background: "#b8b0a0",
          borderRadius: "50%",
          border: "2px solid #8a8070",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
        }} />
        {/* LED */}
        <div style={{
          position: "absolute", top: 44, left: 30, width: 5, height: 5,
          borderRadius: "50%",
          background: "#00ff80",
          boxShadow: "0 0 4px #00ff80",
        }} />
        {/* Vents */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            position: "absolute", bottom: 18 + i * 6, left: 10, right: 10, height: 2,
            background: "rgba(0,0,0,0.15)",
            borderRadius: 1,
          }} />
        ))}
      </div>

      {/* Keyboard */}
      <div style={{
        position: "absolute", bottom: 0, left: 14, width: 110, height: 22,
        background: "linear-gradient(180deg, #cec6b6 0%, #bdb5a4 100%)",
        borderRadius: "3px 3px 5px 5px",
        border: "2px solid #a09080",
        boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
      }}>
        {/* Key rows */}
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ display: "flex", gap: 2, padding: "2px 4px 0", justifyContent: "center" }}>
            {Array.from({ length: row === 0 ? 12 : row === 1 ? 11 : 10 }).map((_, k) => (
              <div key={k} style={{
                width: row === 0 ? 6 : 7,
                height: 4,
                background: "#d4ccc0",
                borderRadius: 1,
                border: "1px solid #b0a898",
                boxShadow: "0 1px 0 #a09080",
              }} />
            ))}
          </div>
        ))}
      </div>

      {/* Mouse */}
      <div style={{
        position: "absolute", bottom: 8, right: -14, width: 18, height: 26,
        background: "linear-gradient(160deg, #d0c8b8 0%, #b8b0a0 100%)",
        borderRadius: "8px 8px 10px 10px",
        border: "1.5px solid #a09080",
        boxShadow: "1px 2px 4px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
          width: 1, height: 8,
          background: "#a09080",
        }} />
      </div>
    </div>
  );
}
