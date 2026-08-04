import React, { useEffect, useRef, useState } from "react";
import { createNetwork, trainEpoch, computeAccuracy, XOR_DATA } from "../utils/neuralNetwork";
import ControlPanel from "../components/shared/ControlPanel";
import LabeledSlider from "../components/shared/LabeledSlider";
import LossChart from "../components/gradient-descent/LossChart";
import GuidedWalkthrough from "../components/shared/GuidedWalkthrough";
import NetworkDiagram from "../components/neural-network/NetworkDiagram";
import PageHeader from "../components/shared/PageHeader";
import { useMode } from "../context/ModeContext";

export default function NeuralNetwork({ onBack }) {
  const { guided } = useMode();
  const [hiddenSize, setHiddenSize] = useState(4);
  const [learningRate, setLearningRate] = useState(1.5);
  const [network, setNetwork] = useState(() => createNetwork(4));
  const [history, setHistory] = useState([]);
  const [epoch, setEpoch] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const intervalRef = useRef(null);

  const resetNetwork = (size = hiddenSize) => {
    setNetwork(createNetwork(size));
    setHistory([]);
    setEpoch(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    resetNetwork(hiddenSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenSize]);

  const doStep = () => {
    setNetwork((net) => {
      const { network: nextNet, loss } = trainEpoch(net, XOR_DATA, learningRate);
      setHistory((h) => [...h, loss].slice(-300));
      setEpoch((e) => e + 1);
      return nextNet;
    });
  };

  useEffect(() => {
    if (isPlaying) {
      const ms = Math.max(15, 120 / speed);
      intervalRef.current = setInterval(doStep, ms);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed, learningRate]);

  const accuracy = computeAccuracy(network, XOR_DATA);
  const currentLoss = history.length ? history[history.length - 1] : 1;

  const walkthroughSteps = [
    {
      title: "The XOR problem",
      text: "This network learns XOR — a pattern no straight line can separate. That's exactly why it needs a hidden layer.",
    },
    {
      title: "Train it",
      text: "Hit Play. Watch the edges brighten and shift color as weights update each epoch.",
      apply: ({ setIsPlaying }) => setIsPlaying(true),
    },
    {
      title: "Shrink the hidden layer",
      text: "Try just 1 or 2 hidden neurons — the network may struggle to fully solve XOR.",
      apply: ({ setHiddenSize }) => setHiddenSize(2),
    },
    {
      title: "Give it more capacity",
      text: "With more hidden neurons, it converges faster and more reliably to near-zero loss.",
      apply: ({ setHiddenSize }) => setHiddenSize(5),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0B0E14", color: "#F1F4F3", fontFamily: "'Inter', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <PageHeader onBack={onBack} moduleLabel="Module 4 · Intermediate" />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 48px 100px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px 0" }}>Neural Network Trainer</h1>
        <p style={{ color: "#9BA3AC", fontSize: 14.5, margin: "0 0 32px 0", maxWidth: 640 }}>
          A tiny network learns the XOR pattern. Watch connection weights brighten and shift as it trains.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, marginBottom: 20 }}>
          <div style={panelStyle}>
            <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "#9BA3AC" }}>Network diagram</p>
            <NetworkDiagram network={network} pulse={isPlaying} />
          </div>
          <div style={panelStyle}>
            <p style={{ margin: "0 0 4px 0", fontSize: 13, color: "#9BA3AC" }}>Loss vs. epoch</p>
            <LossChart history={history.length ? history : [1]} />
          </div>
        </div>

        <div style={{ ...panelStyle, marginBottom: 20, display: "flex", gap: 24, flexWrap: "wrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          <span style={{ color: "#9BA3AC" }}>Epoch: <span style={{ color: "#F1F4F3" }}>{epoch}</span></span>
          <span style={{ color: "#9BA3AC" }}>Loss: <span style={{ color: "#F1F4F3" }}>{currentLoss.toFixed(4)}</span></span>
          <span style={{ color: "#9BA3AC" }}>Accuracy: <span style={{ color: "#3ED9C4" }}>{(accuracy * 100).toFixed(0)}%</span></span>
        </div>

        <div style={{ ...panelStyle, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 20 }}>
          <LabeledSlider
            label="Hidden layer size"
            tooltip="More hidden neurons give the network more capacity to represent complex patterns like XOR."
            value={hiddenSize}
            min={1}
            max={6}
            step={1}
            onChange={setHiddenSize}
          />
          <LabeledSlider
            label="Learning rate"
            tooltip="How large each weight update is per epoch. Too high can destabilize training."
            value={learningRate}
            min={0.1}
            max={5}
            step={0.1}
            onChange={setLearningRate}
            formatValue={(v) => v.toFixed(1)}
          />
        </div>

        <ControlPanel
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying((p) => !p)}
          onStep={doStep}
          onReset={() => resetNetwork()}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </main>

      {guided && (
        <GuidedWalkthrough steps={walkthroughSteps} helpers={{ setIsPlaying, setHiddenSize }} onExit={() => {}} />
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
