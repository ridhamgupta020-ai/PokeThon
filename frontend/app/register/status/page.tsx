"use client";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Field, Spinner, ErrorBox, StatusBadge } from "@/components/ui";

export default function StatusPage() {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ registration_number: string; status: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError(""); setResult(null);
    try {
      const q = new URLSearchParams({ number: number.trim(), email: email.trim() });
      setResult(await api(`/api/registrations/status?${q}`));
    } catch (err) {
      setError(err instanceof ApiError && err.status === 404 ? "No registration matches those details." : (err as Error).message);
    }
    setBusy(false);
  }

  const msg: Record<string, string> = {
    pending: "Your registration is being reviewed.",
    approved: "Congratulations — you're in!",
    rejected: "Unfortunately your registration was not accepted.",
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-5 py-16">
        <h1 className="text-3xl font-extrabold">Check registration status</h1>
        <p className="mt-2 text-sm text-neutral-600">Enter your registration ID and the email you registered with.</p>
        <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-6" noValidate>
          {error && <ErrorBox message={error} />}
          <Field label="Registration ID" htmlFor="number"><input id="number" placeholder="PT-2026-01001" className="input" value={number} onChange={(e) => setNumber(e.target.value)} /></Field>
          <Field label="Email" htmlFor="email"><input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <button disabled={busy || number.trim().length < 4 || !email} className="btn btn-primary w-full">{busy && <Spinner className="h-4 w-4" />} Check status</button>
        </form>
        {result && (
          <div className="card mt-6 p-6 text-center">
            <p className="text-sm text-neutral-500">{result.registration_number}</p>
            <div className="mt-2"><StatusBadge status={result.status} /></div>
            <p className="mt-3 font-medium">{msg[result.status]}</p>
          </div>
        )}
      </main>
    </>
  );
}
