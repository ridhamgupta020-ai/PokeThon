"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui";

const items = [
  ["Overview", "/admin"],
  ["Registrations", "/admin/registrations"],
  ["Teams & Projects", "/admin/teams"],
  ["Announcements", "/admin/announcements"],
  ["Event & Content", "/admin/settings"],
] as const;

export function AdminNav({ email }: { email: string }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const nav = (
    <nav className="space-y-1" aria-label="Admin">
      {items.map(([label, href]) => {
        const active = href === "/admin" ? path === href : path.startsWith(href);
        return (
          <Link key={href} href={href} onClick={() => setOpen(false)}
            className={`block rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${active ? "bg-brand-400 text-ink" : "text-neutral-300 hover:bg-white/10"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between bg-ink px-5 py-3 text-white lg:hidden">
        <Logo className="text-white" />
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle admin menu" className="rounded-lg p-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
      {open && <div className="bg-ink px-5 pb-5 lg:hidden">{nav}</div>}
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-ink p-5 text-white lg:flex lg:min-h-screen">
        <div>
          <Logo className="text-white" />
          <p className="mb-5 mt-1 text-xs uppercase tracking-widest text-neutral-400">Admin</p>
          {nav}
        </div>
        <div className="border-t border-white/10 pt-4 text-sm">
          <p className="truncate text-neutral-400" title={email}>{email}</p>
          <div className="mt-3 flex gap-2">
            <Link href="/" className="btn btn-ghost flex-1 py-1.5 text-xs">Site</Link>
            <button onClick={logout} className="btn btn-primary flex-1 py-1.5 text-xs">Logout</button>
          </div>
        </div>
      </aside>
    </>
  );
}
