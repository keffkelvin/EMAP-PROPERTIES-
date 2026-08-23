-- Run this ONLY if you already ran schema.sql before this update.
-- If you're setting up Supabase for the first time, just run schema.sql —
-- it already includes these columns, skip this file entirely.

alter table listings add column if not exists latitude numeric;
alter table listings add column if not exists longitude numeric;

alter table bookings add column if not exists preferred_location text;
alter table bookings add column if not exists budget_ksh numeric;

-- Optional: backfill approximate coordinates for Emap's existing seed listings.
-- Replace these with real coordinates when you have them (see README).
update listings set latitude = -3.6300, longitude = 39.8600 where name = 'Kizingo Greens' and latitude is null;
update listings set latitude = -3.5100, longitude = 39.8550 where name = 'Fedha Estate' and latitude is null;
update listings set latitude = -3.6208, longitude = 39.8636 where name = 'Bofa Phase 4' and latitude is null;
update listings set latitude = -3.6000, longitude = 39.8000 where name = 'Tezo Greens Phase II' and latitude is null;
