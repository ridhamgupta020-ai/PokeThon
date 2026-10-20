import { Navbar } from "@/components/Navbar";

export const metadata = { title: "Terms & Conditions — Pocket Thon" };

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-neutral-500">Template text — have the organisers review and replace before launch.</p>
        <div className="mt-8 space-y-5 text-neutral-700">
          <p>By registering for Pocket Thon you confirm that the information you provide is accurate and that you are eligible to participate as described by the organisers.</p>
          <p>Participants must follow the event code of conduct, submit original work (or properly licensed open-source components), and respect the decisions of the organisers and judges.</p>
          <p>The organisers may approve, reject, or remove registrations that are incomplete, duplicate, or in breach of these terms.</p>
          <p>Intellectual property in submitted projects remains with the participating team unless stated otherwise in the official rules.</p>
        </div>
      </main>
    </>
  );
}
