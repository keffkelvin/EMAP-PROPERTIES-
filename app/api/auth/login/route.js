import { NextResponse } from "next/server";
import { createSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  const { password } = await request.json();
  const correctPassword = process.env.AGENT_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: "Portal isn't configured yet. Set AGENT_PASSWORD in your environment variables." },
      { status: 500 }
    );
  }

  if (password !== correctPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, createSessionCookie(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return response;
}
