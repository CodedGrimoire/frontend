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
  const list = (suggestions && suggestions.length > 0 ? suggestions : fallbackSuggestions).slice(0, 3);
  return (
    <div className="suggestions-container space-y-2 w-full">
      <div className="text-sm text-slate-300">Try asking DataPilot:</div>
      <div className="flex flex-col gap-2 w-full">
        {list.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="suggestion-pill bg-white/5 border border-white/10 text-sm text-slate-100 hover:bg-cyan-500/20 transition text-left"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
