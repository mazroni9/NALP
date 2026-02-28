"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// TODO: إعادة ربطها بحسابات فعلية لاحقًا
const CHART_DATA = [
  { year: 1, income: 2.5 },
  { year: 2, income: 3.3 },
  { year: 3, income: 4.2 },
  { year: 4, income: 4.8 },
  { year: 5, income: 4.8 },
  { year: 6, income: 4.8 },
  { year: 7, income: 5.1 },
  { year: 8, income: 5.1 },
];

export function IncomeChart() {
  return (
    <div className="h-80 min-h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={CHART_DATA}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
            tickFormatter={(v) => `${v}M`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) =>
              [value != null ? `${value}M SAR` : "", "دخل ملاك الأرض"]
            }
            labelFormatter={(label) => `السنة ${label}`}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ fill: "#4f46e5", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
