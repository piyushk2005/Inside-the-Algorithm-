import React from "react";
import { generateCurvePoints } from "../../utils/gradientDescent";

/**
 * Draws the static parabola loss surface and an animated marker
 * showing the current position of the "ball" rolling toward the minimum.
 */
export default function LossCurve({ currentX, trail = [] }) {
  const width = 480;
  const height = 300;
  const padding = 30;
  const range = 3.2;

  const points = generateCurvePoints(range, 120);
  const maxY = range * range;

  const toScreenX = (x) => padding + ((x + range) / (2 * range)) * (width - padding * 2);
  const toScreenY = (y) => height - padding - (y / maxY) * (height - padding * 2);

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toScreenX(p.x)} ${toScreenY(p.y)}`)
    .join(" ");

  const ballX = toScreenX(currentX);
  const ballY = toScreenY(Math.min(currentX * currentX, maxY));
  const offScreen = Math.abs(currentX) > range;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* grid */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="rgba(255,255,255,0.1)"
      />
      <line
        x1={toScreenX(0)}
        y1={padding}
        x2={toScreenX(0)}
        y2={height - padding}
        stroke="rgba(255,255,255,0.06)"
        strokeDasharray="4 4"
      />

      {/* the loss bowl */}
      <path d={pathD} fill="none" stroke="#2E3742" strokeWidth="2.5" />
      <path d={pathD} fill="none" stroke="#3ED9C4" strokeWidth="1" opacity="0.35" />

      {/* minimum marker */}
      <circle cx={toScreenX(0)} cy={toScreenY(0)} r="3.5" fill="#E3B15F" />
      <text
        x={toScreenX(0)}
        y={toScreenY(0) + 18}
        textAnchor="middle"
        fontSize="10"
        fontFamily="'JetBrains Mono', monospace"
        fill="#E3B15F"
      >
        min
      </text>

      {/* trail of recent positions, fading out */}
      {trail.map((tx, i) => {
        const ty = Math.min(tx * tx, maxY);
        const opacity = ((i + 1) / trail.length) * 0.35;
        return (
          <circle
            key={i}
            cx={toScreenX(tx)}
            cy={toScreenY(ty)}
            r="3"
            fill="#3ED9C4"
            opacity={opacity}
          />
        );
      })}

      {/* the rolling ball */}
      {!offScreen && (
        <circle
          cx={ballX}
          cy={ballY}
          r="7"
          fill="#3ED9C4"
          stroke="#0B0E14"
          strokeWidth="2"
          style={{ transition: "cx 0.15s linear, cy 0.15s linear" }}
        />
      )}

      {offScreen && (
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fontSize="13"
          fontFamily="'JetBrains Mono', monospace"
          fill="#E07A5F"
        >
          ↯ diverged off-surface
        </text>
      )}
    </svg>
  );
}
