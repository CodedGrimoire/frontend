export type AuthSession = {
  idToken: string;
  refreshToken: string;
  email: string | null;
  uid: string;
  expiresAt: number;
};

type FirebaseAuthResponse = {
  idToken: string;
  refreshToken: string;
  email?: string;
  localId: string;
  expiresIn: string;
};

const STORAGE_KEY = "ss.auth.session";

function getApiKey() {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
}

function getRefreshApiKey() {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
}

function buildSession(payload: FirebaseAuthResponse): AuthSession {
  return {
    idToken: payload.idToken,
    refreshToken: payload.refreshToken,
    email: payload.email || null,
    uid: payload.localId,
    expiresAt: Date.now() + Number(payload.expiresIn || "3600") * 1000,
  };
}

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getStoredSession(): AuthSession | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setStoredSession(session: AuthSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

async function authRequest(path: string, body: Record<string, unknown>) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
  }

  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/${path}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || "Authentication failed");
  }

  const session = buildSession(data as FirebaseAuthResponse);
  setStoredSession(session);
  return session;
}

export async function signInWithEmailPassword(email: string, password: string) {
  return authRequest("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });
}

export async function signUpWithEmailPassword(email: string, password: string) {
  return authRequest("accounts:signUp", {
    email,
    password,
    returnSecureToken: true,
  });
}

export async function refreshSession(refreshToken: string) {
  const current = getStoredSession();
  const apiKey = getRefreshApiKey();
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
  }

  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    clearStoredSession();
    throw new Error(data?.error?.message || "Session refresh failed");
  }

  const session: AuthSession = {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    email: current?.email || null,
    uid: data.user_id,
    expiresAt: Date.now() + Number(data.expires_in || "3600") * 1000,
  };
  setStoredSession(session);
  return session;
}

export async function getValidSession() {
  const session = getStoredSession();
  if (!session) return null;
  if (session.expiresAt - Date.now() > 60_000) return session;
  return refreshSession(session.refreshToken);
}

export function getDisplayName(session: AuthSession | null) {
  if (!session?.email) return "User";
  return session.email.split("@")[0];
}
