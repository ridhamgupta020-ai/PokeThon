"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageLoader, ErrorBox } from "@/components/ui";

type Stats = {
  total_registrations: number; verified_participants: number; pending: number; approved: number;
  rejected: number; total_teams: number; project_submissions: number;
};

export default function Overview() {
  const [s, setS] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api<Stats>("/api/admin/stats").then(setS).catch((e) => setError(e.message)); }, []);

  if (error) return <ErrorBox message={error} />;
  if (!s) return <PageLoader />;

  const cards: [string, number, string][] = [
    ["Total registrations", s.total_registrations, "bg-brand-100"],
    ["Verified participants", s.verified_participants, "bg-white"],
    ["Pending", s.pending, "bg-amber-50"],
    ["Approved", s.approved, "bg-green-50"],
    ["Rejected", s.rejected, "bg-red-50"],
    ["Teams", s.total_teams, "bg-white"],
    ["Project submissions", s.project_submissions, "bg-white"],
  ];
  const total = Math.max(1, s.total_registrations);
  const bar = (n: number, color: string) => (
    <div className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-200"><div className={`h-full ${color}`} style={{ width: `${(n / total) * 100}%` }} /></div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
        <p className="text-neutral-600">Live numbers from the database.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, bg]) => (
          <div key={label} className={`card p-5 ${bg}`}>
            <p className="text-sm text-neutral-600">{label}</p>
            <p className="mt-1 text-4xl font-extrabold tabular-nums">{value < 0 ? "n/a" : value}</p>
          </div>
        ))}
      </div>
      <section className="card p-6">
        <h2 className="mb-4 text-lg font-bold">Registration pipeline</h2>
        <div className="space-y-3 text-sm">
          {([["Pending", s.pending, "bg-amber-400"], ["Approved", s.approved, "bg-green-500"], ["Rejected", s.rejected, "bg-red-500"]] as const).map(([l, n, c]) => (
            <div key={l} className="flex items-center gap-3"><span className="w-20 font-medium">{l}</span>{bar(n, c)}<span className="w-10 text-right tabular-nums">{n}</span></div>
          ))}
        </div>
      </section>
    </div>
  );
}
