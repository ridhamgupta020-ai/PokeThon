"use client";
import { useEffect, useState } from "react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { Days: Math.floor(s / 86400), Hours: Math.floor((s % 86400) / 3600), Minutes: Math.floor((s % 3600) / 60), Seconds: s % 60 };
}

export function Countdown({ target }: { target: string | null }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!target) {
    return <p className="rounded-xl bg-white/70 px-4 py-3 text-sm font-medium text-neutral-600 shadow-card backdrop-blur">Event date will be announced soon.</p>;
  }
  const diff = new Date(target).getTime() - (now ?? Date.now());
  if (now !== null && diff <= 0) {
    return <p className="rounded-xl bg-brand-400 px-4 py-3 text-sm font-bold text-ink">The hackathon has started!</p>;
  }
  const p = parts(now === null ? 0 : diff);
  return (
    <div className="flex gap-3" role="timer" aria-label="Countdown to the event">
      {Object.entries(p).map(([label, value]) => (
        <div key={label} className="w-16 rounded-2xl border border-neutral-200 bg-white/80 py-3 text-center shadow-card backdrop-blur sm:w-20">
          <div className="text-2xl font-extrabold tabular-nums sm:text-3xl">{now === null ? "--" : String(value).padStart(2, "0")}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{label}</div>
        </div>
      ))}
    </div>
  );
}
