import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getListings } from "@/lib/getListings";
import AddListingForm from "@/components/AddListingForm";
import ListingRow from "@/components/ListingRow";
import LogoutButton from "@/components/LogoutButton";

async function getBookings() {
  if (!isSupabaseConfigured || !supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*, listings(name, type)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load bookings:", error.message);
    return [];
  }
  return data;
}

const statusStyles = {
  new: "bg-gold/20 text-gold",
  confirmed: "bg-oceanMid/25 text-oceanDeep",
  visited: "bg-oceanMid/25 text-oceanDeep",
  deposit_paid: "bg-coral/25 text-coralDeep",
  closed: "bg-ink/10 text-inkSoft"
};

export default async function PortalDashboard() {
  // Defense in depth: middleware already checks the cookie, this verifies the signature.
  if (!isAuthenticated()) {
    redirect("/portal/login");
  }

  const [bookings, { listings, usingFallback, error: listingsError }] = await Promise.all([getBookings(), getListings()]);

  return (
    <div className="min-h-screen bg-sand">
      <div className="bg-oceanDeep text-white">
        <div className="max-w-5xl mx-auto px-8 py-6 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-xl">Emap agent portal</h1>
            <p className="text-xs text-white/60 mt-0.5">Private &middot; not visible to buyers</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {!isSupabaseConfigured && (
          <div className="bg-coral/10 border border-coral/30 text-coralDeep text-sm rounded-lg p-4 mb-6">
            Supabase isn't connected yet, so bookings and new listings won't be saved.
            Add your credentials to the environment variables to activate this fully — see the README.
          </div>
        )}

        {isSupabaseConfigured && usingFallback && (
          <div className="bg-coral/10 border border-coral/30 text-coralDeep text-sm rounded-lg p-4 mb-6">
            Supabase is connected but the listings query is failing, so the site is showing
            placeholder data instead of your real listings. This is very likely why bookings
            are failing too. Error detail: <code className="text-xs">{listingsError}</code>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-lg font-semibold">Listings ({listings.length})</h2>
          <AddListingForm />
        </div>

        <div className="bg-white border border-ink/10 rounded-xl overflow-hidden mb-10">
          {listings.length === 0 ? (
            <p className="text-sm text-inkSoft p-4">No listings yet.</p>
          ) : (
            listings.map((l) => <ListingRow key={l.id} listing={l} />)
          )}
        </div>

        <h2 className="font-serif text-lg font-semibold mb-4">Bookings &amp; visits ({bookings.length})</h2>
        <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
          {bookings.length === 0 ? (
            <p className="text-sm text-inkSoft p-4">No bookings yet — they'll appear here as buyers book visits on the public site.</p>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="flex justify-between items-center px-4 py-3 border-b border-ink/5 last:border-0 text-sm">
                <div>
                  <span className="font-semibold">{b.buyer_name}</span>
                  <span className="text-inkSoft"> &middot; {b.listings?.name || "General inquiry"}</span>
                  <div className="text-xs text-inkSoft mt-0.5">
                    {b.buyer_phone} &middot; {b.visit_mode === "virtual" ? "Virtual" : "In-person"} &middot; {b.visit_date}
                  </div>
                  {(b.preferred_location || b.budget_ksh) && (
                    <div className="text-xs text-inkSoft mt-0.5">
                      {b.preferred_location && <>Wants: {b.preferred_location}</>}
                      {b.preferred_location && b.budget_ksh && " · "}
                      {b.budget_ksh && <>Budget: KSh {Number(b.budget_ksh).toLocaleString()}</>}
                    </div>
                  )}
                </div>
                <span className={`font-mono text-[10px] px-2.5 py-1 rounded-full ${statusStyles[b.status] || "bg-ink/10 text-inkSoft"}`}>
                  {b.status.replace("_", " ")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
