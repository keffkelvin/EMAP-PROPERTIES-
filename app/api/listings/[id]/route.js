import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";

// Update an existing listing (agents only)
export async function PATCH(request, { params }) {
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
  const allowedFields = [
    "type", "name", "location", "price_ksh", "price_note",
    "size", "image_url", "latitude", "longitude", "status"
  ];

  // Only pass through fields that were actually sent, so a partial edit
  // (e.g. just adding an image) doesn't wipe out the other fields.
  const updates = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field] === "" ? null : body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("listings")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update listing:", error.message);
    return NextResponse.json({ error: `Could not update listing: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ listing: data });
}

// Remove a listing (agents only). Any existing bookings tied to it keep
// their history — the schema sets listing_id to null rather than deleting
// the booking, so no lead data is ever lost.
export async function DELETE(request, { params }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Database isn't connected yet." },
      { status: 500 }
    );
  }

  const { error } = await supabaseAdmin.from("listings").delete().eq("id", params.id);

  if (error) {
    console.error("Failed to delete listing:", error.message);
    return NextResponse.json({ error: `Could not delete listing: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
