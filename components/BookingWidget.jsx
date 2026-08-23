"use client";

import { useState, useMemo } from "react";

function nextDays(count) {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookingWidget({ listings }) {
  const dates = useMemo(() => nextDays(8), []);
  const [listingId, setListingId] = useState(listings[0]?.id || "");
  const [mode, setMode] = useState("virtual");
  const [dateIdx, setDateIdx] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !phone) {
      setErrorMsg("Please add your name and phone number.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId || null,
          buyer_name: name,
          buyer_phone: phone,
          preferred_location: preferredLocation || null,
          budget_ksh: budget ? Number(budget) : null,
          visit_mode: mode,
          visit_date: dates[dateIdx].toISOString().slice(0, 10)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setPhone("");
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-xl text-center">
        <div className="text-oceanMid text-4xl mb-2">&#10003;</div>
        <div className="font-serif text-lg font-semibold mb-1">Visit booked</div>
        <p className="text-sm text-inkSoft mb-4">
          We've received your request. Emap's team will confirm with you by phone shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold text-oceanDeep underline"
        >
          Book another visit
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-ink/10 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-coral text-lg">&#128197;</span>
        <b className="font-serif text-lg font-semibold">Book a site visit</b>
      </div>
      <p className="text-xs text-inkSoft mb-4">
        Pick a property and a slot — we'll confirm by phone.
      </p>

      <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5">
        Property
      </label>
      <select
        value={listingId}
        onChange={(e) => setListingId(e.target.value)}
        className="w-full text-sm border border-ink/15 rounded-lg px-3 py-2.5 mb-4"
      >
        <option value="">Not sure yet — general inquiry</option>
        {listings.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name} — KSh {Number(l.price_ksh).toLocaleString()}
          </option>
        ))}
      </select>

      <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5">
        Location preferred
      </label>
      <input
        value={preferredLocation}
        onChange={(e) => setPreferredLocation(e.target.value)}
        placeholder="e.g. near the beach, Kilifi Town"
        className="w-full text-sm border border-ink/15 rounded-lg px-3 py-2.5 mb-4"
      />

      <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5">
        Budget (KSh)
      </label>
      <input
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        type="number"
        placeholder="e.g. 500000"
        className="w-full text-sm border border-ink/15 rounded-lg px-3 py-2.5 mb-4"
      />

      <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5">
        How would you like to view it?
      </label>
      <div className="flex gap-2 mb-4">
        {[
          { key: "virtual", label: "Virtual walk-through" },
          { key: "in_person", label: "In-person visit" }
        ].map((opt) => (
          <button
            type="button"
            key={opt.key}
            onClick={() => setMode(opt.key)}
            className={`flex-1 text-xs py-2.5 px-2 rounded-lg border text-center font-semibold transition ${
              mode === opt.key
                ? "border-oceanMid bg-oceanPale text-oceanDeep"
                : "border-ink/15 text-inkSoft"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5">
        Schedule for view — date
      </label>
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {dates.map((d, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setDateIdx(i)}
            className={`text-center text-xs py-2 rounded-lg border ${
              dateIdx === i
                ? "border-coral bg-terracotta text-coralDeep"
                : "border-ink/15 text-inkSoft"
            }`}
          >
            <span className="block font-bold text-sm">{d.getDate()}</span>
          </button>
        ))}
      </div>

      <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5">
        Your name
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Amina Wanjiru"
        className="w-full text-sm border border-ink/15 rounded-lg px-3 py-2.5 mb-4"
      />

      <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5">
        Phone number
      </label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="07XX XXX XXX"
        className="w-full text-sm border border-ink/15 rounded-lg px-3 py-2.5"
      />

      {status === "error" && (
        <p className="text-xs text-coralDeep mt-3">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full mt-4 py-3 rounded-lg bg-oceanDeep text-white text-sm font-bold disabled:opacity-60"
      >
        {status === "submitting" ? "Booking..." : "Confirm booking"}
      </button>
    </form>
  );
}
