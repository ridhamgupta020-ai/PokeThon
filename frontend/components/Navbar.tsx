"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui";

const links = [
  ["Home", "/#home"], ["About", "/#about"], ["Schedule", "/#schedule"],
  ["Prizes", "/#prizes"], ["FAQ", "/#faq"], ["Contact", "/#contact"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    await createClient().auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-7 text-sm font-medium text-neutral-700 lg:flex">
          {links.map(([l, h]) => (
            <li key={l}><Link href={h} className="transition hover:text-ink">{l}</Link></li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          {signedIn ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost">Dashboard</Link>
              <button onClick={logout} className="btn btn-dark">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">Login</Link>
              <Link href="/register" className="btn btn-primary">Register Now</Link>
            </>
          )}
        </div>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>
      {open && (
        <div className="border-t border-neutral-200 bg-white px-5 pb-5 pt-3 lg:hidden">
          <ul className="space-y-1">
            {links.map(([l, h]) => (
              <li key={l}><Link href={h} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 font-medium hover:bg-mist">{l}</Link></li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            {signedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="btn btn-ghost flex-1">Dashboard</Link>
                <button onClick={logout} className="btn btn-dark flex-1">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost flex-1">Login</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="btn btn-primary flex-1">Register Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
