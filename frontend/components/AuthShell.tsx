import type { ReactNode } from "react";
import { Logo } from "@/components/ui";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-b from-white to-mist px-5 py-10">
      <div aria-hidden className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-300/40 blur-3xl" />
      <div aria-hidden className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-brand-200/60 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo className="text-xl" /></div>
        <div className="card p-7 sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}

export function safeNext(next: string | null, fallback = "/dashboard") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
