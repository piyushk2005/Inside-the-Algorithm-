import React from "react";

/**
 * Shared control panel: Play/Pause/Step/Reset + speed slider.
 * Designed to be reused by every module (gradient descent, boundaries,
 * overfitting, neural net) so interaction stays consistent.
 */
export default function ControlPanel({
  isPlaying,
  onPlayPause,
  onStep,
  onReset,
  speed,
  onSpeedChange,
}) {
  const btnStyle = (active) => ({
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12.5,
    letterSpacing: 0.3,
    color: active ? "#0B0E14" : "#3ED9C4",
    background: active ? "#3ED9C4" : "transparent",
    border: "1px solid #3ED9C4",
    borderRadius: 6,
    padding: "9px 18px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        background: "#11151C",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "14px 16px",
      }}
    >
      <button style={btnStyle(isPlaying)} onClick={onPlayPause}>
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>
      <button style={btnStyle(false)} onClick={onStep} disabled={isPlaying}>
        ⏭ Step
      </button>
      <button style={btnStyle(false)} onClick={onReset}>
        ↺ Reset
      </button>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11.5,
            color: "#9BA3AC",
          }}
        >
          Speed {speed.toFixed(1)}x
        </span>
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{ width: 110, accentColor: "#3ED9C4" }}
        />
      </div>
    </div>
  );
}
