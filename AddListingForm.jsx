"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddListingForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "plot",
    name: "",
    location: "",
    price_ksh: "",
    price_note: "",
    size: "",
    image_url: "",
    latitude: "",
    longitude: ""
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not save listing.");
      setStatus("idle");
      return;
    }

    setStatus("idle");
    setOpen(false);
    setForm({ type: "plot", name: "", location: "", price_ksh: "", price_note: "", size: "", image_url: "", latitude: "", longitude: "" });
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-oceanDeep text-white text-sm font-bold px-4 py-2.5 rounded-lg"
      >
        + Add listing
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-5 mb-6">
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <select
          value={form.type}
          onChange={(e) => update("type", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        >
          <option value="plot">Plot</option>
          <option value="bungalow">Bungalow</option>
          <option value="stay">Stay</option>
        </select>
        <input
          placeholder="Name (e.g. Kizingo Greens)"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Price (KSh)"
          type="number"
          value={form.price_ksh}
          onChange={(e) => update("price_ksh", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Price note (e.g. incl. transfer fees)"
          value={form.price_note}
          onChange={(e) => update("price_note", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Size / specs"
          value={form.size}
          onChange={(e) => update("size", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Image URL (optional)"
          value={form.image_url}
          onChange={(e) => update("image_url", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2 md:col-span-2"
        />
        <input
          placeholder="Latitude (e.g. -3.6300)"
          value={form.latitude}
          onChange={(e) => update("latitude", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Longitude (e.g. 39.8600)"
          value={form.longitude}
          onChange={(e) => update("longitude", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
      </div>
      <p className="text-[11px] text-inkSoft mb-3">
        Tip: open Google Maps, long-press the exact plot location, and the coordinates shown at the bottom are your latitude and longitude.
      </p>

      {error && <p className="text-xs text-coralDeep mb-3">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-oceanDeep text-white text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {status === "submitting" ? "Saving..." : "Save listing"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm font-semibold text-inkSoft px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
