-- ============================================================
-- Emap Properties Platform — database schema
-- Run this once in your Supabase project: SQL Editor -> New query -> paste -> Run
-- ============================================================

create extension if not exists "pgcrypto";

-- Listings: plots, bungalows, and stays all live in one table,
-- distinguished by `type`. Keeps the data model simple for v1.
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('plot', 'bungalow', 'stay')),
  name text not null,
  location text not null,
  latitude numeric,                -- approximate if not yet set precisely — see README
  longitude numeric,
  price_ksh numeric not null,
  price_note text,                 -- e.g. "incl. title transfer", "per night"
  size text,                       -- e.g. "50 x 100", "3 bed / 2 bath"
  status text not null default 'available', -- available | reserved | sold
  image_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Bookings: every site-visit request, stay reservation, AND general buyer
-- inquiries (a buyer who hasn't picked a specific listing yet) from the
-- public site. listing_id is nullable to support general inquiries.
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete set null,
  buyer_name text not null,
  buyer_phone text not null,
  buyer_email text,
  preferred_location text,         -- e.g. "Kilifi Town" or "near the beach"
  budget_ksh numeric,               -- buyer's stated budget
  visit_mode text not null check (visit_mode in ('virtual', 'in_person')),
  visit_date date not null,
  status text not null default 'new', -- new | confirmed | visited | deposit_paid | closed
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_listing on bookings(listing_id);
create index if not exists idx_bookings_created on bookings(created_at desc);

-- Row Level Security: public can READ listings and CREATE bookings,
-- but only the server (using the service role key) can read/manage bookings.
alter table listings enable row level security;
alter table bookings enable row level security;

create policy "Public can view listings"
  on listings for select
  using (true);

create policy "Public can create a booking"
  on bookings for insert
  with check (true);

-- ============================================================
-- Seed data — Emap's real listings from their marketing material
-- ============================================================
-- NOTE ON COORDINATES: the lat/lng below are approximate Kilifi-area
-- placeholders, not exact plot boundaries. Replace them with the real
-- coordinates for each plot — drop a pin on Google Maps at the actual
-- corner/entrance of each plot, then copy the two numbers it shows you.
insert into listings (type, name, location, latitude, longitude, price_ksh, price_note, size, status, featured, image_url) values
  ('plot', 'Kizingo Greens', '200m off Mombasa–Malindi Highway', -3.6300, 39.8600, 475000, 'Incl. title deed transfer', '50 x 100, water & power on site', 'available', true, '/images/kizingo-greens.jpeg'),
  ('plot', 'Fedha Estate', '800m off Kilifi–Malindi Highway', -3.5100, 39.8550, 895000, 'Incl. transfer fees', '50 x 100, water & power on site', 'available', true, '/images/fedha-estate.jpeg'),
  ('plot', 'Bofa Phase 4', 'Bofa, Kilifi County, 400m from beach', -3.6208, 39.8636, 495000, '50% deposit, balance in 6 months', '50 x 100, water & power on site', 'available', true, null),
  ('plot', 'Tezo Greens Phase II', 'Tezo, Kilifi', -3.6000, 39.8000, 395000, 'Incl. title deed transfer', '50 x 100', 'available', false, null)
on conflict do nothing;
