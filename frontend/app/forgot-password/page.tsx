"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/AuthShell";
import { Field, Spinner, ErrorBox } from "@/components/ui";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setBusy(false);
    if (error) return setError(error.message);
    setDone(true); // same message whether or not the account exists
  }

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a link to choose a new password.">
      {done ? (
        <p className="text-neutral-700">If an account exists for <b>{email}</b>, a reset link is on its way.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {error && <ErrorBox message={error} />}
          <Field label="Email" htmlFor="email"><input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <button disabled={busy || !email} className="btn btn-primary w-full">{busy && <Spinner className="h-4 w-4" />} Send reset link</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link href="/login" className="font-semibold underline decoration-brand-400 decoration-2 underline-offset-2">Back to login</Link></p>
    </AuthShell>
  );
}
