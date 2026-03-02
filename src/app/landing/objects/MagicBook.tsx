"use client";

// CSS art: open magical book, slightly angled, with a soft glow
export function MagicBook() {
  return (
    <div style={{
      position: "relative", width: 180, height: 150,
      filter: "drop-shadow(0 10px 30px rgba(130,100,180,0.25))",
    }}>
      {/* Ambient glow beneath */}
      <div style={{
        position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
        width: 160, height: 20,
        background: "radial-gradient(ellipse, rgba(160,120,220,0.25) 0%, transparent 70%)",
        filter: "blur(6px)",
      }} />

      {/* Book spine */}
      <div style={{
        position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
        width: 6, height: 128,
        background: "linear-gradient(180deg, #7a5c3a 0%, #5c4028 50%, #7a5c3a 100%)",
        borderRadius: 2,
        zIndex: 3,
        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
      }} />

      {/* Left page */}
      <div style={{
        position: "absolute", top: 10, left: 8, width: 78, height: 128,
        background: "linear-gradient(170deg, #faf6ee 0%, #f0ead8 100%)",
        borderRadius: "4px 0 0 4px",
        border: "1px solid #d4c9b0",
        borderRight: "none",
        boxShadow: "inset 2px 0 6px rgba(0,0,0,0.05), -2px 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        transform: "perspective(300px) rotateY(4deg)",
        transformOrigin: "right center",
      }}>
        {/* Page lines / text */}
        <div style={{ padding: "10px 8px 8px 10px" }}>
          <div style={{ fontSize: 6, color: "#8c7c5a", fontFamily: "serif", lineHeight: "11px", marginBottom: 6, fontStyle: "italic" }}>
            Angela Liu
          </div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              height: 1.5,
              background: "rgba(0,0,0,0.12)",
              borderRadius: 1,
              marginBottom: 5,
              width: i % 3 === 2 ? "60%" : "90%",
            }} />
          ))}
          {/* Small sketch illustration */}
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <div style={{
              width: 36, height: 28, margin: "0 auto",
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 3,
              background: "rgba(160,120,220,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "rgba(130,100,180,0.4)",
            }}>✦</div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              height: 1.5, background: "rgba(0,0,0,0.1)", borderRadius: 1,
              marginBottom: 5, marginTop: i === 0 ? 6 : 0,
              width: i % 2 === 1 ? "75%" : "90%",
            }} />
          ))}
        </div>
        {/* Page number */}
        <div style={{ position: "absolute", bottom: 6, left: 10, fontSize: 5, color: "#b0a080", fontFamily: "serif" }}>12</div>
      </div>

      {/* Right page */}
      <div style={{
        position: "absolute", top: 10, right: 8, width: 78, height: 128,
        background: "linear-gradient(190deg, #faf6ee 0%, #f0ead8 100%)",
        borderRadius: "0 4px 4px 0",
        border: "1px solid #d4c9b0",
        borderLeft: "none",
        boxShadow: "inset -2px 0 6px rgba(0,0,0,0.05), 2px 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        transform: "perspective(300px) rotateY(-4deg)",
        transformOrigin: "left center",
      }}>
        <div style={{ padding: "10px 10px 8px 8px" }}>
          {/* Chapter heading area */}
          <div style={{ fontSize: 5.5, color: "#9a8060", fontFamily: "serif", marginBottom: 4, letterSpacing: 1 }}>
            CHAPTER II
          </div>
          <div style={{ fontSize: 6.5, color: "#5c4a2a", fontFamily: "serif", fontWeight: "bold", marginBottom: 8, lineHeight: "10px" }}>
            On Building
          </div>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{
              height: 1.5,
              background: "rgba(0,0,0,0.1)",
              borderRadius: 1,
              marginBottom: 5,
              width: i % 4 === 3 ? "55%" : i % 3 === 0 ? "85%" : "92%",
            }} />
          ))}
        </div>
        {/* Magical sparkle */}
        <div style={{
          position: "absolute", top: 12, right: 10,
          fontSize: 10, color: "rgba(160,120,220,0.5)",
        }}>✦</div>
        <div style={{
          position: "absolute", bottom: 20, right: 14,
          fontSize: 7, color: "rgba(160,120,220,0.35)",
        }}>✦</div>
        {/* Page number */}
        <div style={{ position: "absolute", bottom: 6, right: 10, fontSize: 5, color: "#b0a080", fontFamily: "serif" }}>13</div>
      </div>

      {/* Book cover/back visible at bottom edge */}
      <div style={{
        position: "absolute", bottom: 0, left: 8, right: 8, height: 18,
        background: "linear-gradient(180deg, #7a5c3a 0%, #5c4028 100%)",
        borderRadius: "2px 2px 6px 6px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
        zIndex: 1,
      }}>
        {/* Decorative line on cover */}
        <div style={{
          position: "absolute", top: "50%", left: 12, right: 12, height: 1,
          background: "rgba(255,220,150,0.3)",
          transform: "translateY(-50%)",
        }} />
      </div>

      {/* Floating particle sparkles around book */}
      {[
        { top: 5, left: 15, size: 8, delay: "0s" },
        { top: 20, right: 10, size: 6, delay: "0.5s" },
        { top: 60, left: 0, size: 5, delay: "1s" },
        { bottom: 30, right: 5, size: 7, delay: "0.3s" },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          ...s,
          fontSize: s.size,
          color: "rgba(160,120,220,0.5)",
          animation: `float-sparkle 3s ease-in-out ${s.delay} infinite`,
        }}>✦</div>
      ))}

      <style>{`
        @keyframes float-sparkle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-4px) scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
