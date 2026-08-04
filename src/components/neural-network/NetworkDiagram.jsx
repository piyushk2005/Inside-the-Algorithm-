import React from "react";

export default function NetworkDiagram({ network, pulse }) {
  const width = 480;
  const height = 320;
  const { hiddenSize, W1, W2 } = network;

  const inputX = 70;
  const hiddenX = width / 2;
  const outputX = width - 70;

  const inputYs = [height * 0.35, height * 0.65];
  const hiddenYs = Array.from({ length: hiddenSize }, (_, i) =>
    (height / (hiddenSize + 1)) * (i + 1)
  );
  const outputY = height / 2;

  const edgeColor = (w) => (w >= 0 ? "#3ED9C4" : "#E3B15F");
  const edgeWidth = (w) => 0.6 + Math.min(Math.abs(w), 3) * 1.4;
  const edgeOpacity = (w) => 0.25 + Math.min(Math.abs(w), 3) / 3 * 0.55;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {/* input -> hidden edges */}
      {inputYs.map((iy, i) =>
        hiddenYs.map((hy, h) => {
          const w = W1[i][h];
          return (
            <line
              key={`i${i}h${h}`}
              x1={inputX}
              y1={iy}
              x2={hiddenX}
              y2={hy}
              stroke={edgeColor(w)}
              strokeWidth={edgeWidth(w)}
              opacity={edgeOpacity(w)}
            />
          );
        })
      )}

      {/* hidden -> output edges */}
      {hiddenYs.map((hy, h) => {
        const w = W2[h];
        return (
          <line
            key={`h${h}o`}
            x1={hiddenX}
            y1={hy}
            x2={outputX}
            y2={outputY}
            stroke={edgeColor(w)}
            strokeWidth={edgeWidth(w)}
            opacity={edgeOpacity(w)}
          />
        );
      })}

      {/* pulse animation along a representative path */}
      {pulse && (
        <circle r="4" fill="#F1F4F3">
          <animateMotion
            dur="1.4s"
            repeatCount="indefinite"
            path={`M ${inputX} ${inputYs[0]} L ${hiddenX} ${hiddenYs[0]} L ${outputX} ${outputY}`}
          />
        </circle>
      )}

      {/* input nodes */}
      {inputYs.map((iy, i) => (
        <g key={"in" + i}>
          <circle cx={inputX} cy={iy} r="12" fill="#151A22" stroke="#3ED9C4" strokeWidth="1.5" />
          <text x={inputX} y={iy + 4} textAnchor="middle" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill="#F1F4F3">
            x{i + 1}
          </text>
        </g>
      ))}

      {/* hidden nodes */}
      {hiddenYs.map((hy, h) => (
        <circle key={"hn" + h} cx={hiddenX} cy={hy} r="10" fill="#151A22" stroke="#3ED9C4" strokeWidth="1.5" />
      ))}

      {/* output node */}
      <circle cx={outputX} cy={outputY} r="13" fill="#151A22" stroke="#E3B15F" strokeWidth="1.5" />
      <text x={outputX} y={outputY + 4} textAnchor="middle" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill="#F1F4F3">
        ŷ
      </text>

      <text x={inputX} y={20} textAnchor="middle" fontSize="10" fontFamily="'JetBrains Mono', monospace" fill="#5A626B">input</text>
      <text x={hiddenX} y={20} textAnchor="middle" fontSize="10" fontFamily="'JetBrains Mono', monospace" fill="#5A626B">hidden</text>
      <text x={outputX} y={20} textAnchor="middle" fontSize="10" fontFamily="'JetBrains Mono', monospace" fill="#5A626B">output</text>
    </svg>
  );
}
