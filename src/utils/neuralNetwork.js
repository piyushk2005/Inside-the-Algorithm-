/**
 * Pure math for a tiny 2-input, 1-hidden-layer, 1-output neural network,
 * trained via full-batch backpropagation on the XOR problem — a classic
 * example that a single linear boundary can't solve, which is exactly
 * why a hidden layer helps.
 */

export const XOR_DATA = [
  { input: [0, 0], target: 0 },
  { input: [0, 1], target: 1 },
  { input: [1, 0], target: 1 },
  { input: [1, 1], target: 0 },
];

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}
function sigmoidDeriv(a) {
  return a * (1 - a);
}

function randInit() {
  return (Math.random() - 0.5) * 2; // roughly [-1, 1]
}

export function createNetwork(hiddenSize) {
  return {
    hiddenSize,
    W1: Array.from({ length: 2 }, () => Array.from({ length: hiddenSize }, randInit)),
    b1: new Array(hiddenSize).fill(0),
    W2: Array.from({ length: hiddenSize }, () => randInit()),
    b2: 0,
  };
}

export function forward(network, input) {
  const { W1, b1, W2, b2, hiddenSize } = network;
  const hidden = new Array(hiddenSize);
  for (let h = 0; h < hiddenSize; h++) {
    let z = b1[h];
    for (let i = 0; i < input.length; i++) z += input[i] * W1[i][h];
    hidden[h] = sigmoid(z);
  }
  let outZ = b2;
  for (let h = 0; h < hiddenSize; h++) outZ += hidden[h] * W2[h];
  const output = sigmoid(outZ);
  return { hidden, output };
}

/**
 * One full-batch gradient descent epoch over the given dataset.
 * Returns a NEW network object (immutable-style) plus the mean loss.
 */
export function trainEpoch(network, dataset, learningRate) {
  const { hiddenSize } = network;
  const W1 = network.W1.map((row) => [...row]);
  const b1 = [...network.b1];
  const W2 = [...network.W2];
  let b2 = network.b2;

  const gradW1 = W1.map((row) => row.map(() => 0));
  const gradB1 = new Array(hiddenSize).fill(0);
  const gradW2 = new Array(hiddenSize).fill(0);
  let gradB2 = 0;
  let totalLoss = 0;

  for (const sample of dataset) {
    const { hidden, output } = forward({ W1, b1, W2, b2, hiddenSize }, sample.input);
    const error = output - sample.target;
    totalLoss += error * error;

    const dOut = error * sigmoidDeriv(output);
    for (let h = 0; h < hiddenSize; h++) {
      gradW2[h] += dOut * hidden[h];
    }
    gradB2 += dOut;

    for (let h = 0; h < hiddenSize; h++) {
      const dHidden = dOut * W2[h] * sigmoidDeriv(hidden[h]);
      for (let i = 0; i < sample.input.length; i++) {
        gradW1[i][h] += dHidden * sample.input[i];
      }
      gradB1[h] += dHidden;
    }
  }

  const n = dataset.length;
  const newW1 = W1.map((row, i) => row.map((w, h) => w - learningRate * (gradW1[i][h] / n)));
  const newB1 = b1.map((b, h) => b - learningRate * (gradB1[h] / n));
  const newW2 = W2.map((w, h) => w - learningRate * (gradW2[h] / n));
  const newB2 = b2 - learningRate * (gradB2 / n);

  return {
    network: { hiddenSize, W1: newW1, b1: newB1, W2: newW2, b2: newB2 },
    loss: totalLoss / n,
  };
}

export function computeAccuracy(network, dataset) {
  let correct = 0;
  for (const sample of dataset) {
    const { output } = forward(network, sample.input);
    const pred = output >= 0.5 ? 1 : 0;
    if (pred === sample.target) correct++;
  }
  return correct / dataset.length;
}
