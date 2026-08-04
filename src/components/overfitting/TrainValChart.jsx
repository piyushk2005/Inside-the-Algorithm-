import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

export default function TrainValChart({ sweep, currentDegree }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={sweep} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="degree"
            stroke="#5A626B"
            tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            label={{ value: "polynomial degree", position: "insideBottom", offset: -2, fill: "#5A626B", fontSize: 11 }}
          />
          <YAxis stroke="#5A626B" tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} width={44} />
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
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} />
          <ReferenceLine x={currentDegree} stroke="#F1F4F3" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="trainLoss" name="train loss" stroke="#3ED9C4" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="valLoss" name="val loss" stroke="#E3B15F" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
