"use client";
import { useCallback, useEffect, useState } from "react";
import { api, download } from "@/lib/api";
import { PageLoader, ErrorBox, StatusBadge, EmptyState, Spinner } from "@/components/ui";
import { useToast } from "@/components/Toast";

type Reg = {
  id: string; registration_number: string; full_name: string; email: string; phone: string; college: string; course: string;
  study_year: number; city: string; state: string; github_url: string; linkedin_url: string | null; skills: string[];
  participation_type: string; team_name: string | null; team_size: number; project_idea: string | null; status: string;
  admin_notes: string | null; created_at: string;
};
type List = { items: Reg[]; total: number; page: number; page_size: number };

export default function Registrations() {
  const toast = useToast();
  const [data, setData] = useState<List | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState({ search: "", status: "", course: "", college: "", participation_type: "", sort: "created_at", order: "desc", page: 1 });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Reg | null>(null);

  const qs = useCallback((extra: Record<string, string> = {}) => {
    const p = new URLSearchParams();
    Object.entries({ ...q, ...extra }).forEach(([k, v]) => { if (v !== "" && v !== undefined) p.set(k, String(v)); });
    return p.toString();
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setData(await api<List>(`/api/admin/registrations?${qs({ page_size: "15" })}`)); }
    catch (e) { setError((e as Error).message); }
    setLoading(false);
  }, [qs]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setTimeout(() => setQ((p) => ({ ...p, search, page: 1 })), 350); return () => clearTimeout(t); }, [search]);

  const setFilter = (k: string, v: string) => setQ((p) => ({ ...p, [k]: v, page: 1 }));
  const toggleSort = (col: string) => setQ((p) => ({ ...p, sort: col, order: p.sort === col && p.order === "asc" ? "desc" : "asc", page: 1 }));

  async function exportCsv() {
    try {
      const { page, sort, order, ...filters } = q; void page; void sort; void order;
      const p = new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string, string][]);
      await download(`/api/admin/registrations/export.csv?${p}`, "pocketthon-registrations.csv");
      toast("CSV downloaded.", "success");
    } catch (e) { toast((e as Error).message, "error"); }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;
  const arrow = (c: string) => (q.sort === c ? (q.order === "asc" ? " ▲" : " ▼") : "");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-3xl font-extrabold tracking-tight">Registrations</h1><p className="text-neutral-600">{data ? `${data.total} matching` : "…"}</p></div>
        <button onClick={exportCsv} className="btn btn-dark">Export CSV</button>
      </div>

      <div className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input aria-label="Search" className="input lg:col-span-2" placeholder="Search name, email, ID or college" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select aria-label="Status" className="input" value={q.status} onChange={(e) => setFilter("status", e.target.value)}>
          <option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
        </select>
        <select aria-label="Participation type" className="input" value={q.participation_type} onChange={(e) => setFilter("participation_type", e.target.value)}>
          <option value="">Individual & team</option><option value="individual">Individual</option><option value="team">Team</option>
        </select>
        <input aria-label="Course" className="input" placeholder="Course" value={q.course} onChange={(e) => setFilter("course", e.target.value)} />
        <input aria-label="College" className="input lg:col-span-2" placeholder="College" value={q.college} onChange={(e) => setFilter("college", e.target.value)} />
      </div>

      {error && <ErrorBox message={error} />}
      {loading && !data ? <PageLoader /> : data && data.items.length === 0 ? (
        <EmptyState title="No registrations match" body="Try clearing some filters." />
      ) : data && (
        <div className={`card overflow-x-auto ${loading ? "opacity-60" : ""}`}>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("registration_number")}>ID{arrow("registration_number")}</th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("full_name")}>Name{arrow("full_name")}</th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("college")}>College{arrow("college")}</th>
                <th className="px-4 py-3">Type</th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("status")}>Status{arrow("status")}</th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("created_at")}>Date{arrow("created_at")}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((r) => (
                <tr key={r.id} onClick={() => setSelected(r)} className="cursor-pointer border-b border-neutral-100 hover:bg-brand-50">
                  <td className="px-4 py-3 font-mono text-xs">{r.registration_number}</td>
                  <td className="px-4 py-3"><div className="font-semibold">{r.full_name}</div><div className="text-xs text-neutral-500">{r.email}</div></td>
                  <td className="px-4 py-3">{r.college}</td>
                  <td className="px-4 py-3 capitalize">{r.participation_type}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-neutral-500">{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.total > 0 && (
        <div className="flex items-center justify-between text-sm">
          <button disabled={q.page <= 1} onClick={() => setQ((p) => ({ ...p, page: p.page - 1 }))} className="btn btn-ghost py-1.5">Previous</button>
          <span>Page {q.page} of {totalPages}</span>
          <button disabled={q.page >= totalPages} onClick={() => setQ((p) => ({ ...p, page: p.page + 1 }))} className="btn btn-ghost py-1.5">Next</button>
        </div>
      )}

      {selected && <Detail reg={selected} onClose={() => setSelected(null)} onChanged={(r) => { setSelected(r); load(); }} onDeleted={() => { setSelected(null); load(); }} />}
    </div>
  );
}

