type Column = { name: string; type: string };

type Props = {
  columns: Column[];
  rows: Array<Record<string, unknown>>;
  loading: boolean;
};

export default function ResultTable({ columns, rows, loading }: Props) {
  if (loading) {
    return (
      <div className="glass-card p-4 text-sm text-slate-300">Running query…</div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="glass-card p-4 text-sm text-slate-400">No rows to display.</div>
    );
  }

  return (
    <div className="glass-card overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-slate-900/60">
          <tr>
            {columns.map((col) => (
              <th key={col.name} className="px-4 py-3 font-semibold text-slate-200 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span>{col.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase">
                    {col.type}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-800/60 last:border-0">
              {columns.map((col) => (
                <td key={col.name} className="px-4 py-3 text-slate-100">
                  {renderValue(row[col.name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}
