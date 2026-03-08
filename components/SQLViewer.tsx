type Props = {
  sql?: string;
};

export default function SQLViewer({ sql }: Props) {
  if (!sql) return null;
  return (
    <details className="glass-card p-4">
      <summary className="cursor-pointer text-sm text-slate-200">Generated SQL</summary>
      <pre className="mt-3 whitespace-pre-wrap text-xs bg-slate-900/70 p-3 rounded-lg border border-slate-800 text-slate-100">
        {sql}
      </pre>
    </details>
  );
}
