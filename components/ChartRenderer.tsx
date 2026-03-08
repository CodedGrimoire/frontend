"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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

export default function ChartRenderer({ columns, rows }: Props) {
  if (!columns || !rows || rows.length < 1) return null;

  const isNumericType = (t: string) =>
    ["int", "numeric", "decimal", "double", "float", "real", "number"].some((k) => t.toLowerCase().includes(k));
  const isDateLike = (t: string, name: string) =>
    ["date", "time", "timestamp"].some((k) => t.toLowerCase().includes(k)) || /(date|day|month|year)/i.test(name);

  // single scalar
  if (rows.length === 1 && columns.length === 1 && typeof rows[0][columns[0].name] === "number") {
    return (
      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <div className="text-sm text-slate-300 mb-1">Metric</div>
        <div className="text-3xl font-semibold text-slate-50">
          {Number(rows[0][columns[0].name]).toLocaleString()}
        </div>
      </div>
    );
  }

  const numericColumns = columns.filter((col) =>
    rows.every((row) => {
      const v = (row as any)[col.name];
      if (typeof v === "number") return true;
      const num = Number(v);
      return Number.isFinite(num) && v !== null && v !== "";
    }) || isNumericType(col.type)
  );

  const categoryColumns = columns.filter((col) => {
    if (isDateLike(col.type, col.name) || isNumericType(col.type)) return false;
    return rows.every((r) => {
      const v = (r as any)[col.name];
      return v !== null && v !== undefined;
    });
  });
  const dateColumns = columns.filter((col) => isDateLike(col.type, col.name));

  // line: date + numeric
  if (dateColumns.length >= 1 && numericColumns.length >= 1 && rows.length >= 2) {
    const xKey = dateColumns[0].name;
    const yKey = numericColumns[0].name;
    return (
      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <div className="text-sm text-slate-300 mb-2">Trend</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows as any[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey={xKey} tick={{ fill: "#cbd5e1", fontSize: 12 }} />
              <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1f2937", borderRadius: 8, color: "#e2e8f0" }}
              />
              <Line type="monotone" dataKey={yKey} stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // bar: one category + one numeric
  if (categoryColumns.length >= 1 && numericColumns.length >= 1 && rows.length >= 2) {
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

  return null;
}
