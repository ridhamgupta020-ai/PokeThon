import { createClient } from "@/lib/supabase/client";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;
  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function parse(res: Response) {
  if (res.status === 204) return null;
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }
  if (!res.ok) {
    const detail = typeof body?.detail === "string" ? body.detail : "Something went wrong";
    throw new ApiError(res.status, detail, body?.fields ?? {});
  }
  return body;
}

/** Authenticated call from the browser. The token comes from the Supabase session. */
export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const { data } = await createClient().auth.getSession();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (data.session) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Check your connection and try again.");
  }
  return parse(res) as Promise<T>;
}

/** Download an authenticated file (e.g. CSV export). */
export async function download(path: string, filename: string) {
  const { data } = await createClient().auth.getSession();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${data.session?.access_token ?? ""}` },
  });
  if (!res.ok) throw new ApiError(res.status, "Download failed");
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/** Public, unauthenticated fetch usable from Server Components. */
export async function publicGet<T>(path: string, revalidate = 30): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export type EventContent = {
  themes?: { title: string; description: string }[];
  schedule?: { time: string; title: string; description?: string }[];
  prizes?: { place: string; title?: string; amount?: string; description?: string }[];
  sponsors?: { name: string; url?: string }[];
  faq?: { q: string; a: string }[];
  contact?: { email?: string; phone?: string; address?: string };
  social?: Record<string, string>;
};

export type EventSettings = {
  id?: string;
  event_name: string;
  event_date: string | null;
  registration_deadline: string | null;
  registration_open: boolean;
  description: string;
  content: EventContent;
};
