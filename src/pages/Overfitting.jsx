import React, { useMemo, useState } from "react";
import {
  generateData,
  splitData,
  fitPolynomial,
  computeMSE,
  generateLossSweep,
  detectOverfitting,
} from "../utils/overfitting";
import LabeledSlider from "../components/shared/LabeledSlider";
import GuidedWalkthrough from "../components/shared/GuidedWalkthrough";
import DataSplitPlot from "../components/overfitting/DataSplitPlot";
import TrainValChart from "../components/overfitting/TrainValChart";
import PageHeader from "../components/shared/PageHeader";
import { useMode } from "../context/ModeContext";

const MAX_DEGREE = 9;

export default function Overfitting({ onBack }) {
  const { guided } = useMode();
  const [seed, setSeed] = useState(42);
  const [degree, setDegree] = useState(1);

  const { train, val } = useMemo(() => {
    const data = generateData(36, 0.18, seed);
    return splitData(data, 0.7);
  }, [seed]);

  const coeffs = useMemo(() => fitPolynomial(train, degree), [train, degree]);
  const trainLoss = useMemo(() => computeMSE(train, coeffs), [train, coeffs]);
  const valLoss = useMemo(() => computeMSE(val, coeffs), [val, coeffs]);
  const sweep = useMemo(() => generateLossSweep(train, val, MAX_DEGREE), [train, val]);

  const overfitting = detectOverfitting(trainLoss, valLoss);

  const walkthroughSteps = [
    {
      title: "Train vs. validation",
      text: "Teal points train the model. Amber points are held out to check whether it actually generalizes.",
    },
    {
      title: "Start simple",
      text: "At degree 1 the curve is a straight line — probably underfitting the true pattern.",
      apply: ({ setDegree }) => setDegree(1),
    },
    {
      title: "Push it too far",
      text: "Crank the degree way up. The curve will contort itself to hit every training point exactly — while validation loss gets worse.",
      apply: ({ setDegree }) => setDegree(9),
    },
    {
      title: "Find the sweet spot",
      text: "Somewhere in between, both curves in the loss chart bottom out together. That's the degree that generalizes best.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0B0E14", color: "#F1F4F3", fontFamily: "'Inter', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <PageHeader onBack={onBack} moduleLabel="Module 3 · Intermediate" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 48px 100px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px 0" }}>Overfitting Demonstrator</h1>
        <p style={{ color: "#9BA3AC", fontSize: 14.5, margin: "0 0 32px 0", maxWidth: 640 }}>
          Fit a curve to noisy data. Push the polynomial degree up and watch training loss and
          validation loss pull apart.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, marginBottom: 20 }}>
          <div style={panelStyle}>
            <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "#9BA3AC" }}>Fitted curve</p>
            <DataSplitPlot train={train} val={val} coeffs={coeffs} />
          </div>
          <div style={panelStyle}>
            <p style={{ margin: "0 0 4px 0", fontSize: 13, color: "#9BA3AC" }}>Loss vs. degree</p>
            <TrainValChart sweep={sweep} currentDegree={degree} />
          </div>
        </div>

        {overfitting && (
          <div
            style={{
              background: "rgba(224,122,95,0.1)",
              border: "1px solid rgba(224,122,95,0.4)",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 20,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12.5,
              color: "#E07A5F",
            }}
          >
            ⚠ Overfitting detected — validation loss is climbing while training loss stays low.
          </div>
        )}

        <div style={panelStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 20 }}>
            <LabeledSlider
              label="Polynomial degree"
              tooltip="Higher degree lets the curve bend more. Great for fitting complex patterns, dangerous for fitting noise."
              value={degree}
              min={1}
              max={MAX_DEGREE}
              step={1}
              onChange={setDegree}
            />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSeed((s) => s + 1)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  padding: "9px 14px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent",
                  color: "#9BA3AC",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                ↺ Resample data
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            <span style={{ color: "#9BA3AC" }}>
              Train loss: <span style={{ color: "#3ED9C4" }}>{trainLoss.toFixed(4)}</span>
            </span>
            <span style={{ color: "#9BA3AC" }}>
              Val loss: <span style={{ color: "#E3B15F" }}>{valLoss.toFixed(4)}</span>
            </span>
          </div>
        </div>
      </main>

      {guided && (
        <GuidedWalkthrough steps={walkthroughSteps} helpers={{ setDegree }} onExit={() => {}} />
      )}
    </div>
  );
}

const panelStyle = {
  background: "#11151C",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: 20,
};
