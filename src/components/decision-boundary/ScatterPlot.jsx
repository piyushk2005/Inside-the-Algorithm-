import React from "react";
import { predictProb } from "../../utils/decisionBoundary";

const RANGE = 1; // data lives in [-1, 1] x [-1, 1]
const GRID = 26; // resolution of the boundary heatmap

export default function ScatterPlot({ points, weights, bias, degree, onAddPoint, activeClass }) {
  const width = 480;
  const height = 480;
  const padding = 20;

  const toScreen = (x, y) => ({
    sx: padding + ((x + RANGE) / (2 * RANGE)) * (width - padding * 2),
    sy: height - padding - ((y + RANGE) / (2 * RANGE)) * (height - padding * 2),
  });

  const toData = (sx, sy) => ({
    x: ((sx - padding) / (width - padding * 2)) * (2 * RANGE) - RANGE,
    y: RANGE - ((sy - padding) / (height - padding * 2)) * (2 * RANGE),
  });

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const sx = (e.clientX - rect.left) * scaleX;
    const sy = (e.clientY - rect.top) * scaleY;
    const { x, y } = toData(sx, sy);
    if (Math.abs(x) <= RANGE && Math.abs(y) <= RANGE) {
      onAddPoint({ x, y, label: activeClass });
    }
  };

  const cellSize = (width - padding * 2) / GRID;

  const heatCells = [];
  const hasModel = weights.length > 0;
  if (hasModel) {
    for (let gx = 0; gx < GRID; gx++) {
      for (let gy = 0; gy < GRID; gy++) {
        const dataX = -RANGE + ((gx + 0.5) / GRID) * (2 * RANGE);
        const dataY = -RANGE + ((gy + 0.5) / GRID) * (2 * RANGE);
        const prob = predictProb({ x: dataX, y: dataY }, weights, bias, degree);
        const { sx, sy } = toScreen(dataX, dataY);
        heatCells.push({ sx, sy, prob });
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      onClick={handleClick}
      style={{ width: "100%", height: "auto", display: "block", cursor: "crosshair" }}
    >
      <rect x={0} y={0} width={width} height={height} fill="#0D1119" />

      {/* boundary heatmap */}
      {heatCells.map((c, i) => {
        const color = c.prob >= 0.5 ? "#3ED9C4" : "#E3B15F";
        const intensity = Math.abs(c.prob - 0.5) * 2; // 0 at boundary, 1 at extremes
        return (
          <rect
            key={i}
            x={c.sx - cellSize / 2}
            y={c.sy - cellSize / 2}
            width={cellSize + 0.5}
            height={cellSize + 0.5}
            fill={color}
            opacity={0.06 + intensity * 0.18}
          />
        );
      })}

      {/* axes */}
      <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.08)" />
      <line x1={width / 2} y1={padding} x2={width / 2} y2={height - padding} stroke="rgba(255,255,255,0.08)" />

      {/* points */}
      {points.map((p, i) => {
        const { sx, sy } = toScreen(p.x, p.y);
        return (
          <circle
            key={i}
            cx={sx}
            cy={sy}
            r="6"
            fill={p.label === 1 ? "#3ED9C4" : "#E3B15F"}
            stroke="#0B0E14"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}
