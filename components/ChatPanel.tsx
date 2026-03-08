"use client";

import { useEffect, useRef } from "react";

type Message = { role: "user" | "assistant"; text: string };

type Props = {
  messages: Message[];
  input: string;
  loading: boolean;
  onChange: (v: string) => void;
  onSubmit: () => void;
  suggestions?: string[];
  showSuggestions?: boolean;
  onSelectSuggestion?: (text: string) => void;
};

export default function ChatPanel({
  messages,
  input,
  onChange,
  onSubmit,
  loading,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
}: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-0 pb-3">
        <h1 className="text-lg font-semibold text-cyan-400">DataPilot</h1>
        <p className="text-xs text-slate-400">Your AI Data Assistant</p>
      </div>
      <div className="text-sm text-slate-300 mb-3 leading-relaxed">
        Hi, I'm DataPilot. Ask questions about your dataset and I’ll generate SQL and insights.
      </div>
      <div className="glass-card flex-1 overflow-y-auto p-4">
        {messages.length === 0 && <div className="text-slate-500 text-sm">Ask DataPilot about your data.</div>}
        <div className="flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-3`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                DP
              </div>
            )}
            <div
              className={`max-w-[85%] px-3 py-2.5 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-slate-700 text-right text-slate-100 self-end"
                  : "bg-slate-800 text-left text-slate-100 self-start"
              }`}
            >
              <div
                className={`text-[11px] uppercase tracking-[0.1em] mb-1 font-semibold ${
                  msg.role === "user" ? "text-slate-400" : "text-cyan-300"
                }`}
              >
                {msg.role === "user" ? "YOU" : "DataPilot"}
              </div>
              <div
                className={`whitespace-pre-wrap leading-[1.4] ${
                  msg.role === "user" ? "font-medium" : "font-normal"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        </div>
        <div ref={endRef} />
      </div>
      {showSuggestions && onSelectSuggestion && (
        <div className="mt-3">
          <div className="text-sm text-slate-300 mb-2">Try asking:</div>
          <div className="flex flex-wrap gap-2">
            {(suggestions || []).slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => onSelectSuggestion(s)}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-100 hover:bg-cyan-500/20 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-3 sticky bottom-0 bg-surface pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) onSubmit();
          }}
          className="flex items-center gap-2 w-full"
        >
          <input
            className="flex-1 min-w-0 px-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-slate-500"
            placeholder="Ask DataPilot about your data..."
            value={input}
            onChange={(e) => onChange(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="ask-button px-4 py-3 rounded-xl bg-accent text-slate-900 font-semibold shadow-card disabled:opacity-60 disabled:cursor-not-allowed transition whitespace-nowrap"
            style={{ width: "100px", minWidth: "90px", flexShrink: 0 }}
          >
            {loading ? "Asking…" : "Ask"}
          </button>
        </form>
      </div>
    </div>
  );
}