function Detail({ reg, onClose, onChanged, onDeleted }: { reg: Reg; onClose: () => void; onChanged: (r: Reg) => void; onDeleted: () => void }) {
  const toast = useToast();
  const [notes, setNotes] = useState(reg.admin_notes ?? "");
  const [busy, setBusy] = useState("");

  async function act(label: string, fn: () => Promise<unknown>, ok: string) {
    if (busy) return;
    setBusy(label);
    try { await fn(); toast(ok, "success"); } catch (e) { toast((e as Error).message, "error"); }
    setBusy("");
  }

  const setStatus = (status: string) =>
    act(status, async () => onChanged(await api<Reg>(`/api/admin/registrations/${reg.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) })), `Marked ${status}.`);

  const rows: [string, React.ReactNode][] = [
    ["Registration ID", reg.registration_number], ["Email", reg.email], ["Phone", reg.phone], ["College", reg.college],
    ["Course", `${reg.course} · Year ${reg.study_year}`], ["Location", `${reg.city}, ${reg.state}`],
    ["GitHub", <a key="g" className="underline" href={reg.github_url} target="_blank" rel="noopener noreferrer">{reg.github_url}</a>],
    ["LinkedIn", reg.linkedin_url ? <a key="l" className="underline" href={reg.linkedin_url} target="_blank" rel="noopener noreferrer">{reg.linkedin_url}</a> : "—"],
    ["Skills", reg.skills.join(", ")], ["Participation", `${reg.participation_type}${reg.team_name ? ` — ${reg.team_name} (${reg.team_size})` : ""}`],
    ["Project idea", reg.project_idea || "—"], ["Registered", new Date(reg.created_at).toLocaleString("en-IN")],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose} role="dialog" aria-modal="true" aria-label="Registration details">
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="text-2xl font-extrabold">{reg.full_name}</h2><div className="mt-1"><StatusBadge status={reg.status} /></div></div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-mist">✕</button>
        </div>
        <dl className="mt-5 divide-y divide-neutral-100 text-sm">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2"><dt className="text-neutral-500">{k}</dt><dd className="break-words text-right font-medium">{v}</dd></div>)}
        </dl>

        <div className="mt-6 flex gap-2">
          <button disabled={!!busy || reg.status === "approved"} onClick={() => setStatus("approved")} className="btn btn-primary flex-1">{busy === "approved" && <Spinner className="h-4 w-4" />} Approve</button>
          <button disabled={!!busy || reg.status === "rejected"} onClick={() => setStatus("rejected")} className="btn btn-dark flex-1">{busy === "rejected" && <Spinner className="h-4 w-4" />} Reject</button>
          <button disabled={!!busy || reg.status === "pending"} onClick={() => setStatus("pending")} className="btn btn-ghost">Reset</button>
        </div>

        <div className="mt-6">
          <label htmlFor="notes" className="label">Internal admin notes</label>
          <textarea id="notes" rows={4} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button disabled={!!busy || notes === (reg.admin_notes ?? "")} className="btn btn-ghost mt-2"
            onClick={() => act("notes", async () => onChanged(await api<Reg>(`/api/admin/registrations/${reg.id}/notes`, { method: "PATCH", body: JSON.stringify({ admin_notes: notes }) })), "Notes saved.")}>
            Save notes
          </button>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-5">
          <button disabled={!!busy} className="btn btn-danger"
            onClick={() => { if (confirm(`Permanently delete ${reg.full_name}'s registration (${reg.registration_number})? This cannot be undone.`)) act("delete", async () => { await api(`/api/admin/registrations/${reg.id}?confirm=true`, { method: "DELETE" }); onDeleted(); }, "Registration deleted."); }}>
            Delete registration
          </button>
        </div>
      </div>
    </div>
  );
}
