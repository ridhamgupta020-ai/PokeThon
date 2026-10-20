"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/AuthShell";
import { Field, Spinner, ErrorBox } from "@/components/ui";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const pwError = password && password.length < 8 ? "Use at least 8 characters." : "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || password.length < 8) return;
    setBusy(true);
    setError("");
    const { data, error } = await createClient().auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/register`,
      },
    });
    setBusy(false);
    if (error) return setError(error.message);
    // Supabase returns an empty identities list for an already-registered email.
    if (data.user && data.user.identities?.length === 0) return setError("An account with this email already exists. Try logging in.");
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell title="Check your inbox">
        <p className="text-neutral-700">
          We sent a verification link to <b>{email}</b>. Click it to confirm your email, then continue to register for the hackathon.
        </p>
        <Link href="/login" className="btn btn-dark mt-6 w-full">Go to login</Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create your account" subtitle="Sign up first, then complete your hackathon registration.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && <ErrorBox message={error} />}
        <Field label="Full name" htmlFor="name"><input id="name" required autoComplete="name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Email" htmlFor="email"><input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password" htmlFor="password" error={pwError} hint="At least 8 characters.">
          <input id="password" type="password" required autoComplete="new-password" className={`input ${pwError ? "input-error" : ""}`} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <button disabled={busy || !name.trim() || !email || password.length < 8} className="btn btn-primary w-full">
          {busy && <Spinner className="h-4 w-4" />} {busy ? "Creating account…" : "Sign up"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">Already have an account? <Link href="/login" className="font-semibold text-ink underline decoration-brand-400 decoration-2 underline-offset-2">Log in</Link></p>
    </AuthShell>
  );
}
