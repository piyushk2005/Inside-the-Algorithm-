import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Live loss-vs-iteration chart. Takes the history array maintained
 * by the parent module page and just renders it.
 */
export default function LossChart({ history }) {
  const data = history.map((loss, i) => ({ iteration: i, loss }));

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="iteration"
            stroke="#5A626B"
            tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            label={{
              value: "iteration",
              position: "insideBottom",
              offset: -2,
              fill: "#5A626B",
              fontSize: 11,
            }}
          />
          <YAxis
            stroke="#5A626B"
            tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            width={44}
          />
          <Tooltip
            contentStyle={{
              background: "#1B2029",
              border: "1px solid rgba(61,217,196,0.3)",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
            }}
            labelStyle={{ color: "#9BA3AC" }}
          />
          <Line
            type="monotone"
            dataKey="loss"
            stroke="#3ED9C4"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
