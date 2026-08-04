import React, { useEffect, useState } from "react";

/**
 * Floating step-by-step walkthrough panel.
 * `steps` = [{ title, text, apply?: (helpers) => void }]
 * `apply` (optional) lets a step push preset parameter values into the
 * module, e.g. "Step 1: Set learning rate to 1.0 and watch what happens".
 */
export default function GuidedWalkthrough({ steps, helpers, onExit }) {
  const [index, setIndex] = useState(0);
  const step = steps[index];

  useEffect(() => {
    if (step?.apply) step.apply(helpers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!step) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 300,
        background: "#151A22",
        border: "1px solid rgba(61,217,196,0.35)",
        borderRadius: 12,
        padding: "16px 18px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#3ED9C4",
            letterSpacing: 0.4,
          }}
        >
          STEP {index + 1} OF {steps.length}
        </span>
        <button
          onClick={onExit}
          style={{
            background: "transparent",
            border: "none",
            color: "#6B7280",
            cursor: "pointer",
            fontSize: 13,
          }}
          title="Exit guided mode"
        >
          ✕
        </button>
      </div>

      <h4 style={{ margin: "0 0 6px 0", fontSize: 14, color: "#F1F4F3" }}>{step.title}</h4>
      <p style={{ margin: "0 0 14px 0", fontSize: 12.5, lineHeight: 1.5, color: "#9BA3AC" }}>
        {step.text}
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          style={navBtnStyle(index === 0)}
        >
          ← Prev
        </button>
        <button
          disabled={index === steps.length - 1}
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          style={navBtnStyle(index === steps.length - 1, true)}
        >
          Next →
        </button>
      </div>

      <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i <= index ? "#3ED9C4" : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function navBtnStyle(disabled, primary) {
  return {
    flex: 1,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11.5,
    padding: "7px 10px",
    borderRadius: 6,
    border: "1px solid #3ED9C4",
    background: primary && !disabled ? "#3ED9C4" : "transparent",
    color: primary && !disabled ? "#0B0E14" : "#3ED9C4",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.35 : 1,
  };
}
