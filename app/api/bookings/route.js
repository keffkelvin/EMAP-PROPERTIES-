import { NextResponse } from "next/server";
import { supabasePublic, supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";

// Public: create a booking from the site-visit widget
export async function POST(request) {
  const body = await request.json();
  const { listing_id, buyer_name, buyer_phone, buyer_email, preferred_location, budget_ksh, visit_mode, visit_date } = body;

  if (!buyer_name || !buyer_phone || !visit_mode || !visit_date) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Booking storage isn't connected yet. Add your Supabase credentials to save real bookings." },
      { status: 500 }
    );
  }

  const { data, error } = await supabasePublic
    .from("bookings")
    .insert([{
      listing_id: listing_id || null,
      buyer_name,
      buyer_phone,
      buyer_email,
      preferred_location: preferred_location || null,
      budget_ksh: budget_ksh || null,
      visit_mode,
      visit_date
    }])
    .select()
    .single();

  if (error) {
    console.error("Failed to create booking:", error.message);
    return NextResponse.json({ error: "Could not save booking. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}

// Private: agent portal reads all bookings with their listing details
export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json({ bookings: [], source: "unconfigured" });
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*, listings(name, type)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch bookings:", error.message);
    return NextResponse.json({ bookings: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}
