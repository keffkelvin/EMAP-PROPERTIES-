const typeStyles = {
  plot: "from-oceanMid to-oceanDeep",
  bungalow: "from-gold to-[#8C6A22]",
  stay: "from-coral to-coralDeep"
};

import MapPin from "./MapPin";

function formatPrice(value, type) {
  const num = Number(value);
  if (num >= 1000000) return `KSh ${(num / 1000000).toFixed(1)}M`;
  return `KSh ${Math.round(num / 1000)}K`;
}

export default function PropertyCard({ listing }) {
  const gradientClass = typeStyles[listing.type] || typeStyles.plot;

  return (
    <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
      <div
        className={`h-32 relative bg-gradient-to-br ${gradientClass} bg-cover bg-center`}
        style={listing.image_url ? { backgroundImage: `url(${listing.image_url})` } : undefined}
      >
        <span className="absolute top-2.5 left-2.5 bg-white/95 text-oceanDeep font-mono text-[10px] font-semibold px-2 py-1 rounded-full">
          {listing.status === "available" ? "Available" : listing.status}
        </span>
      </div>
      <div className="p-4">
        <div className="text-[11.5px] text-inkSoft mb-1">{listing.location}</div>
        <h3 className="font-serif text-base font-semibold mb-2">{listing.name}</h3>
        {listing.size && (
          <div className="flex gap-1.5 flex-wrap mb-1">
            <span className="text-[11px] text-inkSoft bg-sand px-2 py-0.5 rounded font-mono">
              {listing.size}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-ink/10">
          <div>
            <div className="font-serif text-lg font-semibold text-coralDeep">
              {formatPrice(listing.price_ksh)}
            </div>
            {listing.price_note && (
              <div className="text-[10.5px] text-inkSoft">{listing.price_note}</div>
            )}
          </div>
          <a
            href={`?listing=${listing.id}#book`}
            className="text-xs font-bold text-oceanDeep hover:underline"
          >
            View &rarr;
          </a>
        </div>
        <div className="mt-3">
          <MapPin latitude={listing.latitude} longitude={listing.longitude} name={listing.name} />
        </div>
      </div>
    </div>
  );
}
