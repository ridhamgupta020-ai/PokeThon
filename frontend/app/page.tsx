import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Countdown } from "@/components/Countdown";
import { EmptyState } from "@/components/ui";
import { publicGet, type EventSettings } from "@/lib/api";

export const revalidate = 30;

type Stats = { participants: number; teams: number; projects: number };

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }) : null;
}

function Heading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p>
      <h2 className="h2">{title}</h2>
      {sub && <p className="mt-3 text-neutral-600">{sub}</p>}
    </div>
  );
}

export default async function Home() {
  const [event, stats] = await Promise.all([
    publicGet<EventSettings>("/api/event"),
    publicGet<Stats>("/api/stats/public"),
  ]);
  const c = event?.content ?? {};
  const open = event?.registration_open ?? true;

  const statItems = [
    { label: "Registered participants", value: stats?.participants },
    { label: "Teams", value: stats?.teams },
    { label: "Projects submitted", value: stats?.projects },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section id="home" className="relative isolate overflow-hidden">
          <AnimatedBackground />
          <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-300 bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
              {event?.event_name || "Pocket Thon"}
            </span>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
              Build. <span className="bg-gradient-to-r from-brand-500 to-brand-300 bg-clip-text text-transparent">Innovate.</span> Compete.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-neutral-700">
              Turn your ideas into reality at Pocket Thon. Collaborate with brilliant minds, solve real-world problems, and build something extraordinary.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {open ? (
                <Link href="/register" className="btn btn-primary px-7 py-3.5 text-base">Register for Hackathon</Link>
              ) : (
                <span className="btn bg-neutral-200 px-7 py-3.5 text-base text-neutral-600">Registration closed</span>
              )}
              <Link href="#about" className="btn btn-ghost bg-white/80 px-7 py-3.5 text-base">Explore Details</Link>
            </div>
            <div className="mt-12 flex flex-col items-center gap-3">
              <Countdown target={event?.event_date ?? null} />
              {event?.registration_deadline && open && (
                <p className="text-sm text-neutral-600">Registration closes {fmt(event.registration_deadline)}</p>
              )}
            </div>
            <dl className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {statItems.map((s) => (
                <div key={s.label} className="card bg-white/80 px-5 py-5 backdrop-blur">
                  <dd className="text-3xl font-extrabold tabular-nums">{s.value ?? "—"}</dd>
                  <dt className="mt-1 text-sm text-neutral-600">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* About + themes */}
        <section id="about" className="section">
          <Heading eyebrow="About" title="About the Hackathon" />
          {event?.description ? (
            <p className="max-w-3xl whitespace-pre-line text-lg leading-relaxed text-neutral-700">{event.description}</p>
          ) : (
            <EmptyState title="Details coming soon" body="The organisers haven't published the event description yet." />
          )}
          <div className="mt-14">
            <h3 className="mb-5 text-xl font-bold">Themes &amp; problem statements</h3>
            {c.themes?.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {c.themes.map((t, i) => (
                  <article key={i} className="card p-6 transition hover:-translate-y-1 hover:shadow-glow">
                    <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-brand-100 text-sm font-extrabold">{i + 1}</div>
                    <h4 className="font-bold">{t.title}</h4>
                    <p className="mt-1.5 text-sm text-neutral-600">{t.description}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="Themes will be announced soon" />
            )}
          </div>
        </section>

        {/* Schedule */}
        <section id="schedule" className="bg-mist">
          <div className="section">
            <Heading eyebrow="Timeline" title="Event schedule" />
            {c.schedule?.length ? (
              <ol className="relative ml-3 space-y-6 border-l-2 border-brand-300 pl-8">
                {c.schedule.map((s, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[2.6rem] top-1 h-4 w-4 rounded-full border-4 border-white bg-brand-400 shadow" />
                    <p className="text-sm font-bold text-brand-600">{s.time}</p>
                    <h4 className="font-bold">{s.title}</h4>
                    {s.description && <p className="text-sm text-neutral-600">{s.description}</p>}
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState title="Schedule to be announced" />
            )}
          </div>
        </section>

        {/* Prizes */}
        <section id="prizes" className="section">
          <Heading eyebrow="Rewards" title="Prizes & rewards" />
          {c.prizes?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.prizes.map((p, i) => (
                <article key={i} className={`card p-6 ${i === 0 ? "bg-gradient-to-br from-brand-100 to-white ring-2 ring-brand-400" : ""}`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{p.place}</p>
                  {p.amount && <p className="mt-2 text-3xl font-extrabold">{p.amount}</p>}
                  {p.title && <h4 className="mt-1 font-bold">{p.title}</h4>}
                  {p.description && <p className="mt-1.5 text-sm text-neutral-600">{p.description}</p>}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Prize details coming soon" />
          )}
        </section>

        {/* Sponsors */}
        <section id="sponsors" className="bg-mist">
          <div className="section">
            <Heading eyebrow="Backed by" title="Sponsors & partners" />
            {c.sponsors?.length ? (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {c.sponsors.map((s, i) => (
                  <li key={i} className="card grid h-24 place-items-center px-4 text-center font-bold">
                    {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600">{s.name}</a> : s.name}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="Sponsors will be announced soon" />
            )}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section">
          <Heading eyebrow="Questions" title="Frequently asked questions" />
          {c.faq?.length ? (
            <div className="max-w-3xl space-y-3">
              {c.faq.map((f, i) => (
                <details key={i} className="card group p-5 open:ring-2 open:ring-brand-300">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {f.q}
                    <span className="text-xl leading-none transition group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 text-sm text-neutral-600">{f.a}</p>
                </details>
              ))}
            </div>
          ) : (
            <EmptyState title="No FAQs published yet" />
          )}
        </section>

        {/* Contact */}
        <section id="contact" className="bg-ink text-white">
          <div className="section">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-400">Contact</p>
            <h2 className="h2">Get in touch</h2>
            {c.contact && (c.contact.email || c.contact.phone || c.contact.address) ? (
              <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                {c.contact.email && <div><dt className="text-sm text-neutral-400">Email</dt><dd className="mt-1 font-semibold"><a className="hover:text-brand-400" href={`mailto:${c.contact.email}`}>{c.contact.email}</a></dd></div>}
                {c.contact.phone && <div><dt className="text-sm text-neutral-400">Phone</dt><dd className="mt-1 font-semibold">{c.contact.phone}</dd></div>}
                {c.contact.address && <div><dt className="text-sm text-neutral-400">Venue</dt><dd className="mt-1 font-semibold">{c.contact.address}</dd></div>}
              </dl>
            ) : (
              <p className="mt-4 text-neutral-400">Contact details will be published soon.</p>
            )}
          </div>
        </section>
      </main>
      <Footer event={event} />
    </>
  );
}
