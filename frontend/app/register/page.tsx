"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api, ApiError } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Field, PageLoader, Spinner, ErrorBox } from "@/components/ui";
import { useToast } from "@/components/Toast";

type Form = {
  full_name: string; phone: string; college: string; course: string; study_year: string;
  city: string; state: string; github_url: string; linkedin_url: string; skills: string;
  participation_type: "individual" | "team"; team_name: string; team_size: string;
  project_idea: string; accept_terms: boolean; accept_privacy: boolean;
};

const empty: Form = {
  full_name: "", phone: "", college: "", course: "", study_year: "1", city: "", state: "",
  github_url: "", linkedin_url: "", skills: "", participation_type: "individual",
  team_name: "", team_size: "2", project_idea: "", accept_terms: false, accept_privacy: false,
};

function validate(f: Form): Record<string, string> {
  const e: Record<string, string> = {};
  if (f.full_name.trim().length < 2) e.full_name = "Enter your full name.";
  if (!/^\+?[0-9]{10,15}$/.test(f.phone.replace(/[\s\-()]/g, ""))) e.phone = "Enter a valid phone number (10–15 digits).";
  if (f.college.trim().length < 2) e.college = "Enter your college or university.";
  if (f.course.trim().length < 2) e.course = "Enter your course.";
  if (!f.city.trim()) e.city = "Enter your city.";
  if (!f.state.trim()) e.state = "Enter your state.";
  if (!/^https:\/\/(www\.)?github\.com\/[^/\s]+/i.test(f.github_url.trim())) e.github_url = "Use a full GitHub profile URL, e.g. https://github.com/username";
  if (f.linkedin_url.trim() && !/^https:\/\/([a-z]+\.)?linkedin\.com\//i.test(f.linkedin_url.trim())) e.linkedin_url = "Use a full LinkedIn URL.";
  if (!f.skills.split(",").some((s) => s.trim())) e.skills = "Add at least one skill (comma separated).";
  if (f.participation_type === "team") {
    if (!f.team_name.trim()) e.team_name = "Team name is required for teams.";
    if (Number(f.team_size) < 2) e.team_size = "A team needs at least 2 members.";
  }
  if (!f.accept_terms) e.accept_terms = "You must accept the Terms and Conditions.";
  if (!f.accept_privacy) e.accept_privacy = "You must accept the Privacy Policy.";
  return e;
}

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [state, setState] = useState<"loading" | "anon" | "ready" | "closed">("loading");
  const [email, setEmail] = useState("");
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await createClient().auth.getUser();
      if (!data.user) return setState("anon");
      setEmail(data.user.email ?? "");
      setF((p) => ({ ...p, full_name: (data.user!.user_metadata?.full_name as string) ?? "" }));
      try {
        await api("/api/registrations/me");
        router.replace("/dashboard"); // already registered
        return;
      } catch (e) {
        if (!(e instanceof ApiError && e.status === 404)) { /* fall through to form */ }
      }
      try {
        const ev = await api("/api/event");
        if (ev && ev.registration_open === false) return setState("closed");
      } catch { /* backend will enforce regardless */ }
      setState("ready");
    })();
  }, [router]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const v = validate(f);
    setErrors(v);
    setFormError("");
    if (Object.keys(v).length) {
      document.getElementById(Object.keys(v)[0])?.focus();
      return;
    }
    setBusy(true);
    try {
      const body = {
        full_name: f.full_name.trim(),
        phone: f.phone,
        college: f.college.trim(),
        course: f.course.trim(),
        study_year: Number(f.study_year),
        city: f.city.trim(),
        state: f.state.trim(),
        github_url: f.github_url.trim(),
        linkedin_url: f.linkedin_url.trim() || null,
        skills: f.skills.split(",").map((s) => s.trim()).filter(Boolean),
        participation_type: f.participation_type,
        team_name: f.participation_type === "team" ? f.team_name.trim() : null,
        team_size: f.participation_type === "team" ? Number(f.team_size) : 1,
        project_idea: f.project_idea.trim() || null,
        accept_terms: f.accept_terms,
        accept_privacy: f.accept_privacy,
      };
      await api("/api/registrations", { method: "POST", body: JSON.stringify(body) });
      toast("Registration submitted!", "success");
      router.push("/register/success");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422 && Object.keys(err.fields).length) {
          setErrors(err.fields);
          setFormError("Please fix the highlighted fields.");
        } else if (err.status === 409) {
          setFormError("You have already registered with this email.");
        } else setFormError(err.message);
      } else setFormError("Unexpected error. Please try again.");
      setBusy(false);
    }
  }

  if (state === "loading") return <><Navbar /><PageLoader /></>;

  if (state === "anon" || state === "closed") {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-lg px-5 py-20 text-center">
          {state === "anon" ? (
            <>
              <h1 className="text-3xl font-extrabold">Create an account to register</h1>
              <p className="mt-3 text-neutral-600">You'll verify your email first, then fill in your hackathon details.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/signup" className="btn btn-primary">Sign up</Link>
                <Link href="/login?next=/register" className="btn btn-ghost">Log in</Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold">Registration is closed</h1>
              <p className="mt-3 text-neutral-600">The organisers are no longer accepting new registrations.</p>
            </>
          )}
        </main>
      </>
    );
  }

  const err = (k: string) => errors[k];
  const cls = (k: string) => `input ${errors[k] ? "input-error" : ""}`;
  const aria = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Register for Pocket Thon</h1>
        <p className="mt-2 text-neutral-600">Registering as <b>{email}</b>. Fields marked * are required.</p>

        <form onSubmit={onSubmit} noValidate className="card mt-8 space-y-6 p-6 sm:p-8">
          {formError && <ErrorBox message={formError} />}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name *" htmlFor="full_name" error={err("full_name")}><input id="full_name" className={cls("full_name")} value={f.full_name} onChange={(e) => set("full_name", e.target.value)} {...aria("full_name")} /></Field>
            <Field label="Phone number *" htmlFor="phone" error={err("phone")}><input id="phone" type="tel" placeholder="+91 98765 43210" className={cls("phone")} value={f.phone} onChange={(e) => set("phone", e.target.value)} {...aria("phone")} /></Field>
            <div className="sm:col-span-2"><Field label="College / University *" htmlFor="college" error={err("college")}><input id="college" className={cls("college")} value={f.college} onChange={(e) => set("college", e.target.value)} {...aria("college")} /></Field></div>
            <Field label="Course *" htmlFor="course" error={err("course")}><input id="course" placeholder="B.Tech CSE" className={cls("course")} value={f.course} onChange={(e) => set("course", e.target.value)} {...aria("course")} /></Field>
            <Field label="Year of study *" htmlFor="study_year" error={err("study_year")}>
              <select id="study_year" className={cls("study_year")} value={f.study_year} onChange={(e) => set("study_year", e.target.value)}>
                {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </Field>
            <Field label="City *" htmlFor="city" error={err("city")}><input id="city" className={cls("city")} value={f.city} onChange={(e) => set("city", e.target.value)} {...aria("city")} /></Field>
            <Field label="State *" htmlFor="state" error={err("state")}><input id="state" className={cls("state")} value={f.state} onChange={(e) => set("state", e.target.value)} {...aria("state")} /></Field>
            <Field label="GitHub profile URL *" htmlFor="github_url" error={err("github_url")}><input id="github_url" type="url" placeholder="https://github.com/username" className={cls("github_url")} value={f.github_url} onChange={(e) => set("github_url", e.target.value)} {...aria("github_url")} /></Field>
            <Field label="LinkedIn profile URL" htmlFor="linkedin_url" error={err("linkedin_url")}><input id="linkedin_url" type="url" placeholder="https://linkedin.com/in/username" className={cls("linkedin_url")} value={f.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} {...aria("linkedin_url")} /></Field>
            <div className="sm:col-span-2"><Field label="Skills & technology interests *" htmlFor="skills" error={err("skills")} hint="Comma separated, e.g. Python, React, Machine Learning"><input id="skills" className={cls("skills")} value={f.skills} onChange={(e) => set("skills", e.target.value)} {...aria("skills")} /></Field></div>
          </div>

          <fieldset>
            <legend className="label">Participation type *</legend>
            <div className="flex gap-3">
              {(["individual", "team"] as const).map((t) => (
                <label key={t} className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium capitalize ${f.participation_type === t ? "border-brand-500 bg-brand-50 ring-2 ring-brand-300" : "border-neutral-300"}`}>
                  <input type="radio" name="ptype" className="accent-brand-500" checked={f.participation_type === t} onChange={() => set("participation_type", t)} /> {t}
                </label>
              ))}
            </div>
          </fieldset>

          {f.participation_type === "team" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Team name *" htmlFor="team_name" error={err("team_name")}><input id="team_name" className={cls("team_name")} value={f.team_name} onChange={(e) => set("team_name", e.target.value)} {...aria("team_name")} /></Field>
              <Field label="Team size *" htmlFor="team_size" error={err("team_size")}>
                <select id="team_size" className={cls("team_size")} value={f.team_size} onChange={(e) => set("team_size", e.target.value)}>
                  {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} members</option>)}
                </select>
              </Field>
            </div>
          )}

          <Field label="Project idea or problem statement" htmlFor="project_idea" error={err("project_idea")}>
            <textarea id="project_idea" rows={4} maxLength={2000} className={cls("project_idea")} value={f.project_idea} onChange={(e) => set("project_idea", e.target.value)} />
          </Field>

          <div className="space-y-3">
            <div>
              <label className="flex items-start gap-3 text-sm"><input id="accept_terms" type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-500" checked={f.accept_terms} onChange={(e) => set("accept_terms", e.target.checked)} /> <span>I agree to the <Link href="/terms" target="_blank" className="font-semibold underline">Terms and Conditions</Link>. *</span></label>
              {err("accept_terms") && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{err("accept_terms")}</p>}
            </div>
            <div>
              <label className="flex items-start gap-3 text-sm"><input id="accept_privacy" type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-500" checked={f.accept_privacy} onChange={(e) => set("accept_privacy", e.target.checked)} /> <span>I agree to the <Link href="/privacy" target="_blank" className="font-semibold underline">Privacy Policy</Link>. *</span></label>
              {err("accept_privacy") && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{err("accept_privacy")}</p>}
            </div>
          </div>

          <button disabled={busy} className="btn btn-primary w-full py-3 text-base">
            {busy && <Spinner className="h-4 w-4" />} {busy ? "Submitting…" : "Submit registration"}
          </button>
        </form>
      </main>
    </>
  );
}
