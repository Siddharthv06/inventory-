import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.set("innovexa_demo_session", "active", {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const url = new URL("/dashboard", request.url);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  return GET(request);
}

