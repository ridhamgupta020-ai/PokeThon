"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageLoader, ErrorBox, EmptyState, Spinner } from "@/components/ui";
import { useToast } from "@/components/Toast";

type Ann = { id: string; title: string; content: string; published: boolean; created_at: string };

export default function AnnouncementsPage() {
  const toast = useToast();
  const [items, setItems] = useState<Ann[] | null>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => api<Ann[]>("/api/admin/announcements").then(setItems).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await api("/api/admin/announcements", { method: "POST", body: JSON.stringify({ title, content, published }) });
      setTitle(""); setContent(""); toast("Announcement saved.", "success"); await load();
    } catch (err) { toast((err as Error).message, "error"); }
    setBusy(false);
  }

  async function toggle(a: Ann) {
    try { await api(`/api/admin/announcements/${a.id}`, { method: "PATCH", body: JSON.stringify({ published: !a.published }) }); load(); }
    catch (e) { toast((e as Error).message, "error"); }
  }
  async function remove(a: Ann) {
    if (!confirm(`Delete "${a.title}"?`)) return;
    try { await api(`/api/admin/announcements/${a.id}`, { method: "DELETE" }); toast("Deleted.", "success"); load(); }
    catch (e) { toast((e as Error).message, "error"); }
  }

  if (error) return <ErrorBox message={error} />;
  if (!items) return <PageLoader />;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Announcements</h1>
      <form onSubmit={create} className="card space-y-4 p-6">
        <h2 className="font-bold">New announcement</h2>
        <div><label htmlFor="a_title" className="label">Title</label><input id="a_title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label htmlFor="a_content" className="label">Content</label><textarea id="a_content" rows={4} className="input" value={content} onChange={(e) => setContent(e.target.value)} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-brand-500" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publish immediately (visible on participant dashboards)</label>
        <button disabled={busy || title.trim().length < 2 || content.trim().length < 2} className="btn btn-primary">{busy && <Spinner className="h-4 w-4" />} Save announcement</button>
      </form>

      {items.length === 0 ? <EmptyState title="No announcements yet" /> : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-bold">{a.title} <span className={`badge ml-2 ${a.published ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600"}`}>{a.published ? "Published" : "Draft"}</span></p>
                <p className="mt-1 whitespace-pre-line text-sm text-neutral-700">{a.content}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => toggle(a)} className="btn btn-ghost py-1.5">{a.published ? "Unpublish" : "Publish"}</button>
                <button onClick={() => remove(a)} className="btn btn-ghost py-1.5 text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
