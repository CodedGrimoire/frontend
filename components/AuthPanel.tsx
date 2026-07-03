"use client";

import { FormEvent, useState } from "react";
import { signInWithEmailPassword, signUpWithEmailPassword, type AuthSession } from "../lib/auth";

type Props = {
  onAuthenticated: (session: AuthSession) => void;
};

export default function AuthPanel({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const session =
        mode === "signin"
          ? await signInWithEmailPassword(email.trim(), password)
          : await signUpWithEmailPassword(email.trim(), password);
      onAuthenticated(session);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-panel p-8 md:p-10 max-w-md w-full">
      <div className="section-label mb-3">Authentication</div>
      <div className="text-3xl font-semibold text-slate-50">
        {mode === "signin" ? "Sign in to DataPilot" : "Create your account"}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">
        This app now uses Firebase bearer-token auth for dataset access and queries.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-line text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input
          className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-line text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        {error && <div className="glass-card p-3 border border-rose-500/40 text-rose-100 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="primary-button w-full px-4 py-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {loading ? "Working..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setMode((prev) => (prev === "signin" ? "signup" : "signin"))}
        className="mt-4 text-sm text-accentSoft hover:text-slate-50 transition"
      >
        {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
