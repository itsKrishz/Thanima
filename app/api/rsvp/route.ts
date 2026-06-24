import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rsvpSchema } from "@/lib/validations/rsvp";
import { isEditDeadlinePassed } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Invalid RSVP submission";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { data: insertedId, error } = await supabase.rpc("insert_rsvp", {
      f_name: data.full_name,
      reg_num: data.registration_number,
      grad_year: data.graduation_year,
      dept: data.department,
      phone: data.phone_number,
      mail: data.email || null,
      attend: data.attending_status,
      reqs:
        data.attending_status === "yes"
          ? data.special_requirements || null
          : null,
    });

    if (error) {
      console.error("RSVP insertion database error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "An RSVP has already been submitted with this phone number.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: `Unable to save RSVP: ${error.message}` },
        { status: 500 },
      );
    }

    if (!insertedId) {
      console.error("RSVP insertion returned no data");
      return NextResponse.json(
        { error: "Unable to retrieve saved RSVP ID from database." },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ success: true, id: insertedId });
    
    // Store RSVP ID in secure HTTP-only cookie (lasts 1 year)
    response.cookies.set("rsvp_id", insertedId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("RSVP insertion caught exception:", err);
    return NextResponse.json(
      { error: `Request execution failed: ${err.message || err}` },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (isEditDeadlinePassed()) {
      return NextResponse.json(
        { error: "The deadline for editing RSVPs has passed. Please contact organizers for changes." },
        { status: 403 },
      );
    }

    const cookieStore = await cookies();
    const rsvpId = cookieStore.get("rsvp_id")?.value;

    if (!rsvpId) {
      return NextResponse.json(
        { error: "Session not found. Please verify your details using 'Find My RSVP'." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Invalid RSVP submission";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { data: success, error: rpcError } = await supabase.rpc(
      "update_rsvp_by_id",
      {
        rsvp_id: rsvpId,
        f_name: data.full_name,
        reg_num: data.registration_number,
        grad_year: data.graduation_year,
        dept: data.department,
        phone: data.phone_number,
        mail: data.email || null,
        attend: data.attending_status,
        reqs: data.attending_status === "yes" ? (data.special_requirements || null) : null,
      },
    );

    if (rpcError) {
      if (rpcError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "An RSVP has already been submitted with this phone number.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Unable to update RSVP. Please try again later." },
        { status: 500 },
      );
    }

    if (!success) {
      return NextResponse.json(
        { error: "RSVP record not found or has been deleted." },
        { status: 404 },
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
