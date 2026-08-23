"use client";

import { useState } from "react";

export default function MapPin({ latitude, longitude, name }) {
  const [open, setOpen] = useState(false);

  if (!latitude || !longitude) return null;

  const embedSrc = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-semibold text-oceanDeep flex items-center gap-1"
      >
        📍 {open ? "Hide map" : "View on map"}
      </button>

      {open && (
        <div className="mt-2 rounded-lg overflow-hidden border border-ink/10">
          <iframe
            title={`Map for ${name}`}
            src={embedSrc}
            width="100%"
            height="180"
            style={{ border: 0 }}
            loading="lazy"
          />
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs font-semibold text-white bg-oceanDeep py-2"
          >
            Get directions
          </a>
        </div>
      )}
    </div>
  );
}
