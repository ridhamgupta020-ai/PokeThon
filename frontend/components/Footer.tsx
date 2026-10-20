import Link from "next/link";
import { Logo } from "@/components/ui";
import type { EventSettings } from "@/lib/api";

export function Footer({ event }: { event: EventSettings | null }) {
  const social = Object.entries(event?.content?.social ?? {}).filter(([, v]) => v);
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-sm text-neutral-600">Build. Innovate. Compete.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-neutral-700">
          <Link href="/terms" className="hover:text-ink">Terms &amp; Conditions</Link>
          <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
          <Link href="/register/status" className="hover:text-ink">Check registration status</Link>
          {social.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-ink">{name}</a>
          ))}
        </div>
      </div>
      <div className="border-t border-neutral-100 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {event?.event_name || "Pocket Thon"}. All rights reserved.
      </div>
    </footer>
  );
}
