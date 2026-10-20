"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/AuthShell";
import { Field, Spinner, ErrorBox } from "@/components/ui";
import { useToast } from "@/components/Toast";

export default function ResetPassword() {
  const router = useRouter();
  const toast = useToast();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const mismatch = pw2 && pw !== pw2 ? "Passwords do not match." : "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || pw.length < 8 || pw !== pw2) return;
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setError(error.message);
    toast("Password updated.", "success");
    router.push("/dashboard");
  }

  return (
    <AuthShell title="Choose a new password">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && <ErrorBox message={error} />}
        <Field label="New password" htmlFor="pw" hint="At least 8 characters."><input id="pw" type="password" autoComplete="new-password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
        <Field label="Confirm password" htmlFor="pw2" error={mismatch}><input id="pw2" type="password" autoComplete="new-password" className={`input ${mismatch ? "input-error" : ""}`} value={pw2} onChange={(e) => setPw2(e.target.value)} /></Field>
        <button disabled={busy || pw.length < 8 || pw !== pw2} className="btn btn-primary w-full">{busy && <Spinner className="h-4 w-4" />} Update password</button>
      </form>
    </AuthShell>
  );
}
