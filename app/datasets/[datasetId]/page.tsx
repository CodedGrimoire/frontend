"use client";

import { useEffect, useState } from "react";
import AnswerCard from "../../../components/AnswerCard";
import ResultTable from "../../../components/ResultTable";
import SQLViewer from "../../../components/SQLViewer";
import ChatPanel from "../../../components/ChatPanel";
import PreviewTable from "../../../components/PreviewTable";
import ChartRenderer from "../../../components/ChartRenderer";

type Column = { name: string; type: string };
type QueryResult = {
  type: string;
  sql: string;
  rows: Array<Record<string, unknown>>;
  columns: Column[];
  row_count: number;
  answer?: string | null;
};

type Preview = {
  columns: Column[];
  rows: Array<Record<string, unknown>>;
  total_rows?: number;
  page?: number;
  limit?: number;
};

type Suggestions = {
  suggestions: string[];
};

const API_HOST = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8100").replace(/\/$/, "");
const DATASETS_BASE = `${API_HOST}/api/v1/datasets`;

export default function DatasetPage({ params }: { params: { datasetId: string } }) {
  const datasetId = params.datasetId;

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [preview, setPreview] = useState<Preview>({ columns: [], rows: [] });
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewLimit] = useState(50);
  const [previewTotalRows, setPreviewTotalRows] = useState(0);
  const [previewSortBy, setPreviewSortBy] = useState<string | null>(null);
  const [previewSortOrder, setPreviewSortOrder] = useState<"asc" | "desc">("asc");
  const [previewFilterColumn, setPreviewFilterColumn] = useState<string | null>(null);
  const [previewFilterValue, setPreviewFilterValue] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Hi, I'm DataPilot. Ask me questions about your dataset and I'll generate SQL and insights for you.",
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userTyped, setUserTyped] = useState(false);

  // load dataset preview once (and when controls change)
  useEffect(() => {
    let mounted = true;
    const loadPreview = async () => {
      if (!datasetId) return;
      try {
        const params = new URLSearchParams({
          page: String(previewPage),
          limit: String(previewLimit),
        });
        if (previewSortBy) {
          params.append("sort_by", previewSortBy);
          params.append("sort_order", previewSortOrder);
        }
        if (previewFilterColumn && previewFilterValue) {
          params.append("filter_column", previewFilterColumn);
          params.append("filter_value", previewFilterValue);
        }
        const res = await fetch(`${DATASETS_BASE}/${datasetId}/rows?${params.toString()}`);
        if (!res.ok) throw new Error(`Preview failed (${res.status})`);
        const data = (await res.json()) as Preview;
        if (mounted) {
          setPreview({ columns: (data as any).columns || [], rows: data.rows || [] });
          setPreviewTotalRows((data as any).total_rows || 0);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setPreviewError((err as Error).message || "Failed to load preview");
      } finally {
        if (mounted) setPreviewLoading(false);
      }
    };
    loadPreview();
    const loadSuggestions = async () => {
      if (!datasetId) return;
      try {
        const res = await fetch(`${DATASETS_BASE}/${datasetId}/suggestions`);
        if (!res.ok) throw new Error(`Suggestions failed (${res.status})`);
        const data = (await res.json()) as Suggestions;
        if (mounted) setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadSuggestions();
    return () => {
      mounted = false;
    };
  }, [datasetId, previewPage, previewLimit, previewSortBy, previewSortOrder, previewFilterColumn, previewFilterValue]);

  const runQuery = async (prompt?: string) => {
    if (!datasetId) return;
    const ask = (prompt ?? question).trim();
    if (!ask) return;
    const userMessage = ask;
    setLoading(true);
    setError(null);
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setQuestion(""); // clear input immediately
    try {
      const res = await fetch(`${DATASETS_BASE}/${datasetId}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail || `Request failed (${res.status})`);
      }
      const data = (await res.json()) as QueryResult;
      setResult(data);
      setChatHistory((prev) => [...prev, { role: "assistant", text: data.answer || "Query ran successfully." }]);
    } catch (err: any) {
      setResult(null);
      setError(err.message || "Something went wrong");
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", text: `Error: ${err.message || "Something went wrong"}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-surface text-slate-100">
      <div className="h-full flex">
        {/* Left: Chat */}
        <section className="w-[20%] min-w-[260px] border-r border-slate-800 p-4 pt-10 flex flex-col">
          <ChatPanel
            messages={chatHistory}
            input={question}
            onChange={(val) => {
              setQuestion(val);
              setUserTyped(val.trim().length > 0);
            }}
            onSubmit={() => runQuery()}
            loading={loading}
            suggestions={suggestions.slice(0, 4)}
            showSuggestions={!userTyped}
            onSelectSuggestion={(text) => runQuery(text)}
          />
        </section>

        {/* Middle: Results */}
        <section className="flex-1 border-r border-slate-800 p-4 pt-8 overflow-y-auto">
          <div className="results-content">
            {error && (
              <div className="glass-card p-3 border border-rose-500/40 text-rose-100 text-sm">{error}</div>
            )}
            {result ? (
              <>
                <AnswerCard answer={result.answer} type={result.type} />
                <div className="result-table">
                  <ResultTable columns={result.columns || []} rows={result.rows || []} loading={loading} />
                </div>
                <ChartRenderer columns={result.columns || []} rows={result.rows || []} />
                <div className="generated-sql">
                  <SQLViewer sql={result.sql} />
                </div>
              </>
            ) : (
              <div className="glass-card p-4 text-slate-400 text-sm">Ask DataPilot a question to explore your dataset.</div>
            )}
          </div>
        </section>

        {/* Right: Spreadsheet */}
        <section className="w-[45%] min-w-[420px] p-4 pt-8 overflow-x-auto">
          {previewError ? (
            <div className="glass-card p-4 border border-rose-500/40 text-rose-100 text-sm">{previewError}</div>
          ) : (
            <PreviewTable
              columns={preview.columns}
              rows={preview.rows}
              loading={previewLoading}
              page={previewPage}
              limit={previewLimit}
              totalRows={previewTotalRows}
              sortBy={previewSortBy}
              sortOrder={previewSortOrder}
              onSort={(col) => {
                setPreviewSortBy(col);
                setPreviewSortOrder((prev) => (previewSortBy === col && prev === "asc" ? "desc" : "asc"));
                setPreviewPage(1);
              }}
              filterColumn={previewFilterColumn}
              filterValue={previewFilterValue}
              onFilterChange={(col, val) => {
                setPreviewFilterColumn(col || null);
                setPreviewFilterValue(val);
                setPreviewPage(1);
              }}
              onClearFilter={() => {
                setPreviewFilterColumn(null);
                setPreviewFilterValue("");
                setPreviewPage(1);
              }}
              onPageChange={(p) => {
                setPreviewLoading(true);
                setPreviewPage(p);
              }}
            />
          )}
        </section>
      </div>
    </main>
  );
}
