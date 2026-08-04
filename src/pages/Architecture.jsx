import React from "react";
import PageHeader from "../components/shared/PageHeader";

const STAGES = [
  {
    title: "Data Generation",
    desc: "Each module creates or accepts a small dataset — sample points, a click-built scatter, or synthetic noisy data — kept as plain JS arrays.",
  },
  {
    title: "Model Logic",
    desc: "Pure JS/TS functions (in src/utils/) implement the math: gradient steps, polynomial fits, logistic regression, backprop. No React here — fully testable on their own.",
  },
  {
    title: "Render Loop",
    desc: "A React page component holds state and calls the utility functions on an interval (via setInterval, driven by Play/Pause) or on demand (via Step).",
  },
  {
    title: "UI Controls",
    desc: "Shared components — sliders, Play/Pause/Step/Reset, speed control — feed parameter changes back into the render loop.",
  },
  {
    title: "Chart Output",
    desc: "recharts renders live-updating loss curves; hand-built SVG renders the more custom visuals (loss bowl, decision boundary heatmap, network diagram).",
  },
];

export default function Architecture({ onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0B0E14", color: "#F1F4F3", fontFamily: "'Inter', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <PageHeader onBack={onBack} moduleLabel="Architecture" />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 48px 100px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 10px 0" }}>Simulation Pipeline</h1>
        <p style={{ color: "#9BA3AC", fontSize: 14.5, margin: "0 0 40px 0", maxWidth: 620 }}>
          Every module in Inside the Algorithm follows the same five-stage pipeline, keeping
          math logic separate from rendering so each piece can be tested and reused independently.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STAGES.map((stage, i) => (
            <div key={stage.title} style={{ display: "flex", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1.5px solid #3ED9C4",
                    background: "rgba(61,217,196,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    color: "#3ED9C4",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                {i < STAGES.length - 1 && (
                  <div style={{ width: 1.5, flex: 1, minHeight: 36, background: "rgba(61,217,196,0.25)" }} />
                )}
              </div>
              <div style={{ paddingBottom: 34 }}>
                <h3 style={{ margin: "6px 0 6px 0", fontSize: 16, fontWeight: 600 }}>{stage.title}</h3>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "#9BA3AC", maxWidth: 540 }}>
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            background: "#11151C",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "20px 24px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            color: "#8FE3D3",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          Data Generation → Model Logic → Render Loop → UI Controls → Chart Output
        </div>
      </main>
    </div>
  );
}
