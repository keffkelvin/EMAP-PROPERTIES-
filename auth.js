import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "emap_agent_session";

// A simple signed token: not a full multi-user auth system, but a real,
// functional gate for a single small team sharing one portal password.
// Upgrading to per-agent accounts later is a clean follow-on, not a rebuild.
function sign(value) {
  const secret = process.env.AGENT_PASSWORD || "dev-only-secret";
  const hmac = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(token) {
  if (!token) return false;
  const [value, hmac] = token.split(".");
  if (!value || !hmac) return false;
  const expected = sign(value).split(".")[1];
  return hmac === expected && value === "authenticated";
}

export function createSessionCookie() {
  return sign("authenticated");
}

export function isAuthenticated() {
  const store = cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verify(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
