import { clearStoredSession, getValidSession } from "./auth";

const API_HOST = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export async function apiFetch(path: string, init: RequestInit = {}, requireAuth = true) {
  const headers = new Headers(init.headers || {});

  if (requireAuth) {
    const session = await getValidSession();
    if (!session) {
      throw new Error("AUTH_REQUIRED");
    }
    headers.set("Authorization", `Bearer ${session.idToken}`);
  }

  const res = await fetch(`${API_HOST}${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    clearStoredSession();
    throw new Error("AUTH_REQUIRED");
  }

  return res;
}
