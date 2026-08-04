import React, { useState } from "react";

/**
 * A slider with a label, live value readout, and a plain-language
 * tooltip on hover — used across all modules for consistency.
 */
export default function LabeledSlider({
  label,
  tooltip,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 13, color: "#F1F4F3", fontWeight: 500 }}>{label}</span>
        <span
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          style={{
            width: 15,
            height: 15,
            borderRadius: "50%",
            border: "1px solid #5A626B",
            color: "#9BA3AC",
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "help",
          }}
        >
          ?
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12.5,
            color: "#3ED9C4",
          }}
        >
          {formatValue ? formatValue(value) : value}
        </span>
      </div>

      {showTip && (
        <div
          style={{
            position: "absolute",
            top: -8,
            left: 0,
            transform: "translateY(-100%)",
            background: "#1B2029",
            border: "1px solid rgba(61,217,196,0.3)",
            borderRadius: 6,
            padding: "8px 10px",
            fontSize: 12,
            color: "#C7CDD3",
            width: 220,
            zIndex: 10,
            lineHeight: 1.4,
          }}
        >
          {tooltip}
        </div>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#3ED9C4" }}
      />
    </div>
  );
}
