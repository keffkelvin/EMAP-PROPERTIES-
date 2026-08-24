import { supabasePublic, isSupabaseConfigured } from "./supabase";
import { fallbackListings } from "./fallbackListings";

export async function getListings() {
  if (!isSupabaseConfigured) {
    return { listings: fallbackListings, error: null, usingFallback: true };
  }

  const { data, error } = await supabasePublic
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch listings, using fallback:", error.message);
    return { listings: fallbackListings, error: error.message, usingFallback: true };
  }

  return { listings: data, error: null, usingFallback: false };
}
