import React, { useEffect, useRef, useState } from "react";
import {
  trainStep,
  computeAccuracy,
  sampleDataset,
  featureCount,
} from "../utils/decisionBoundary";
import ControlPanel from "../components/shared/ControlPanel";
import LabeledSlider from "../components/shared/LabeledSlider";
import GuidedWalkthrough from "../components/shared/GuidedWalkthrough";
import ScatterPlot from "../components/decision-boundary/ScatterPlot";
import PageHeader from "../components/shared/PageHeader";
import { useMode } from "../context/ModeContext";

export default function DecisionBoundary({ onBack }) {
  const { guided } = useMode();
  const [points, setPoints] = useState(sampleDataset());
  const [activeClass, setActiveClass] = useState(1);
  const [degree, setDegree] = useState(1);
  const [learningRate, setLearningRate] = useState(0.5);
  const [weights, setWeights] = useState(new Array(featureCount(1)).fill(0));
  const [bias, setBias] = useState(0);
  const [loss, setLoss] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [epoch, setEpoch] = useState(0);
  const intervalRef = useRef(null);

  const resetModel = (deg = degree) => {
    setWeights(new Array(featureCount(deg)).fill(0));
    setBias(0);
    setLoss(0);
    setEpoch(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    resetModel(degree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [degree]);

  const doStep = () => {
    const result = trainStep(points, weights, bias, degree, learningRate);
    setWeights(result.weights);
    setBias(result.bias);
    setLoss(result.loss);
    setEpoch((e) => e + 1);
  };

  useEffect(() => {
    if (isPlaying) {
      const ms = Math.max(20, 200 / speed);
      intervalRef.current = setInterval(doStep, ms);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed, points, weights, bias, degree, learningRate]);

  const accuracy = computeAccuracy(points, weights, bias, degree);

  const walkthroughSteps = [
    {
      title: "Meet the playground",
      text: "Two classes of points sit on a plane. Click anywhere to add more of your own.",
    },
    {
      title: "Train the model",
      text: "Hit Play and watch the boundary (the teal/amber shading) shift as the model learns.",
      apply: ({ setIsPlaying }) => setIsPlaying(true),
    },
    {
      title: "Try a curved boundary",
      text: "Increase model complexity to degree 2 or 3 — the boundary can now bend to fit trickier data.",
      apply: ({ setDegree }) => setDegree(2),
    },
    {
      title: "Watch for overfitting",
      text: "Very high degree can carve tight shapes around individual points instead of the general pattern — that's overfitting, explored fully in Module 3.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0B0E14", color: "#F1F4F3", fontFamily: "'Inter', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <PageHeader onBack={onBack} moduleLabel="Module 2 · Beginner" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 48px 100px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px 0" }}>Decision Boundary Playground</h1>
        <p style={{ color: "#9BA3AC", fontSize: 14.5, margin: "0 0 32px 0", maxWidth: 640 }}>
          Click the plane to add points to either class, then train a classifier and watch the
          boundary between them take shape.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20, marginBottom: 20 }}>
          <div style={panelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#9BA3AC" }}>Data plane</p>
              <div style={{ display: "flex", gap: 6 }}>
                <ClassButton label="Class A" color="#E3B15F" active={activeClass === 0} onClick={() => setActiveClass(0)} />
                <ClassButton label="Class B" color="#3ED9C4" active={activeClass === 1} onClick={() => setActiveClass(1)} />
              </div>
            </div>
            <ScatterPlot
              points={points}
              weights={weights}
              bias={bias}
              degree={degree}
              onAddPoint={(p) => setPoints((pts) => [...pts, p])}
              activeClass={activeClass}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <SmallButton onClick={() => { setPoints([]); resetModel(); }}>Reset dataset</SmallButton>
              <SmallButton onClick={() => { setPoints(sampleDataset()); resetModel(); }}>Load sample dataset</SmallButton>
            </div>
          </div>

          <div style={panelStyle}>
            <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "#9BA3AC" }}>Model status</p>
            <StatRow label="Accuracy" value={`${(accuracy * 100).toFixed(1)}%`} highlight />
            <StatRow label="Loss" value={loss.toFixed(4)} />
            <StatRow label="Epoch" value={epoch} />
            <StatRow label="Points" value={points.length} />
            <StatRow label="Degree" value={degree} />

            <div style={{ marginTop: 24 }}>
              <LabeledSlider
                label="Model complexity (degree)"
                tooltip="Degree 1 gives a straight line boundary. Higher degrees let it curve — useful for tricky data, risky for overfitting."
                value={degree}
                min={1}
                max={3}
                step={1}
                onChange={setDegree}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <LabeledSlider
                label="Learning rate"
                tooltip="How fast the model updates its boundary each training step."
                value={learningRate}
                min={0.01}
                max={2}
                step={0.01}
                onChange={setLearningRate}
                formatValue={(v) => v.toFixed(2)}
              />
            </div>
          </div>
        </div>

        <ControlPanel
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying((p) => !p)}
          onStep={doStep}
          onReset={() => resetModel()}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </main>

      {guided && (
        <GuidedWalkthrough
          steps={walkthroughSteps}
          helpers={{ setIsPlaying, setDegree }}
          onExit={() => {}}
        />
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

function ClassButton({ label, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11.5,
        padding: "6px 10px",
        borderRadius: 6,
        border: `1px solid ${color}`,
        background: active ? color : "transparent",
        color: active ? "#0B0E14" : color,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function SmallButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11.5,
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "transparent",
        color: "#9BA3AC",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function StatRow({ label, value, highlight }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12.5,
      }}
    >
      <span style={{ color: "#9BA3AC" }}>{label}</span>
      <span style={{ color: highlight ? "#3ED9C4" : "#F1F4F3" }}>{value}</span>
    </div>
  );
}
