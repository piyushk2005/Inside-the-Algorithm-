/**
 * Pure math utilities for the Gradient Descent module.
 * No React, no side effects — safe to unit test and reuse
 * (e.g. in Module 3's overfitting charts, which share the same
 * "loss curve over iterations" idea).
 */

// Loss surface: a simple convex bowl, f(x) = x^2.
// Kept intentionally simple so the "rolling ball" visual reads clearly.
export function lossAt(x) {
  return x * x;
}

// Analytic gradient of f(x) = x^2 -> f'(x) = 2x
export function gradientAt(x) {
  return 2 * x;
}

/**
 * Advance one gradient descent step.
 * Supports plain GD and momentum-based GD.
 *
 * @param {Object} state - { x, velocity }
 * @param {number} learningRate
 * @param {boolean} useMomentum
 * @param {number} momentumFactor - typically ~0.9
 * @returns {Object} next state { x, velocity }
 */
export function step(state, learningRate, useMomentum = false, momentumFactor = 0.9) {
  const grad = gradientAt(state.x);

  if (useMomentum) {
    const nextVelocity = momentumFactor * state.velocity - learningRate * grad;
    const nextX = state.x + nextVelocity;
    return { x: nextX, velocity: nextVelocity };
  }

  const nextX = state.x - learningRate * grad;
  return { x: nextX, velocity: 0 };
}

/**
 * Classify the trajectory's current status from recent loss history.
 * Used to drive the "Converging / Diverging / Oscillating / Slow" callout.
 */
export function classifyStatus(history, learningRate) {
  if (history.length < 3) return "Starting";

  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  const prev2 = history[history.length - 3];

  if (!isFinite(last) || Math.abs(last) > 1e6) return "Diverging";

  const isOscillating =
    (last > prev && prev < prev2) || (last < prev && prev > prev2);

  if (last > prev * 1.5) return "Diverging";
  if (isOscillating && learningRate > 0.5) return "Oscillating";
  if (Math.abs(last - prev) < 0.0001 && last > 0.001) return "Slow convergence";
  if (Math.abs(last) < 0.001) return "Converged";
  return "Converging";
}

// Convenience: run N steps from a starting x, returning the full trace.
// Useful for drawing the static bowl curve independent of the live simulation.
export function generateCurvePoints(range = 3, resolution = 120) {
  const points = [];
  for (let i = 0; i <= resolution; i++) {
    const x = -range + (2 * range * i) / resolution;
    points.push({ x, y: lossAt(x) });
  }
  return points;
}
