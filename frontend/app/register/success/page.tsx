"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { PageLoader, ErrorBox, StatusBadge } from "@/components/ui";

type Reg = { registration_number: string; full_name: string; email: string; status: string };

export default function Success() {
  const [reg, setReg] = useState<Reg | null>(null);
  const [error, setError] = useState("");

  // Confirmation is read back from the database, so it only appears if the save really happened.
  useEffect(() => {
    api<Reg>("/api/registrations/me").then(setReg).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        {error ? (
          <>
            <ErrorBox message={error} />
            <Link href="/register" className="btn btn-primary mt-6">Go to registration</Link>
          </>
        ) : !reg ? (
          <PageLoader label="Confirming your registration…" />
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="mt-5 text-3xl font-extrabold">You're registered, {reg.full_name.split(" ")[0]}!</h1>
            <p className="mt-2 text-neutral-600">Your registration has been saved and is awaiting review.</p>
            <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-400 bg-brand-50 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-600">Registration ID</p>
              <p className="mt-1 select-all text-3xl font-extrabold tracking-tight">{reg.registration_number}</p>
              <div className="mt-2"><StatusBadge status={reg.status} /></div>
            </div>
            <p className="mt-4 text-sm text-neutral-500">Keep this ID — you can check your status any time from your dashboard.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/dashboard" className="btn btn-primary">Go to dashboard</Link>
              <Link href="/" className="btn btn-ghost">Home</Link>
            </div>
          </motion.div>
        )}
      </main>
    </>
  );
}
