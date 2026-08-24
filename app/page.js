import Nav from "@/components/Nav";
import PropertyCard from "@/components/PropertyCard";
import BookingWidget from "@/components/BookingWidget";
import { getListings } from "@/lib/getListings";

// Without this, Next.js pre-renders the homepage once at build time and
// caches it — meaning listings added later through the portal wouldn't
// show up until the next deploy. This forces a fresh database check on
// every visit instead.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { listings, usingFallback } = await getListings();
  const plots = listings.filter((l) => l.type === "plot");
  const bungalows = listings.filter((l) => l.type === "bungalow");
  const stays = listings.filter((l) => l.type === "stay");
  const bookableListings = listings.filter((l) => l.status === "available");

  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="bg-sand relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 pt-16 pb-14 grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-oceanDeep/90 rounded-2xl p-7 text-white">
            <span className="eyebrow text-gold">Emap Properties · Kilifi County</span>
            <div className="flex gap-2 flex-wrap my-4">
              {["Land & plots", "Bungalows", "Coastal stays"].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 bg-white/10 border border-white/25 px-3 py-1.5 rounded-full text-xs font-semibold"
                >
                  {label}
                </div>
              ))}
            </div>
            <h1 className="font-serif text-4xl md:text-[42px] leading-[1.1] mb-4">
              You shouldn't have to fly to Kilifi<br />to buy <em className="text-gold not-italic">your</em> land.
            </h1>
            <p className="text-white/90 text-[16.5px] max-w-[440px] mb-6">
              Real listings, real booking, no back-and-forth. Built for buyers in
              Nairobi, Mombasa, and abroad who can't always make the trip in person.
            </p>
            <div className="flex border-t border-white/25 pt-5 gap-6">
              <div>
                <b className="font-serif text-2xl block">{listings.length}</b>
                <span className="text-[11.5px] text-white/65">live listings</span>
              </div>
              <div>
                <b className="font-serif text-2xl block">0</b>
                <span className="text-[11.5px] text-white/65">trips to enquire</span>
              </div>
              <div>
                <b className="font-serif text-2xl block">24/7</b>
                <span className="text-[11.5px] text-white/65">booking</span>
              </div>
            </div>
          </div>

          {bookableListings.length > 0 ? (
            <div id="book" className="scroll-mt-24">
              <BookingWidget listings={bookableListings} />
            </div>
          ) : (
            <div id="book" className="bg-white border border-ink/10 rounded-2xl p-6 text-sm text-inkSoft scroll-mt-24">
              No bookable listings yet — add some in the agent portal to activate the booking widget.
            </div>
          )}
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="bg-white border-y border-ink/10">
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-wrap justify-between gap-4">
          {[
            ["Since 2012", "Serving Kilifi County"],
            ["Titled land", "Verified before listing"],
            ["In-house survey", "No third-party delays"],
            ["Local team", "On the ground, every visit"]
          ].map(([title, sub]) => (
            <div key={title}>
              <b className="font-serif text-[15px] font-semibold block leading-tight">{title}</b>
              <span className="text-[11px] text-inkSoft">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PLOTS */}
      <section id="plots" className="bg-sand py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-end mb-8 gap-5 flex-wrap">
            <div>
              <span className="eyebrow text-oceanMid">Land &amp; plots</span>
              <h2 className="font-serif text-[28px] mt-2">Every plot, always up to date</h2>
            </div>
            <p className="text-sm text-inkSoft max-w-[380px]">
              No more "is this one still available?" on WhatsApp.
            </p>
          </div>
          {plots.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {plots.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-inkSoft">No plots listed yet.</p>
          )}
        </div>
      </section>

      {/* BUNGALOWS */}
      <section id="bungalows" className="bg-sandDeep py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-8">
            <span className="eyebrow text-coralDeep">Bungalows for sale</span>
            <h2 className="font-serif text-[28px] mt-2">Finished homes, ready to move into</h2>
          </div>
          {bungalows.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {bungalows.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-inkSoft">
              No bungalows listed yet — add one from the agent portal.
            </p>
          )}
        </div>
      </section>

      {/* STAYS */}
      <section id="stays" className="bg-terracotta py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-8">
            <span className="eyebrow text-coralDeep">Coastal stays &middot; Emap Homes</span>
            <h2 className="font-serif text-[28px] mt-2">Rentals and Airbnb, booked without a phone call</h2>
          </div>
          {stays.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {stays.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-inkSoft">
              No stays listed yet — add one from the agent portal.
            </p>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-oceanDeep py-16 text-white">
        <div className="max-w-6xl mx-auto px-8">
          <span className="eyebrow text-gold">Why it converts</span>
          <h2 className="font-serif text-[28px] mt-2 mb-8 text-white">From &ldquo;how much?&rdquo; to deposit paid</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["01", "Buyer books, no back-and-forth", "They pick a property and a slot themselves — virtual today, in-person when ready."],
              ["02", "Agent walks the buyer through it live", "One agent on-site, phone in hand. Same trust, none of the travel cost."],
              ["03", "Every booking lands in one place", "No more scattered WhatsApp threads — the agent portal tracks it all."]
            ].map(([num, title, body]) => (
              <div key={num} className="pt-5 border-t-2 border-gold">
                <span className="font-mono text-gold text-xs block mb-2">{num}</span>
                <h3 className="font-serif text-lg mb-2 text-white">{title}</h3>
                <p className="text-sm text-white/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/10 py-7 text-center text-xs text-inkSoft">
        <div className="flex justify-center gap-3.5 mb-4">
          {["facebook", "instagram", "whatsapp"].map((n) => (
            <a
              key={n}
              href={
                n === "whatsapp"
                  ? "https://wa.me/254110000036"
                  : `https://${n === "facebook" ? "facebook" : "instagram"}.com/emapproperties`
              }
              className="w-9 h-9 rounded-full border border-ink/10 flex items-center justify-center text-oceanDeep"
              aria-label={n}
            >
              {n[0].toUpperCase()}
            </a>
          ))}
        </div>
        emapproperties &middot; 0110 000 036 &middot; www.emapproperties.co.ke
      </footer>
    </>
  );
}
