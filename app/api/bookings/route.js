import { NextResponse } from "next/server";
import { supabasePublic, supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";

// A valid Postgres UUID looks like 8-4-4-4-12 hex characters.
// Fallback listing IDs (e.g. "fallback-kizingo") are not real UUIDs and
// would crash the insert if sent through — treat them as "no listing picked"
// instead of failing the whole booking.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  const safeListingId = listing_id && UUID_PATTERN.test(listing_id) ? listing_id : null;

  const { data, error } = await supabasePublic
    .from("bookings")
    .insert([{
      listing_id: safeListingId,
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
    // Surfacing the real message (not just a generic one) so setup issues
    // are visible without needing to dig through Vercel logs.
    return NextResponse.json({ error: `Could not save booking: ${error.message}` }, { status: 500 });
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
