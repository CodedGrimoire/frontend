type Column = { name: string; type: string };

type Props = {
  columns: Column[];
  rows: Array<Record<string, unknown>>;
  loading: boolean;
  title?: string;
  page?: number;
  limit?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc";
  onSort?: (column: string) => void;
  filterColumn?: string | null;
  filterValue?: string;
  onFilterChange?: (column: string, value: string) => void;
  onClearFilter?: () => void;
};

export default function PreviewTable({
  columns,
  rows,
  loading,
  title = "Dataset preview",
  page = 1,
  limit = 50,
  totalRows = 0,
  onPageChange,
  sortBy,
  sortOrder = "asc",
  onSort,
  filterColumn,
  filterValue = "",
  onFilterChange,
  onClearFilter,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalRows / limit));
  return (
    <div className="flex flex-col h-full">
      <div className="text-sm text-slate-300 mb-2">{title}</div>
      {(filterColumn || filterValue) && (
        <div className="flex items-center gap-2 mb-2 text-sm text-slate-200">
          <span>Filters:</span>
          {filterColumn && (
            <div className="px-2 py-1 rounded-full bg-white/10 border border-white/15 flex items-center gap-2">
              <span>
                {filterColumn} = {filterValue || "*"}
              </span>
              {onClearFilter && (
                <button className="text-xs text-rose-300" onClick={onClearFilter}>
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {onFilterChange && (
        <div className="flex items-center gap-2 mb-2 text-sm">
          <label className="text-slate-300">Filter:</label>
          <select
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
            value={filterColumn || ""}
            onChange={(e) => onFilterChange(e.target.value, filterValue)}
          >
            <option value="">Column…</option>
            {columns.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 flex-1"
            placeholder="Contains…"
            value={filterValue}
            onChange={(e) => onFilterChange(filterColumn || "", e.target.value)}
          />
          <button
            className="px-3 py-1 rounded border border-slate-700 text-slate-100 disabled:opacity-50"
            disabled={!filterColumn}
            onClick={() => onFilterChange(filterColumn || "", filterValue)}
          >
            Apply
          </button>
          {onClearFilter && (
            <button className="px-3 py-1 rounded border border-slate-700 text-slate-100" onClick={onClearFilter}>
              Clear
            </button>
          )}
        </div>
      )}
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
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-slate-100" onClick={() => onSort && onSort(col.name)}>
                        <span>{col.name}</span>
                        {sortBy === col.name ? (
                          <span className="text-[10px]">{sortOrder === "asc" ? "↑" : "↓"}</span>
                        ) : (
                          <span className="text-[10px] text-slate-500">↕</span>
                        )}
                      </button>
                      <button
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase"
                        onClick={() => onFilterChange && onFilterChange(col.name, filterValue)}
                      >
                        🔍
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800/60 last:border-0 hover:bg-white/5">
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
      {onPageChange && (
        <div className="flex items-center justify-center gap-4 mt-3 text-sm text-slate-200">
          <button
            className="px-3 py-1 rounded border border-slate-700 disabled:opacity-50"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            Previous
          </button>
          <div>
            Page {page} / {totalPages}
          </div>
          <button
            className="px-3 py-1 rounded border border-slate-700 disabled:opacity-50"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function renderValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}
