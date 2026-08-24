import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// Public client — safe to use from the browser or server for read-only
// operations covered by Row Level Security (viewing listings, creating bookings).
export const supabasePublic = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;

// Admin client — server-side ONLY. Uses the service role key, which bypasses
// Row Level Security, so it must never be imported into a client component.
export const supabaseAdmin =
  isSupabaseConfigured && serviceKey
    ? createClient(url, serviceKey, { auth: { persistSession: false } })
    : null;
