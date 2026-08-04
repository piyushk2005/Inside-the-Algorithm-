/**
 * Pure math utilities for the Decision Boundary module.
 * Logistic regression with polynomial feature expansion, trained via
 * full-batch gradient descent. No React — testable independently.
 */

export function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

// Expand (x, y) into polynomial terms up to `degree`.
// degree 1 -> [x, y]
// degree 2 -> [x, y, x^2, xy, y^2]
// degree 3 adds cubic terms, etc.
export function mapFeatures(x, y, degree) {
  const features = [];
  for (let d = 1; d <= degree; d++) {
    for (let a = d; a >= 0; a--) {
      const b = d - a;
      features.push(Math.pow(x, a) * Math.pow(y, b));
    }
  }
  return features;
}

export function featureCount(degree) {
  let count = 0;
  for (let d = 1; d <= degree; d++) count += d + 1;
  return count;
}

export function predictProb(point, weights, bias, degree) {
  const feats = mapFeatures(point.x, point.y, degree);
  const z = feats.reduce((sum, f, i) => sum + f * (weights[i] || 0), bias);
  return sigmoid(z);
}

/**
 * One full-batch gradient descent step over all points.
 * Returns new { weights, bias, loss }.
 */
export function trainStep(points, weights, bias, degree, learningRate) {
  const n = points.length;
  if (n === 0) return { weights, bias, loss: 0 };

  const nFeatures = featureCount(degree);
  const w = weights.length === nFeatures ? weights : new Array(nFeatures).fill(0);

  const gradW = new Array(nFeatures).fill(0);
  let gradB = 0;
  let loss = 0;

  for (const p of points) {
    const feats = mapFeatures(p.x, p.y, degree);
    const z = feats.reduce((sum, f, i) => sum + f * w[i], bias);
    const pred = sigmoid(z);
    const error = pred - p.label;

    for (let i = 0; i < nFeatures; i++) {
      gradW[i] += error * feats[i];
    }
    gradB += error;

    const eps = 1e-7;
    loss += -(p.label * Math.log(pred + eps) + (1 - p.label) * Math.log(1 - pred + eps));
  }

  const newW = w.map((wi, i) => wi - learningRate * (gradW[i] / n));
  const newB = bias - learningRate * (gradB / n);

  return { weights: newW, bias: newB, loss: loss / n };
}

export function computeAccuracy(points, weights, bias, degree) {
  if (points.length === 0) return 0;
  let correct = 0;
  for (const p of points) {
    const prob = predictProb(p, weights, bias, degree);
    const pred = prob >= 0.5 ? 1 : 0;
    if (pred === p.label) correct++;
  }
  return correct / points.length;
}

// A ready-made two-blob dataset so users don't have to click 20 points.
export function sampleDataset() {
  const points = [];
  const blob = (cx, cy, label, count) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.35;
      points.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        label,
      });
    }
  };
  blob(-0.4, -0.3, 0, 12);
  blob(0.4, 0.3, 1, 12);
  return points;
}
