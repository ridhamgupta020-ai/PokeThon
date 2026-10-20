"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api, ApiError, type EventSettings } from "@/lib/api";
import { Logo, PageLoader, StatusBadge, Spinner, EmptyState, ErrorBox, Field } from "@/components/ui";
import { useToast } from "@/components/Toast";

type Reg = {
  registration_number: string; full_name: string; email: string; phone: string; college: string; course: string;
  study_year: number; city: string; state: string; github_url: string; linkedin_url: string | null; skills: string[];
  participation_type: string; team_name: string | null; team_size: number; project_idea: string | null; status: string;
};
type Team = { id: string; team_name: string; team_code: string; is_leader: boolean; members: { id: string; full_name: string; email: string }[] };
type Project = { title: string; description: string; repository_url: string | null; demo_url: string | null; submission_status: string; submitted_at: string | null };
type Announcement = { id: string; title: string; content: string; created_at: string };

function Card({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="card p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>{right}
      </div>
      {children}
    </section>
  );
}

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex justify-between gap-4 border-b border-neutral-100 py-2 text-sm last:border-0">
    <dt className="text-neutral-500">{k}</dt><dd className="text-right font-medium break-words">{v || "—"}</dd>
  </div>
);

export default function Dashboard() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [reg, setReg] = useState<Reg | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [anns, setAnns] = useState<Announcement[]>([]);
  const [event, setEvent] = useState<EventSettings | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [profile, t, p, a, ev] = await Promise.all([
        api("/api/profile/me"), api("/api/teams/me"), api("/api/projects/me"), api("/api/announcements"), api("/api/event"),
      ]);
      setName(profile.full_name); setIsAdmin(profile.role === "admin");
      setTeam(t); setProject(p); setAnns(a); setEvent(ev);
      try { setReg(await api("/api/registrations/me")); }
      catch (e) { if (e instanceof ApiError && e.status === 404) setReg(null); else throw e; }
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return router.replace("/login?next=/dashboard");
      setError((e as Error).message);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function logout() {
    await createClient().auth.signOut();
    router.push("/"); router.refresh();
  }

  if (loading) return <PageLoader label="Loading your dashboard…" />;

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            {isAdmin && <Link href="/admin" className="btn btn-ghost">Admin</Link>}
            <button onClick={logout} className="btn btn-dark">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8 sm:px-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {(reg?.full_name || name || "hacker").split(" ")[0]} 👋</h1>
          <p className="mt-1 text-neutral-600">Here's everything about your Pocket Thon journey.</p>
        </div>
        {error && <ErrorBox message={error} />}

        {!reg ? (
          <EmptyState title="You haven't registered yet" body="Complete your registration to secure your spot." action={<Link href="/register" className="btn btn-primary">Register now</Link>} />
        ) : (
          <div className="card flex flex-col gap-4 bg-gradient-to-r from-brand-100 to-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-600">Registration ID</p>
              <p className="select-all text-2xl font-extrabold">{reg.registration_number}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-600">Status</p>
              <div className="mt-1"><StatusBadge status={reg.status} /></div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {reg && <RegistrationCard reg={reg} onSaved={(r) => setReg(r)} />}
            <ProjectCard team={team} project={project} onSaved={setProject} />
            <Card title="Event schedule">
              {event?.content?.schedule?.length ? (
                <ol className="space-y-3">
                  {event.content.schedule.map((s, i) => (
                    <li key={i} className="flex gap-4 text-sm"><span className="w-32 shrink-0 font-bold text-brand-600">{s.time}</span><span><b>{s.title}</b>{s.description && <span className="text-neutral-600"> — {s.description}</span>}</span></li>
                  ))}
                </ol>
              ) : <p className="text-sm text-neutral-500">The schedule hasn't been published yet.</p>}
            </Card>
          </div>
          <div className="space-y-6">
            <Card title="Announcements">
              {anns.length === 0 ? <p className="text-sm text-neutral-500">No announcements yet.</p> : (
                <ul className="space-y-4">
                  {anns.map((a) => (
                    <li key={a.id} className="rounded-xl bg-brand-50 p-3.5">
                      <p className="font-semibold">{a.title}</p>
                      <p className="mt-1 whitespace-pre-line text-sm text-neutral-700">{a.content}</p>
                      <p className="mt-2 text-xs text-neutral-500">{new Date(a.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <TeamCard team={team} onChange={() => load()} toast={toast} />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Registration / edit profile ---------- */
function RegistrationCard({ reg, onSaved }: { reg: Reg; onSaved: (r: Reg) => void }) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [f, setF] = useState({
    full_name: reg.full_name, phone: reg.phone, college: reg.college, course: reg.course, city: reg.city, state: reg.state,
    github_url: reg.github_url, linkedin_url: reg.linkedin_url ?? "", skills: reg.skills.join(", "), project_idea: reg.project_idea ?? "",
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setErrors({});
    try {
      const body: Record<string, unknown> = { ...f, skills: f.skills.split(",").map((s) => s.trim()).filter(Boolean) };
      if (!f.linkedin_url.trim()) delete body.linkedin_url;
      if (!f.project_idea.trim()) delete body.project_idea;
      onSaved(await api<Reg>("/api/registrations/me", { method: "PATCH", body: JSON.stringify(body) }));
      toast("Profile updated.", "success");
      setEditing(false);
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      toast((err as Error).message, "error");
    }
    setBusy(false);
  }

  const inp = (k: keyof typeof f, label: string, type = "text") => (
    <Field label={label} htmlFor={`e_${k}`} error={errors[k]}>
      <input id={`e_${k}`} type={type} className={`input ${errors[k] ? "input-error" : ""}`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
    </Field>
  );

  return (
    <Card title="Your registration" right={!editing && <button onClick={() => setEditing(true)} className="btn btn-ghost py-1.5">Edit profile</button>}>
      {editing ? (
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {inp("full_name", "Full name")}{inp("phone", "Phone", "tel")}{inp("college", "College")}{inp("course", "Course")}
            {inp("city", "City")}{inp("state", "State")}{inp("github_url", "GitHub URL", "url")}{inp("linkedin_url", "LinkedIn URL", "url")}
          </div>
          {inp("skills", "Skills (comma separated)")}
          <Field label="Project idea" htmlFor="e_idea"><textarea id="e_idea" rows={3} className="input" value={f.project_idea} onChange={(e) => setF({ ...f, project_idea: e.target.value })} /></Field>
          <p className="text-xs text-neutral-500">Email and registration status can't be changed here.</p>
          <div className="flex gap-2">
            <button disabled={busy} className="btn btn-primary">{busy && <Spinner className="h-4 w-4" />} Save changes</button>
            <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost">Cancel</button>
          </div>
        </form>
      ) : (
        <dl>
          <Row k="Name" v={reg.full_name} /><Row k="Email" v={reg.email} /><Row k="Phone" v={reg.phone} />
          <Row k="College" v={reg.college} /><Row k="Course" v={`${reg.course} · Year ${reg.study_year}`} />
          <Row k="Location" v={`${reg.city}, ${reg.state}`} />
          <Row k="GitHub" v={<a className="underline" href={reg.github_url} target="_blank" rel="noopener noreferrer">{reg.github_url}</a>} />
          <Row k="LinkedIn" v={reg.linkedin_url && <a className="underline" href={reg.linkedin_url} target="_blank" rel="noopener noreferrer">{reg.linkedin_url}</a>} />
          <Row k="Skills" v={reg.skills.join(", ")} />
          <Row k="Participation" v={`${reg.participation_type}${reg.team_name ? ` · ${reg.team_name} (${reg.team_size})` : ""}`} />
          <Row k="Project idea" v={reg.project_idea} />
        </dl>
      )}
    </Card>
  );
}

/* ---------- Team ---------- */
function TeamCard({ team, onChange, toast }: { team: Team | null; onChange: () => void; toast: (m: string, k?: "success" | "error" | "info") => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<unknown>, ok: string) {
    if (busy) return;
    setBusy(true);
    try { await fn(); toast(ok, "success"); onChange(); } catch (e) { toast((e as Error).message, "error"); }
    setBusy(false);
  }

  if (team) {
    return (
      <Card title="Your team">
        <p className="text-lg font-bold">{team.team_name}</p>
        <p className="mt-1 text-sm text-neutral-600">Team code: <code className="select-all rounded bg-brand-100 px-2 py-0.5 font-bold">{team.team_code}</code></p>
        <ul className="mt-4 space-y-2 text-sm">
          {team.members.map((m) => <li key={m.id} className="flex justify-between"><span className="font-medium">{m.full_name || m.email}</span><span className="text-neutral-500">{m.id === (team as any).team_leader_id ? "Leader" : "Member"}</span></li>)}
        </ul>
        <button disabled={busy} onClick={() => { if (confirm(team.is_leader ? "Leaving will disband the team and delete its project. Continue?" : "Leave this team?")) run(() => api("/api/teams/me/membership", { method: "DELETE" }), "Left the team."); }} className="btn btn-ghost mt-4 w-full">
          {team.is_leader ? "Disband team" : "Leave team"}
        </button>
      </Card>
    );
  }
  return (
    <Card title="Your team">
      <p className="mb-4 text-sm text-neutral-600">Create a team or join one with a code from your team leader.</p>
      <form onSubmit={(e) => { e.preventDefault(); run(() => api("/api/teams", { method: "POST", body: JSON.stringify({ team_name: name }) }), "Team created!"); }} className="space-y-2">
        <input className="input" placeholder="New team name" value={name} onChange={(e) => setName(e.target.value)} aria-label="New team name" />
        <button disabled={busy || name.trim().length < 2} className="btn btn-primary w-full">Create team</button>
      </form>
      <div className="my-4 text-center text-xs font-semibold uppercase tracking-widest text-neutral-400">or</div>
      <form onSubmit={(e) => { e.preventDefault(); run(() => api("/api/teams/join", { method: "POST", body: JSON.stringify({ team_code: code }) }), "Joined the team!"); }} className="space-y-2">
        <input className="input uppercase" placeholder="Team code" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Team code" />
        <button disabled={busy || code.trim().length < 4} className="btn btn-dark w-full">Join team</button>
      </form>
    </Card>
  );
}

/* ---------- Project submission ---------- */
function ProjectCard({ team, project, onSaved }: { team: Team | null; project: Project | null; onSaved: (p: Project) => void }) {
  const toast = useToast();
  const [f, setF] = useState({ title: project?.title ?? "", description: project?.description ?? "", repository_url: project?.repository_url ?? "", demo_url: project?.demo_url ?? "" });
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const locked = project && ["under_review", "accepted", "rejected"].includes(project.submission_status);

  async function save(submit: boolean) {
    if (busy) return;
    setBusy(true); setErrors({});
    try {
      const body = { ...f, repository_url: f.repository_url || null, demo_url: f.demo_url || null, submit };
      onSaved(await api<Project>("/api/projects/me", { method: "PUT", body: JSON.stringify(body) }));
      toast(submit ? "Project submitted!" : "Draft saved.", "success");
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fields);
      toast((err as Error).message, "error");
    }
    setBusy(false);
  }

  return (
    <Card title="Project submission" right={project && <StatusBadge status={project.submission_status} />}>
      {!team ? (
        <p className="text-sm text-neutral-500">Create or join a team to submit a project. (Solo participants: create a team of one.)</p>
      ) : (
        <div className="space-y-4">
          <Field label="Project title" htmlFor="p_title" error={errors.title}><input id="p_title" disabled={!!locked} className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <Field label="Description" htmlFor="p_desc" error={errors.description}><textarea id="p_desc" rows={4} disabled={!!locked} className="input" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Repository URL" htmlFor="p_repo" error={errors.repository_url}><input id="p_repo" type="url" disabled={!!locked} className="input" value={f.repository_url} onChange={(e) => setF({ ...f, repository_url: e.target.value })} /></Field>
            <Field label="Demo URL" htmlFor="p_demo" error={errors.demo_url}><input id="p_demo" type="url" disabled={!!locked} className="input" value={f.demo_url} onChange={(e) => setF({ ...f, demo_url: e.target.value })} /></Field>
          </div>
          {locked ? <p className="text-sm text-neutral-500">This submission is locked while it is being judged.</p> : (
            <div className="flex gap-2">
              <button disabled={busy || f.title.trim().length < 2 || f.description.trim().length < 10} onClick={() => save(false)} className="btn btn-ghost">Save draft</button>
              <button disabled={busy || f.title.trim().length < 2 || f.description.trim().length < 10} onClick={() => save(true)} className="btn btn-primary">{busy && <Spinner className="h-4 w-4" />} Submit project</button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
