/**
 * Pure math utilities for the Overfitting module.
 * Fits polynomial regression via least squares (normal equations solved
 * with Gaussian elimination) — no external math library needed.
 */

// True underlying function we're trying to recover, plus noise.
function trueFn(x) {
  return Math.sin(x * Math.PI * 1.8) * 0.5;
}

export function generateData(n = 36, noise = 0.18, seed = 42) {
  // simple deterministic pseudo-random so the dataset doesn't jump around
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const points = [];
  for (let i = 0; i < n; i++) {
    const x = rand();
    const y = trueFn(x) + (rand() - 0.5) * 2 * noise;
    points.push({ x, y });
  }
  return points;
}

export function splitData(points, trainRatio = 0.7) {
  const shuffled = [...points];
  const trainCount = Math.round(points.length * trainRatio);
  return {
    train: shuffled.slice(0, trainCount),
    val: shuffled.slice(trainCount),
  };
}

function buildDesignMatrix(points, degree) {
  return points.map((p) => {
    const row = [];
    for (let d = 0; d <= degree; d++) row.push(Math.pow(p.x, d));
    return row;
  });
}

function transpose(m) {
  return m[0].map((_, c) => m.map((row) => row[c]));
}

function matMul(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    const row = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < b.length; k++) sum += a[i][k] * b[k][j];
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}

// Solve Ax = b via Gaussian elimination with partial pivoting.
function solveLinearSystem(A, b) {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i][0]]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivot][col])) pivot = row;
    }
    [M[col], M[pivot]] = [M[pivot], M[col]];

    if (Math.abs(M[col][col]) < 1e-10) continue; // near-singular; skip

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = M[row][col] / M[col][col];
      for (let k = col; k <= n; k++) M[row][k] -= factor * M[col][k];
    }
  }

  return M.map((row, i) => (Math.abs(row[i]) < 1e-10 ? 0 : row[n] / row[i]));
}

/**
 * Fit a polynomial of given degree to points via least squares.
 * Returns an array of coefficients [c0, c1, ..., c_degree].
 */
export function fitPolynomial(points, degree) {
  if (points.length === 0) return new Array(degree + 1).fill(0);
  const X = buildDesignMatrix(points, degree);
  const y = points.map((p) => [p.y]);
  const Xt = transpose(X);
  const XtX = matMul(Xt, X);
  const Xty = matMul(Xt, y);
  return solveLinearSystem(XtX, Xty);
}

export function predictPoly(coeffs, x) {
  return coeffs.reduce((sum, c, d) => sum + c * Math.pow(x, d), 0);
}

export function computeMSE(points, coeffs) {
  if (points.length === 0) return 0;
  const sumSq = points.reduce((sum, p) => {
    const err = predictPoly(coeffs, p.x) - p.y;
    return sum + err * err;
  }, 0);
  return sumSq / points.length;
}

// Sweep degree 1..maxDegree, fitting on train each time and evaluating both.
export function generateLossSweep(train, val, maxDegree = 9) {
  const sweep = [];
  for (let d = 1; d <= maxDegree; d++) {
    const coeffs = fitPolynomial(train, d);
    sweep.push({
      degree: d,
      trainLoss: computeMSE(train, coeffs),
      valLoss: computeMSE(val, coeffs),
    });
  }
  return sweep;
}

// Flags overfitting: validation loss meaningfully worse than training loss.
export function detectOverfitting(trainLoss, valLoss) {
  return valLoss > trainLoss * 1.6 && valLoss > 0.02;
}
