"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ListingRow({ listing }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    type: listing.type || "plot",
    name: listing.name || "",
    location: listing.location || "",
    price_ksh: listing.price_ksh || "",
    price_note: listing.price_note || "",
    size: listing.size || "",
    image_url: listing.image_url || "",
    latitude: listing.latitude || "",
    longitude: listing.longitude || "",
    status: listing.status || "available"
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const res = await fetch(`/api/listings/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not save changes.");
      setStatus("idle");
      return;
    }

    setStatus("idle");
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Delete "${listing.name}"? This can't be undone.`)) return;

    const res = await fetch(`/api/listings/${listing.id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Could not delete listing.");
      return;
    }

    router.refresh();
  }

  if (!editing) {
    return (
      <div className="flex justify-between items-center px-4 py-3 border-b border-ink/5 last:border-0 text-sm">
        <div>
          <span className="font-semibold">{listing.name}</span>
          <span className="text-inkSoft"> &middot; {listing.location}</span>
          {!listing.image_url && (
            <span className="ml-2 text-[10px] font-mono text-gold">no image</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-inkSoft">
            KSh {Number(listing.price_ksh).toLocaleString()}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-semibold text-oceanDeep underline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs font-semibold text-coralDeep underline"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="px-4 py-4 border-b border-ink/5 last:border-0 bg-sand/40">
      <div className="grid md:grid-cols-2 gap-2 mb-2">
        <select
          value={form.type}
          onChange={(e) => update("type", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        >
          <option value="plot">Plot</option>
          <option value="bungalow">Bungalow</option>
          <option value="stay">Stay</option>
        </select>
        <select
          value={form.status}
          onChange={(e) => update("status", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        >
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
        <input
          placeholder="Name"
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
          placeholder="Price note"
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
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => update("image_url", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Latitude"
          value={form.latitude}
          onChange={(e) => update("latitude", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
        <input
          placeholder="Longitude"
          value={form.longitude}
          onChange={(e) => update("longitude", e.target.value)}
          className="text-sm border border-ink/15 rounded-lg px-3 py-2"
        />
      </div>

      {error && <p className="text-xs text-coralDeep mb-2">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-oceanDeep text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-xs font-semibold text-inkSoft px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
