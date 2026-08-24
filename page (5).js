"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PortalLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed.");
      return;
    }

    router.push("/portal");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-oceanDeep flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">&#128274;</span>
          <b className="font-serif text-lg font-semibold">Agent portal</b>
        </div>
        <p className="text-xs text-inkSoft mb-6">
          Private area for Emap's team. Buyers never see this.
        </p>

        <label className="block text-[11px] font-bold uppercase tracking-wide mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm border border-ink/15 rounded-lg px-3 py-2.5 mb-4"
          autoFocus
        />

        {error && <p className="text-xs text-coralDeep mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-oceanDeep text-white text-sm font-bold disabled:opacity-60"
        >
          {loading ? "Checking..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
