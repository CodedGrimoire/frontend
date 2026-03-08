"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DatasetItem = { id: string; name: string; status: string };

const API_HOST = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8100").replace(/\/$/, "");
const DATASETS_BASE = `${API_HOST}/api/v1/datasets`;

export default function Home() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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

  return (
    <main className="min-h-screen bg-surface text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 space-y-4">
          <div className="text-sm uppercase tracking-[0.2em] text-accent">Welcome back</div>
          <div className="text-3xl font-semibold text-slate-50">{username}</div>
          <p className="text-slate-400">
            Pick a dataset to open your DataPilot workspace. You can chat with your data, view answers, and preview the
            full table with sorting, filtering, and pagination.
          </p>
          {uploading && (
            <div className="text-slate-300 text-sm">Uploading and converting to SQL…</div>
          )}
        </div>

        <div className="md:w-1/2 space-y-4">
          <div className="text-lg font-semibold text-slate-100">Your datasets</div>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-2 rounded-lg bg-accent text-slate-900 font-semibold shadow-card hover:brightness-95 disabled:opacity-60"
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
                <Link key={d.id} href={`/datasets/${d.id}`}>
                  <div className="glass-card p-4 border border-white/10 hover:border-cyan-400/60 transition cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-semibold text-slate-50">{d.name}</div>
                        <div className="text-xs text-slate-400">Status: {d.status}</div>
                      </div>
                      <div className="text-sm text-cyan-300">Open →</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
