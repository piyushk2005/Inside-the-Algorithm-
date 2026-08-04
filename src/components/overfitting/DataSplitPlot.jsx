import React from "react";
import { predictPoly } from "../../utils/overfitting";

export default function DataSplitPlot({ train, val, coeffs }) {
  const width = 480;
  const height = 300;
  const padding = 30;

  const toSX = (x) => padding + x * (width - padding * 2);
  const toSY = (y) => height - padding - ((y + 1) / 2) * (height - padding * 2);

  const curvePoints = [];
  for (let i = 0; i <= 100; i++) {
    const x = i / 100;
    curvePoints.push({ x, y: predictPoly(coeffs, x) });
  }
  const pathD = curvePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toSX(p.x)} ${Math.max(0, Math.min(height, toSY(p.y)))}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />
      <line x1={padding} y1={toSY(0)} x2={width - padding} y2={toSY(0)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

      <path d={pathD} fill="none" stroke="#3ED9C4" strokeWidth="2" />

      {train.map((p, i) => (
        <circle key={"t" + i} cx={toSX(p.x)} cy={toSY(p.y)} r="3.5" fill="#3ED9C4" opacity="0.85" />
      ))}
      {val.map((p, i) => (
        <circle key={"v" + i} cx={toSX(p.x)} cy={toSY(p.y)} r="3.5" fill="#E3B15F" opacity="0.85" />
      ))}

      <g transform={`translate(${width - 150}, ${padding})`}>
        <circle cx={0} cy={0} r="3.5" fill="#3ED9C4" />
        <text x={10} y={4} fontSize="11" fontFamily="'JetBrains Mono', monospace" fill="#9BA3AC">train</text>
        <circle cx={60} cy={0} r="3.5" fill="#E3B15F" />
        <text x={70} y={4} fontSize="11" fontFamily="'JetBrains Mono', monospace" fill="#9BA3AC">val</text>
      </g>
    </svg>
  );
}
