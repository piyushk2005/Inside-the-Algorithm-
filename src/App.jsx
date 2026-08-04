import React, { useState } from "react";
import { ModeProvider } from "./context/ModeContext";
import Landing from "./pages/Landing.jsx";
import GradientDescent from "./pages/GradientDescent.jsx";
import DecisionBoundary from "./pages/DecisionBoundary.jsx";
import Overfitting from "./pages/Overfitting.jsx";
import NeuralNetwork from "./pages/NeuralNetwork.jsx";
import Architecture from "./pages/Architecture.jsx";

// Simple state-based routing. Swap for react-router-dom later if
// deep-linking / browser back-button support becomes important.
const ROUTES = {
  "gradient-descent": GradientDescent,
  "decision-boundaries": DecisionBoundary,
  overfitting: Overfitting,
  "neural-network": NeuralNetwork,
  architecture: Architecture,
};

export default function App() {
  const [route, setRoute] = useState("landing");

  const goHome = () => setRoute("landing");

  const PageComponent = ROUTES[route];

  return (
    <ModeProvider>
      {PageComponent ? (
        <PageComponent onBack={goHome} />
      ) : (
        <Landing onLaunchModule={(id) => setRoute(id)} onNavigate={(id) => setRoute(id)} />
      )}
    </ModeProvider>
  );
}
