import React, { useEffect, useRef, useState } from "react";
import { step, lossAt, classifyStatus } from "../utils/gradientDescent";
import ControlPanel from "../components/shared/ControlPanel";
import LabeledSlider from "../components/shared/LabeledSlider";
import LossCurve from "../components/gradient-descent/LossCurve";
import LossChart from "../components/gradient-descent/LossChart";
import StatusCallout from "../components/gradient-descent/StatusCallout";
import GuidedWalkthrough from "../components/shared/GuidedWalkthrough";
import PageHeader from "../components/shared/PageHeader";
import { useMode } from "../context/ModeContext";

const START_POINTS = [
  { label: "Left (-2.5)", value: -2.5 },
  { label: "Right (2.5)", value: 2.5 },
  { label: "Near min (0.5)", value: 0.5 },
];

export default function GradientDescent({ onBack }) {
  const { guided } = useMode();
  const [learningRate, setLearningRate] = useState(0.1);
  const [startX, setStartX] = useState(-2.5);
  const [useMomentum, setUseMomentum] = useState(false);

  const [current, setCurrent] = useState({ x: startX, velocity: 0 });
  const [history, setHistory] = useState([lossAt(startX)]);
  const [trail, setTrail] = useState([startX]);
  const [iteration, setIteration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const intervalRef = useRef(null);

  const doStep = () => {
    setCurrent((prev) => {
      const next = step(prev, learningRate, useMomentum);
      setHistory((h) => [...h, lossAt(next.x)].slice(-200));
      setTrail((t) => [...t, next.x].slice(-8));
      setIteration((i) => i + 1);
      return next;
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrent({ x: startX, velocity: 0 });
    setHistory([lossAt(startX)]);
    setTrail([startX]);
    setIteration(0);
  };

  // Re-seed the simulation whenever the starting point changes
  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startX]);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(30, 260 / speed);
      intervalRef.current = setInterval(doStep, intervalMs);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed, learningRate, useMomentum]);

  // Auto-pause once converged so it doesn't run forever
  useEffect(() => {
    if (Math.abs(current.x) < 0.0005 && isPlaying) {
      setIsPlaying(false);
    }
  }, [current.x, isPlaying]);

  const status = classifyStatus(history, learningRate);
  const currentLoss = lossAt(current.x);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0E14",
        color: "#F1F4F3",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* HEADER */}
      <PageHeader onBack={onBack} moduleLabel="Module 1 · Beginner" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 48px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px 0" }}>
          Gradient Descent Visualizer
        </h1>
        <p style={{ color: "#9BA3AC", fontSize: 14.5, margin: "0 0 32px 0", maxWidth: 620 }}>
          Watch a ball roll down a loss surface toward the minimum. Push the learning rate
          too high and see it overshoot, oscillate, or diverge entirely.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "#11151C",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "#9BA3AC" }}>Loss surface</p>
            <LossCurve currentX={current.x} trail={trail} />
          </div>

          <div
            style={{
              background: "#11151C",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <p style={{ margin: "0 0 4px 0", fontSize: 13, color: "#9BA3AC" }}>
              Loss vs. iteration
            </p>
            <LossChart history={history} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <StatusCallout loss={currentLoss} iteration={iteration} status={status} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <ControlPanel
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying((p) => !p)}
            onStep={doStep}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </div>

        <div
          style={{
            background: "#11151C",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
          }}
        >
          <LabeledSlider
            label="Learning rate"
            tooltip="How big a step the ball takes each iteration. Too high and it overshoots the minimum; too low and it crawls."
            value={learningRate}
            min={0.001}
            max={1.0}
            step={0.001}
            onChange={setLearningRate}
            formatValue={(v) => v.toFixed(3)}
          />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Starting point</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {START_POINTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setStartX(p.value)}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: `1px solid ${startX === p.value ? "#3ED9C4" : "rgba(255,255,255,0.15)"}`,
                    background: startX === p.value ? "rgba(61,217,196,0.1)" : "transparent",
                    color: startX === p.value ? "#3ED9C4" : "#9BA3AC",
                    cursor: "pointer",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                <input
                  type="checkbox"
                  checked={useMomentum}
                  onChange={(e) => setUseMomentum(e.target.checked)}
                  style={{ accentColor: "#3ED9C4" }}
                />
                Momentum
                <span
                  title="Momentum carries some of the previous step's velocity forward, which can speed up convergence but also cause overshoot."
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
                  }}
                >
                  ?
                </span>
              </label>
            </div>
          </div>
        </div>
      </main>

      {guided && (
        <GuidedWalkthrough
          steps={[
            {
              title: "Watch it roll",
              text: "The ball rolls down the loss surface toward the minimum. Hit Play to start.",
              apply: ({ setIsPlaying }) => setIsPlaying(true),
            },
            {
              title: "Push the learning rate too far",
              text: "Set learning rate close to 1.0 and watch the ball overshoot, oscillate, or diverge entirely.",
              apply: ({ setLearningRate }) => setLearningRate(0.95),
            },
            {
              title: "Dial it back",
              text: "A small learning rate converges reliably but slowly. Try 0.02.",
              apply: ({ setLearningRate }) => setLearningRate(0.02),
            },
            {
              title: "Add momentum",
              text: "Momentum carries velocity from previous steps, often speeding convergence — but can also overshoot more.",
              apply: ({ setUseMomentum, setLearningRate }) => {
                setUseMomentum(true);
                setLearningRate(0.15);
              },
            },
          ]}
          helpers={{ setIsPlaying, setLearningRate, setUseMomentum }}
          onExit={() => {}}
        />
      )}
    </div>
  );
}
