import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  // Check user authentication fast-path:
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && Boolean(c.value));
  const hasDemoCookie = request.cookies.get("innovexa_demo_session")?.value === "active";

  let user = null;
  if (hasAuthCookie) {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      user = authUser;
    } catch {
      user = null;
    }
  }

  const isAuthenticated = Boolean(user || hasDemoCookie);

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/forgot-password") ||
    request.nextUrl.pathname.startsWith("/reset-password");

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/products") ||
    request.nextUrl.pathname.startsWith("/categories") ||
    request.nextUrl.pathname.startsWith("/inventory") ||
    request.nextUrl.pathname.startsWith("/reports") ||
    request.nextUrl.pathname.startsWith("/import-export") ||
    request.nextUrl.pathname.startsWith("/activity") ||
    request.nextUrl.pathname.startsWith("/settings");

  // If user is authenticated and visits an auth page (login/signup), redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If user has an expired/invalid auth cookie and visits dashboard, redirect to login
  if (!isAuthenticated && hasAuthCookie && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

