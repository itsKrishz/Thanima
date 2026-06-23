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

    const { data: insertedData, error } = await supabase
      .from("rsvps")
      .insert({
        full_name: data.full_name,
        graduation_year: data.graduation_year,
        department: data.department,
        phone_number: data.phone_number,
        email: data.email || null,
        attending_status: data.attending_status,
        sadhya_status:
          data.attending_status === "yes" ? (data.sadhya_status ?? null) : null,
        guest_count: 1,
        special_requirements:
          data.attending_status === "yes"
            ? data.special_requirements || null
            : null,
      })
      .select("id")
      .single();

 if (error) {
  console.error("SUPABASE ERROR:", error);

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
    {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    },
    { status: 500 },
  );
}

    if (!insertedData) {
      return NextResponse.json(
        { error: "Unable to retrieve saved RSVP." },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ success: true, id: insertedData.id });
    
    // Store RSVP ID in secure HTTP-only cookie (lasts 1 year)
    response.cookies.set("rsvp_id", insertedData.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
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
        grad_year: data.graduation_year,
        dept: data.department,
        phone: data.phone_number,
        mail: data.email || null,
        attend: data.attending_status,
        sadhya: data.attending_status === "yes" ? (data.sadhya_status ?? null) : null,
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
