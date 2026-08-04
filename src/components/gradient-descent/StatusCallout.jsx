import React from "react";

const STATUS_COLORS = {
  Converging: "#3ED9C4",
  Converged: "#3ED9C4",
  "Slow convergence": "#E3B15F",
  Oscillating: "#E3B15F",
  Diverging: "#E07A5F",
  Starting: "#9BA3AC",
};

export default function StatusCallout({ loss, iteration, status }) {
  const color = STATUS_COLORS[status] || "#9BA3AC";

  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        background: "#11151C",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "12px 16px",
      }}
    >
      <span style={{ color: "#9BA3AC" }}>
        Loss: <span style={{ color: "#F1F4F3" }}>{loss.toFixed(5)}</span>
      </span>
      <span style={{ color: "#9BA3AC" }}>
        Iteration: <span style={{ color: "#F1F4F3" }}>{iteration}</span>
      </span>
      <span style={{ color: "#9BA3AC" }}>
        Status: <span style={{ color }}>{status}</span>
      </span>
    </div>
  );
}
