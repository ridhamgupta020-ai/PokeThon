import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { API_BASE } from "@/lib/api";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

/** Server-side gate: the backend verifies the token and the role stored in the database.
 *  Even if this check were bypassed, every /api/admin/* call is authorised again by the API. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  const { data: { session } } = await sb.auth.getSession();

  let admin: { email: string } | null = null;
  try {
    const res = await fetch(`${API_BASE}/api/admin/me`, {
      headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
      cache: "no-store",
    });
    if (res.ok) admin = await res.json();
  } catch { /* API unreachable → treated as not authorised */ }

  if (!admin) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-mist lg:flex">
      <AdminNav email={admin.email} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
