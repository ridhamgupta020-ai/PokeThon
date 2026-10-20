"use client";
import Link from "next/link";
import type { ReactNode } from "react";

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-3 text-neutral-600" role="status">
      <Spinner className="h-6 w-6 text-brand-500" /> {label}
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`} aria-label="Pocket Thon home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-400 text-ink shadow-glow">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" width="18" height="18" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>
      </span>
      <span>Pocket<span className="text-brand-500">Thon</span></span>
    </Link>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    draft: "bg-neutral-100 text-neutral-700",
    submitted: "bg-blue-100 text-blue-800",
    under_review: "bg-purple-100 text-purple-800",
    accepted: "bg-green-100 text-green-800",
  };
  return <span className={`badge ${map[status] ?? "bg-neutral-100 text-neutral-700"}`}>{status.replace("_", " ")}</span>;
}

export function Field({
  label, error, hint, children, htmlFor,
}: { label: string; error?: string; hint?: string; children: ReactNode; htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      {error && <p id={`${htmlFor}-err`} role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-mist/60 px-6 py-10 text-center">
      <p className="font-semibold">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-md text-sm text-neutral-600">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{message}</div>;
}
