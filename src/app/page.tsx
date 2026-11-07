import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/supabase/server";

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasDemoCookie = cookieStore.get("innovexa_demo_session")?.value === "active";
  const user = await getAuthUser();

  // If already authenticated, go straight to dashboard
  if (user || hasDemoCookie) {
    redirect("/dashboard");
  }

  // Otherwise, go directly to the login page
  redirect("/login");
}
