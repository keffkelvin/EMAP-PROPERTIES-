import { NextResponse } from "next/server";
import { supabasePublic, supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { fallbackListings } from "@/lib/fallbackListings";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ listings: fallbackListings, source: "fallback" });
  }

  const { data, error } = await supabasePublic
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch listings:", error.message);
    return NextResponse.json({ listings: fallbackListings, source: "fallback", error: error.message });
  }

  return NextResponse.json({ listings: data, source: "supabase" });
}

// Private: agents add a new listing from the portal
export async function POST(request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Database isn't connected yet. Add your Supabase credentials first." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { type, name, location, price_ksh, price_note, size, image_url, latitude, longitude } = body;

  if (!type || !name || !location || !price_ksh) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("listings")
    .insert([{
      type, name, location, price_ksh, price_note, size, image_url,
      latitude: latitude || null,
      longitude: longitude || null
    }])
    .select()
    .single();

  if (error) {
    console.error("Failed to create listing:", error.message);
    return NextResponse.json({ error: "Could not save listing." }, { status: 500 });
  }

  return NextResponse.json({ listing: data });
}

