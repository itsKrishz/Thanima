import { NextResponse } from "next/server";
import { createClient, getAdminUser } from "@/lib/supabase/server";
import { rsvpSchema } from "@/lib/validations/rsvp";

export async function PUT(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...rsvpData } = body;

    if (!id) {
      return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 });
    }

    const parsed = rsvpSchema.safeParse(rsvpData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid RSVP data" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase
      .from("rsvps")
      .update({
        full_name: data.full_name,
        graduation_year: data.graduation_year,
        department: data.department,
        phone_number: data.phone_number,
        email: data.email || null,
        attending_status: data.attending_status,
        sadhya_status:
          data.attending_status === "yes" ? (data.sadhya_status ?? null) : null,
        special_requirements:
          data.attending_status === "yes"
            ? data.special_requirements || null
            : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Admin RSVP update error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "An RSVP has already been submitted with this phone number." },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: `Unable to update RSVP record: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin RSVP update exception:", err);
    return NextResponse.json(
      { error: `Invalid request payload: ${err.message || err}` },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Soft delete: set is_deleted = true, deleted_at = now()
    const { error } = await supabase
      .from("rsvps")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Admin RSVP delete error:", error);
      return NextResponse.json(
        { error: `Unable to delete RSVP record: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin RSVP delete exception:", err);
    return NextResponse.json(
      { error: `Invalid request payload: ${err.message || err}` },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "RSVP ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Restore soft-deleted: set is_deleted = false, deleted_at = null
    const { error } = await supabase
      .from("rsvps")
      .update({
        is_deleted: false,
        deleted_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Admin RSVP restore error:", error);
      return NextResponse.json(
        { error: `Unable to restore RSVP record: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }
}
