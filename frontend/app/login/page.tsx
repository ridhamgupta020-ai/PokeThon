"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, safeNext } from "@/components/AuthShell";
import { Field, Spinner, ErrorBox } from "@/components/ui";
import { useToast } from "@/components/Toast";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError(
        error.message.toLowerCase().includes("email not confirmed")
          ? "Please verify your email first. Check your inbox for the confirmation link."
          : "Invalid email or password."
      );
      setBusy(false);
      return;
    }
    toast("Welcome back!", "success");
    router.push(safeNext(params.get("next")));
    router.refresh();
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your Pocket Thon registration.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && <ErrorBox message={error} />}
        <Field label="Email" htmlFor="email">
          <input id="email" type="email" autoComplete="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor="password">
          <input id="password" type="password" autoComplete="current-password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <div className="text-right text-sm"><Link href="/forgot-password" className="font-medium text-brand-600 hover:underline">Forgot password?</Link></div>
        <button disabled={busy || !email || !password} className="btn btn-primary w-full">
          {busy && <Spinner className="h-4 w-4" />} {busy ? "Signing in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        New here? <Link href="/signup" className="font-semibold text-ink underline decoration-brand-400 decoration-2 underline-offset-2">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
