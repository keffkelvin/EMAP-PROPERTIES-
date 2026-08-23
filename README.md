# Emap Properties Platform

A real, working booking platform for Emap Properties — plots, bungalows, and
coastal stays, with virtual/in-person site-visit booking and a private agent
portal.

This is a working Next.js application, not a static demo. Out of the box it
runs and looks correct using fallback data, but **bookings and new listings
won't be saved anywhere permanent until you connect a database** (10 minutes,
free — instructions below).

## What's included

- **Public site** — real listings pulled from the database, organized into
  Plots, Bungalows, and Stays
- **Booking widget** — buyers pick a listing (or "not sure yet" for a general
  inquiry), their preferred location, budget, contact details, virtual/in-
  person, and a date — saves a real booking/inquiry to the database
- **Geomap pin** — each listing card has a "View on map" toggle showing an
  embedded map pin, plus a "Get directions" link. No API key required.
- **Agent portal** (`/portal`) — password-protected. Shows every booking as
  it comes in, and lets the team add new listings without a developer
- **Fallback mode** — if the database isn't connected yet, the site shows
  Emap's real listings from seed data so it never looks broken during setup

## 1. Connect the database (Supabase — free)

1. Go to [supabase.com](https://supabase.com) and create a free account and
   a new project (pick any name/region, wait ~2 minutes for it to spin up).
2. In your new project, open the **SQL Editor** → **New query**, paste in
   the entire contents of `supabase/schema.sql` from this project, and click
   **Run**. This creates the `listings` and `bookings` tables and seeds
   Emap's real listings.

   *Already set up Supabase before this update?* Run
   `supabase/migration_002_geomap_and_inquiry_fields.sql` instead — it adds
   the new map and inquiry columns without touching your existing data.

   **Important on map pins:** the seeded coordinates are approximate
   Kilifi-area placeholders, not exact plot boundaries. For each real plot,
   open Google Maps, long-press the actual location, and it'll show you the
   exact latitude/longitude — update the listing in the agent portal (or
   directly in Supabase's Table Editor) with the real numbers.
3. Go to **Project Settings → API**. You'll need three values:
   - `Project URL` → this is `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (click "reveal") → this is `SUPABASE_SERVICE_ROLE_KEY`
     — keep this one secret, never put it in client-facing code

## 2. Set environment variables

Copy `.env.example` to `.env.local` for local development, and fill in the
three Supabase values above plus a password for the agent portal:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
AGENT_PASSWORD=choose-a-strong-password
```

**On Vercel:** go to your project → Settings → Environment Variables, and
add the same four values there. Redeploy after saving.

## 3. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/portal` for the agent portal (log in with whatever
you set `AGENT_PASSWORD` to).

## 4. Deploy

Push this repo to GitHub, then import it into Vercel (or connect your
existing GitHub repo if you're already on Vercel). Add the environment
variables from step 2 in the Vercel dashboard. Every push to `main`
redeploys automatically.

## What's deliberately kept simple for v1

- **Agent auth is a single shared password**, not individual accounts —
  fine for one small team, easy to upgrade to per-agent logins later
  without a rebuild.
- **No payment processing yet** — bookings and deposits are tracked as
  records, not charged through the site. Add M-Pesa/Stripe integration
  when you're ready for that step.
- **No automatic social media posting yet** — this is a clean next feature
  to add via the Facebook/Instagram Graph API once Emap has a Business
  account connected. The booking and listings foundation is what makes
  that addition straightforward later.

## Project structure

```
app/
  page.js              → public homepage
  portal/               → agent portal (login + dashboard)
  api/
    listings/route.js   → GET (public) + POST (agents add listings)
    bookings/route.js   → POST (public books a visit) + GET (agents view)
    auth/                → login/logout
components/              → UI pieces (booking widget, cards, nav, forms)
lib/                      → Supabase client, auth helpers, fallback data
supabase/schema.sql       → run this once in Supabase to set up the database
```
