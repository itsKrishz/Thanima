import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { phone_number, email } = await request.json();

    if (!phone_number) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Call public.find_rsvp_by_details via RPC to match phone and email securely
    const { data, error } = await supabase.rpc("find_rsvp_by_details", {
      phone: phone_number.trim(),
      mail: email ? email.trim() : null,
    });

    if (error) {
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No matching RSVP record found. Please verify your phone number and email." },
        { status: 404 },
      );
    }

    const matchId = data[0].id;
    const response = NextResponse.json({ success: true, id: matchId });

    // Store RSVP ID in secure HTTP-only cookie (lasts 1 year)
    response.cookies.set("rsvp_id", matchId, {
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
