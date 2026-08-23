// Shown only if Supabase isn't connected yet, so the site never looks broken
// during setup. Once real env vars are added, live data from the database
// takes over automatically — this file is never used in production with
// Supabase configured.
export const fallbackListings = [
  {
    id: "fallback-kizingo",
    type: "plot",
    name: "Kizingo Greens",
    location: "200m off Mombasa–Malindi Highway",
    latitude: -3.63,
    longitude: 39.86,
    price_ksh: 475000,
    price_note: "Incl. title deed transfer",
    size: "50 x 100, water & power on site",
    status: "available",
    image_url: "/images/kizingo-greens.jpeg"
  },
  {
    id: "fallback-fedha",
    type: "plot",
    name: "Fedha Estate",
    location: "800m off Kilifi–Malindi Highway",
    latitude: -3.51,
    longitude: 39.855,
    price_ksh: 895000,
    price_note: "Incl. transfer fees",
    size: "50 x 100, water & power on site",
    status: "available",
    image_url: "/images/fedha-estate.jpeg"
  },
  {
    id: "fallback-bofa",
    type: "plot",
    name: "Bofa Phase 4",
    location: "Bofa, Kilifi County, 400m from beach",
    latitude: -3.6208,
    longitude: 39.8636,
    price_ksh: 495000,
    price_note: "50% deposit, balance in 6 months",
    size: "50 x 100, water & power on site",
    status: "available",
    image_url: null
  }
];
