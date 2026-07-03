"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DatasetItem = { id: string; name: string; status: string };

const API_HOST = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const DATASETS_BASE = `${API_HOST}/api/v1/datasets`;

export default function Home() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const username = "User"; // placeholder; plug in auth user when available
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // reset file input after use

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(DATASETS_BASE);
        if (!res.ok) throw new Error(`Failed to load datasets (${res.status})`);
        const data = (await res.json()) as DatasetItem[];
        setDatasets(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this dataset? This cannot be undone.");
    if (!confirmDelete) return;
    const doubleCheck = window.confirm("Are you absolutely sure? All data for this dataset will be removed.");
    if (!doubleCheck) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`${DATASETS_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setDatasets((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-surface text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 relative">
        <div className="surface-panel soft-grid px-6 py-5 md:px-8 md:py-6 mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="section-label mb-2">DataPivot AI</div>
            <div className="text-2xl md:text-3xl font-semibold text-slate-50">Spreadsheet to SQL instantly.</div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm text-slate-300">
            <span className="pill-button px-4 py-2 rounded-full">Dashboard</span>
            <span className="pill-button px-4 py-2 rounded-full">Workspaces</span>
            <span className="pill-button px-4 py-2 rounded-full">Data Sources</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
          <section className="surface-panel hero-glow p-8 md:p-10">
            <div className="section-label mb-3">AI-Powered Data Transformation</div>
            <div className="max-w-2xl text-4xl md:text-5xl font-semibold tracking-tight text-slate-50 leading-tight">
              Build a professional AI query workspace without changing your current pipeline.
            </div>
            <p className="mt-5 max-w-2xl text-slate-300 text-base leading-7">
              Pick a dataset to open your DataPilot workspace. Your existing natural-language query flow, SQL generation,
              result rendering, charting, and dataset preview stay intact. This update only adds the product-style shell
              and the darker indigo palette from your reference.
            </p>
            {uploading && <div className="mt-4 text-slate-300 text-sm">Uploading and converting to SQL…</div>}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="primary-button px-5 py-3 rounded-xl font-semibold disabled:opacity-60"
                disabled={uploading}
                onClick={() => document.getElementById("file-upload-input")?.click()}
              >
                {uploading ? "Processing…" : "Start Transforming"}
              </button>
              <button className="secondary-button px-5 py-3 rounded-xl font-medium" onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}>
                View Workspace Modules
              </button>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["Natural Language Queries", "Convert plain-English questions into optimized SQL against uploaded spreadsheets."],
                ["Automatic Inference", "Detect schema patterns and prepare structures for analysis without losing your current flow."],
                ["Instant API Generation", "Turn transformed data into a ready-to-use analytics workspace and service layer."]
              ].map(([title, text]) => (
                <div key={title} className="glass-card p-4">
                  <div className="text-sm font-semibold text-slate-100">{title}</div>
                  <div className="mt-2 text-sm text-slate-400 leading-6">{text}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="surface-panel p-6">
              <div className="section-label mb-2">Welcome Back</div>
              <div className="text-2xl font-semibold text-slate-50">{username}</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                This area now mirrors the reference direction: upload, workspace, and dashboard framing around the existing app behavior.
              </p>
            </div>

            <div className="surface-panel p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="section-label mb-2">Data Upload</div>
                  <div className="text-xl font-semibold text-slate-100">Your datasets</div>
                </div>
                <div className="text-xs text-slate-400">{datasets.length} source{datasets.length === 1 ? "" : "s"}</div>
              </div>
              <div className="flex items-center gap-3 mb-4">
            <button
              className="primary-button px-4 py-2.5 rounded-xl font-semibold disabled:opacity-60"
              disabled={uploading}
              onClick={() => document.getElementById("file-upload-input")?.click()}
            >
              {uploading ? "Processing…" : "+ Add New"}
            </button>
            <input
              id="file-upload-input"
              key={fileInputKey}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setError(null);
                try {
                  const form = new FormData();
                  form.append("file", file);
                  const res = await fetch(`${DATASETS_BASE}/upload`, {
                    method: "POST",
                    body: form,
                  });
                  if (!res.ok) {
                    const detail = await res.json().catch(() => ({}));
                    throw new Error(detail.detail || `Upload failed (${res.status})`);
                  }
                  const data = await res.json();
                  const newId = data.dataset_id;
                  router.push(`/datasets/${newId}`);
                } catch (err) {
                  setError((err as Error).message);
                } finally {
                  setUploading(false);
                  setFileInputKey(Date.now());
                }
              }}
            />
          </div>
          {error && <div className="glass-card p-3 border border-rose-500/40 text-rose-100 text-sm">{error}</div>}
          {loading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-4 border border-white/10 animate-pulse">
                  <div className="h-4 w-32 bg-white/10 rounded mb-2" />
                  <div className="h-3 w-20 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : datasets.length === 0 ? (
            <div className="glass-card p-4 text-slate-300">No datasets yet.</div>
          ) : (
            <div className="grid gap-3">
              {datasets.map((d) => (
                <div
                  key={d.id}
                  className="glass-card p-4 border border-white/10 hover:border-accent/50 transition cursor-pointer"
                  onClick={() => router.push(`/datasets/${d.id}`)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-slate-50 truncate">{d.name}</div>
                      <div className="text-xs text-slate-400">Status: {d.status}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-xs px-3 py-1 rounded-md bg-rose-500/80 hover:bg-rose-500 text-slate-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(d.id);
                        }}
                        disabled={deletingId === d.id}
                      >
                        {deletingId === d.id ? "Deleting..." : "Delete"}
                      </button>
                      <div className="text-sm text-accentSoft">Open →</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
            </div>
          </section>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="surface-panel p-6">
            <div className="section-label mb-3">AI Query Workspace</div>
            <div className="text-xl font-semibold text-slate-50">Natural language to SQL</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              The current chat-driven query workflow stays in place. The styling now aligns with a darker enterprise analytics shell.
            </p>
          </div>
          <div className="surface-panel p-6">
            <div className="section-label mb-3">System Dashboard</div>
            <div className="text-xl font-semibold text-slate-50">Performance overview</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Adds the dashboard framing shown in the reference, while your backend query and preview features remain untouched.
            </p>
          </div>
          <div className="surface-panel p-6">
            <div className="section-label mb-3">Data Sources & Upload</div>
            <div className="text-xl font-semibold text-slate-50">Spreadsheet intake</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              CSV and Excel upload behavior is unchanged; only the visual treatment and page composition have been expanded.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
