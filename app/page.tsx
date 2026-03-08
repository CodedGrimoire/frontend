"use client";

import { useState } from "react";
import QueryInput from "../components/QueryInput";
import AnswerCard from "../components/AnswerCard";
import ResultTable from "../components/ResultTable";
import SQLViewer from "../components/SQLViewer";

type Column = { name: string; type: string };
type QueryResult = {
  type: string;
  sql: string;
  rows: Array<Record<string, unknown>>;
  columns: Column[];
  row_count: number;
  answer?: string | null;
};

const DATASET_ID = "9a087fbe-52f6-4644-92fc-d0353d064681";
const API_URL = `http://localhost:8100/api/v1/datasets/${DATASET_ID}/query`;

export default function Page() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);

  const runQuery = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail || `Request failed (${res.status})`);
      }
      const data = (await res.json()) as QueryResult;
      setResult(data);
    } catch (err: any) {
      setResult(null);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">NL → SQL</span>
        <h1 className="text-3xl font-semibold text-slate-50">Ask your data anything</h1>
        <p className="text-slate-400 text-sm">Powered by the backend at {API_URL}</p>
      </header>

      <QueryInput value={question} onChange={setQuestion} onSubmit={runQuery} loading={loading} />

      {error && (
        <div className="glass-card p-4 border border-rose-500/40 text-rose-100 text-sm">
          {error}
        </div>
      )}

      <AnswerCard answer={result?.answer} type={result?.type} />

      <ResultTable columns={result?.columns || []} rows={result?.rows || []} loading={loading} />

      <SQLViewer sql={result?.sql} />
    </main>
  );
}
