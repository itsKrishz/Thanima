import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { SummaryCards } from "@/components/admin/SummaryCards";
import { createClient, getAdminUser } from "@/lib/supabase/server";
import type { Rsvp } from "@/lib/types/rsvp";
import { computeSummary } from "@/lib/utils/format";

export default async function AdminPage() {
  const admin = await getAdminUser();

  if (!admin) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="rounded-xl border border-sargam-crimson/30 bg-white px-4 py-3 text-sargam-crimson">
          Unable to load RSVP responses. Check your Supabase configuration and
          admin permissions.
        </p>
      </div>
    );
  }

  const rsvps = (data ?? []) as Rsvp[];
  const summary = computeSummary(rsvps);

  return (
    <div className="sargam-pattern min-h-full">
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <SummaryCards summary={summary} />
        <AdminDashboard rsvps={rsvps} />
      </main>
    </div>
  );
}
