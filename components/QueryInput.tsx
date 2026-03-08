"use client";

import { FormEvent } from "react";

type Props = {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export default function QueryInput({ value, onChange, onSubmit, loading }: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loading) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-3">
      <input
        className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-slate-500"
        placeholder='Ask a question, e.g. "What is the average revenue?"'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-4 py-3 rounded-xl bg-accent text-slate-900 font-semibold shadow-card disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Running..." : "Ask"}
      </button>
    </form>
  );
}
