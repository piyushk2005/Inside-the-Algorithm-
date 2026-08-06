import { useState } from "react";

const RULES = {
  gradientDescent: (s) => {
    if (s.learningRate > 1.2) return "Whoa — that learning rate is huge. Watch the ball overshoot the minimum instead of settling into it.";
    if (s.loss < 0.05) return "Nice — loss is near zero. The ball has basically found the bottom of the curve.";
    if (s.iteration > 30 && s.loss > 3) return "Stuck? A learning rate this low means tiny steps. Try nudging it up.";
    return "Watch how the ball's step size changes with the learning rate — bigger rate, bigger jumps.";
  },
  decisionBoundary: (s) => {
    if (s.accuracy === 100) return "Perfect split! The boundary now cleanly separates both classes.";
    if (s.accuracy < 60) return "The boundary's struggling — try adding a few more points or increasing complexity.";
    return "As you raise complexity, watch the boundary bend to fit the points more tightly.";
  },
  overfitting: (s) => {
    if (s.valLoss - s.trainLoss > 0.15) return "See the gap? Train loss keeps dropping but val loss is rising — that's overfitting in action.";
    if (s.degree <= 2) return "Low degree, both curves track together — the model's too simple to overfit yet.";
    return "Push the polynomial degree higher and watch train and validation loss pull apart.";
  },
  neuralNetwork: (s) => {
    if (s.accuracy === 100) return "It learned XOR! Notice how it needed that hidden layer to bend a straight decision boundary into a curve.";
    if (s.epoch > 50 && s.accuracy < 70) return "Taking a while — try a higher learning rate or a bigger hidden layer.";
    return "Watch the connection lines brighten — that's the weights adjusting as it learns.";
  },
};

export default function AITeacher({ module, state }) {
  const [open, setOpen] = useState(true);
  const message = RULES[module] ? RULES[module](state) : "Adjust the controls and watch what changes.";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ position: "fixed", bottom: 20, right: 20, background: "#2dd4bf", color: "#0a0e14",
                 border: "none", borderRadius: "50%", width: 48, height: 48, cursor: "pointer", fontSize: 20 }}
      >
        🤖
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, maxWidth: 300,
      background: "#0f1720", border: "1px solid #2dd4bf", borderRadius: 12,
      padding: 16, color: "#e6f1ef", fontFamily: "monospace", fontSize: 14
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong style={{ color: "#2dd4bf" }}>🤖 AI Teacher</strong>
        <span onClick={() => setOpen(false)} style={{ cursor: "pointer" }}>✕</span>
      </div>
      <p>{message}</p>
    </div>
  );
}