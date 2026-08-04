import React from "react";

export default function PageHeader({ onBack, moduleLabel }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#9BA3AC",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12.5,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ← Back
          </button>
        )}
        <span style={{ fontWeight: 600, fontSize: 15 }}>Inside the Algorithm</span>
      </div>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: "#8FE3D3",
          border: "1px solid rgba(61,217,196,0.25)",
          borderRadius: 999,
          padding: "4px 12px",
        }}
      >
        {moduleLabel}
      </span>
    </header>
  );
}
