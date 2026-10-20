import { Navbar } from "@/components/Navbar";

export const metadata = { title: "Privacy Policy — Pocket Thon" };

export default function Privacy() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-neutral-500">Template text — have the organisers review and replace before launch.</p>
        <div className="mt-8 space-y-5 text-neutral-700">
          <p>We collect the details you submit when registering (name, contact details, college, profile links, skills and project ideas) to run the hackathon.</p>
          <p>Your data is stored in our database and is visible only to you and the event administrators. Passwords are handled by our authentication provider and are never stored in plain text.</p>
          <p>We use your email to send confirmations and updates about your registration. We do not sell your data.</p>
          <p>To request correction or deletion of your data, contact the organisers using the details on the home page.</p>
        </div>
      </main>
    </>
  );
}
