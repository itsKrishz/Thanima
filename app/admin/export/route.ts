import { NextResponse } from "next/server";
import { createClient, getAdminUser } from "@/lib/supabase/server";
import type { Rsvp } from "@/lib/types/rsvp";
import { rsvpsToCsv } from "@/lib/utils/csv";

export async function GET() {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Unable to export RSVP data." },
      { status: 500 },
    );
  }

  const csv = rsvpsToCsv((data ?? []) as Rsvp[]);
  const filename = `sargam26-rsvp-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
