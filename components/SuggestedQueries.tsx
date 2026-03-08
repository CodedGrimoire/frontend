"use client";

type Props = {
  onSelect: (text: string) => void;
  suggestions?: string[];
};

const fallbackSuggestions = [
  "Total revenue by month",
  "Average profit",
  "Month with highest customers",
  "Total expenses",
  "Highest revenue month",
];

export default function SuggestedQueries({ onSelect, suggestions }: Props) {
  const list = (suggestions && suggestions.length > 0 ? suggestions : fallbackSuggestions).slice(0, 4);
  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-300">Try asking DataPilot:</div>
      <div className="flex flex-wrap gap-2">
        {list.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-100 hover:bg-cyan-500/20 transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
