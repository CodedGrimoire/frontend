"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Column = { name: string; type: string };

type Props = {
  columns: Column[];
  rows: Array<Record<string, unknown>>;
};

// simple heuristic: two columns, multiple rows → bar chart
export default function ChartRenderer({ columns, rows }: Props) {
  if (!columns || !rows || rows.length < 2) return null;

  const numericColumns = columns.filter((col) =>
    rows.every((row) => typeof (row as any)[col.name] === "number")
  );
  const categoryColumns = columns.filter((col) =>
    rows.every((row) => {
      const v = (row as any)[col.name];
      return typeof v === "string" || typeof v === "number";
    })
  );

  if (numericColumns.length < 1 || categoryColumns.length < 1) return null;

  // pick first category and first numeric
  const xKey = categoryColumns[0].name;
  const yKey = numericColumns[0].name;

  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
      <div className="text-sm text-slate-300 mb-2">Data Visualization</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows as any[]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey={xKey} tick={{ fill: "#cbd5e1", fontSize: 12 }} />
            <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 8, color: "#e2e8f0" }}
            />
            <Bar dataKey={yKey} fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
