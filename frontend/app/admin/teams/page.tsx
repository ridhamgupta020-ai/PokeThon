"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageLoader, ErrorBox, StatusBadge, EmptyState } from "@/components/ui";
import { useToast } from "@/components/Toast";

type Team = { id: string; team_name: string; team_code: string; member_count: number; created_at: string };
type Project = {
  id: string; title: string; description: string; repository_url: string | null; demo_url: string | null;
  submission_status: string; submitted_at: string | null; teams: { team_name: string; team_code: string } | null;
};

export default function TeamsPage() {
  const toast = useToast();
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [t, p] = await Promise.all([api<Team[]>("/api/admin/teams"), api<Project[]>("/api/admin/projects")]);
      setTeams(t); setProjects(p);
    } catch (e) { setError((e as Error).message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, submission_status: string) {
    try {
      await api(`/api/admin/projects/${id}/status`, { method: "PATCH", body: JSON.stringify({ submission_status }) });
      toast("Project status updated.", "success"); load();
    } catch (e) { toast((e as Error).message, "error"); }
  }

  async function removeTeam(t: Team) {
    if (!confirm(`Delete team "${t.team_name}" and its project? This cannot be undone.`)) return;
    try { await api(`/api/admin/teams/${t.id}?confirm=true`, { method: "DELETE" }); toast("Team deleted.", "success"); load(); }
    catch (e) { toast((e as Error).message, "error"); }
  }

  if (error) return <ErrorBox message={error} />;
  if (!teams || !projects) return <PageLoader />;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-extrabold tracking-tight">Teams</h1>
        <div className="mt-4">
          {teams.length === 0 ? <EmptyState title="No teams yet" /> : (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500"><tr><th className="px-4 py-3">Team</th><th className="px-4 py-3">Code</th><th className="px-4 py-3">Members</th><th className="px-4 py-3">Created</th><th /></tr></thead>
                <tbody>
                  {teams.map((t) => (
                    <tr key={t.id} className="border-b border-neutral-100">
                      <td className="px-4 py-3 font-semibold">{t.team_name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{t.team_code}</td>
                      <td className="px-4 py-3">{t.member_count}</td>
                      <td className="px-4 py-3 text-neutral-500">{new Date(t.created_at).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3 text-right"><button onClick={() => removeTeam(t)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold tracking-tight">Project submissions</h2>
        <div className="mt-4 space-y-4">
          {projects.length === 0 ? <EmptyState title="No projects yet" /> : projects.map((p) => (
            <article key={p.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-sm text-neutral-500">Team: {p.teams?.team_name ?? "—"}{p.submitted_at && ` · submitted ${new Date(p.submitted_at).toLocaleString("en-IN")}`}</p>
                </div>
                <StatusBadge status={p.submission_status} />
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-neutral-700">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                {p.repository_url && <a className="font-semibold underline" href={p.repository_url} target="_blank" rel="noopener noreferrer">Repository</a>}
                {p.demo_url && <a className="font-semibold underline" href={p.demo_url} target="_blank" rel="noopener noreferrer">Demo</a>}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <label htmlFor={`ps_${p.id}`} className="text-sm font-medium">Status</label>
                <select id={`ps_${p.id}`} className="input w-auto py-1.5" value={p.submission_status} onChange={(e) => setStatus(p.id, e.target.value)}>
                  {["draft", "submitted", "under_review", "accepted", "rejected"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
