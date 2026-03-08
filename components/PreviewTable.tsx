type Column = { name: string; type: string };

type Props = {
  columns: Column[];
  rows: Array<Record<string, unknown>>;
  loading: boolean;
  title?: string;
};

export default function PreviewTable({ columns, rows, loading, title = "Dataset preview" }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="text-sm text-slate-300 mb-2">{title}</div>
      <div className="glass-card flex-1 overflow-auto">
        {loading ? (
          <div className="p-4 text-slate-400 text-sm">Loading dataset…</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-slate-400 text-sm">No rows in dataset.</div>
        ) : (
          <table className="min-w-full text-xs text-left">
            <thead className="sticky top-0 bg-slate-900/90 backdrop-blur z-10">
              <tr>
                {columns.map((col) => (
                  <th key={col.name} className="px-3 py-2 font-semibold text-slate-200 border-b border-slate-800">
                    <div className="flex items-center gap-1">
                      <span>{col.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
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
                    <td key={col.name} className="px-3 py-2 text-slate-100">
                      {renderValue(row[col.name])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function renderValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}
