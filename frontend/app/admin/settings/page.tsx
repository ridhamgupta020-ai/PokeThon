"use client";
import { useEffect, useState } from "react";
import { api, type EventSettings, type EventContent } from "@/lib/api";
import { PageLoader, ErrorBox, Spinner } from "@/components/ui";
import { useToast } from "@/components/Toast";

type FieldDef = { key: string; label: string; wide?: boolean };

function ListEditor<T extends Record<string, string | undefined>>({
  title, items, fields, onChange,
}: { title: string; items: T[]; fields: FieldDef[]; onChange: (v: T[]) => void }) {
  const blank = Object.fromEntries(fields.map((f) => [f.key, ""])) as T;
  return (
    <section className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <button type="button" onClick={() => onChange([...items, { ...blank }])} className="btn btn-ghost py-1.5">+ Add</button>
      </div>
      {items.length === 0 && <p className="text-sm text-neutral-500">Nothing added yet — this section shows “coming soon” on the site.</p>}
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="grid gap-3 rounded-xl border border-neutral-200 p-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                <label className="label" htmlFor={`${title}_${i}_${f.key}`}>{f.label}</label>
                <input id={`${title}_${i}_${f.key}`} className="input" value={it[f.key] ?? ""} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />
              </div>
            ))}
            <div className="sm:col-span-2 text-right"><button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-xs font-semibold text-red-600 hover:underline">Remove</button></div>
          </div>
        ))}
      </div>
    </section>
  );
}

const toLocal = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const toIso = (local: string) => (local ? new Date(local).toISOString() : null);

export default function SettingsPage() {
  const toast = useToast();
  const [ev, setEv] = useState<EventSettings | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { api<EventSettings>("/api/event").then(setEv).catch((e) => setError(e.message)); }, []);
  if (error) return <ErrorBox message={error} />;
  if (!ev) return <PageLoader />;

  const c: EventContent = ev.content ?? {};
  const setC = (patch: Partial<EventContent>) => setEv({ ...ev, content: { ...c, ...patch } });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !ev) return;
    setBusy(true);
    try {
      const saved = await api<EventSettings>("/api/admin/event", {
        method: "PUT",
        body: JSON.stringify({
          event_name: ev.event_name, event_date: ev.event_date, registration_deadline: ev.registration_deadline,
          registration_open: ev.registration_open, description: ev.description, content: ev.content,
        }),
      });
      setEv(saved);
      toast("Settings saved. The landing page updates within 30 seconds.", "success");
    } catch (err) { toast((err as Error).message, "error"); }
    setBusy(false);
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight">Event &amp; content</h1>
        <button disabled={busy} className="btn btn-primary">{busy && <Spinner className="h-4 w-4" />} Save all changes</button>
      </div>

      <section className="card space-y-4 p-6">
        <h2 className="font-bold">Hackathon settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="s_name">Event name</label><input id="s_name" className="input" value={ev.event_name} onChange={(e) => setEv({ ...ev, event_name: e.target.value })} /></div>
          <div><label className="label" htmlFor="s_date">Event start (countdown target)</label><input id="s_date" type="datetime-local" className="input" value={toLocal(ev.event_date)} onChange={(e) => setEv({ ...ev, event_date: toIso(e.target.value) })} /></div>
          <div><label className="label" htmlFor="s_deadline">Registration deadline</label><input id="s_deadline" type="datetime-local" className="input" value={toLocal(ev.registration_deadline)} onChange={(e) => setEv({ ...ev, registration_deadline: toIso(e.target.value) })} /></div>
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium"><input type="checkbox" className="h-4 w-4 accent-brand-500" checked={ev.registration_open} onChange={(e) => setEv({ ...ev, registration_open: e.target.checked })} /> Registration open</label>
        </div>
        <div><label className="label" htmlFor="s_desc">About the hackathon</label><textarea id="s_desc" rows={5} className="input" value={ev.description} onChange={(e) => setEv({ ...ev, description: e.target.value })} /></div>
      </section>

      <ListEditor title="Themes & problem statements" items={c.themes ?? []} fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", wide: true }]} onChange={(themes) => setC({ themes: themes as any })} />
      <ListEditor title="Schedule" items={c.schedule ?? []} fields={[{ key: "time", label: "Time / date" }, { key: "title", label: "Title" }, { key: "description", label: "Description", wide: true }]} onChange={(schedule) => setC({ schedule: schedule as any })} />
      <ListEditor title="Prizes" items={c.prizes ?? []} fields={[{ key: "place", label: "Place (e.g. 1st)" }, { key: "amount", label: "Amount / reward" }, { key: "title", label: "Title" }, { key: "description", label: "Description", wide: true }]} onChange={(prizes) => setC({ prizes: prizes as any })} />
      <ListEditor title="Sponsors" items={c.sponsors ?? []} fields={[{ key: "name", label: "Name" }, { key: "url", label: "Website URL" }]} onChange={(sponsors) => setC({ sponsors: sponsors as any })} />
      <ListEditor title="FAQ" items={c.faq ?? []} fields={[{ key: "q", label: "Question", wide: true }, { key: "a", label: "Answer", wide: true }]} onChange={(faq) => setC({ faq: faq as any })} />

      <section className="card space-y-4 p-6">
        <h2 className="font-bold">Contact &amp; social links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["email", "phone", "address"] as const).map((k) => (
            <div key={k}><label className="label capitalize" htmlFor={`c_${k}`}>{k === "address" ? "Venue / address" : k}</label><input id={`c_${k}`} className="input" value={c.contact?.[k] ?? ""} onChange={(e) => setC({ contact: { ...c.contact, [k]: e.target.value } })} /></div>
          ))}
          {(["twitter", "instagram", "linkedin", "github", "discord"] as const).map((k) => (
            <div key={k}><label className="label capitalize" htmlFor={`so_${k}`}>{k} URL</label><input id={`so_${k}`} type="url" className="input" value={c.social?.[k] ?? ""} onChange={(e) => setC({ social: { ...c.social, [k]: e.target.value } })} /></div>
          ))}
        </div>
      </section>

      <div className="text-right"><button disabled={busy} className="btn btn-primary">{busy && <Spinner className="h-4 w-4" />} Save all changes</button></div>
    </form>
  );
}
