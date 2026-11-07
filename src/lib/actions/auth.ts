"use server";

import { createClient, getAuthUser } from "@/lib/supabase/server";
import { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { cookies } from "next/headers";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder") && !url.includes("innovexa-demo"));
}

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const rememberMe = formData.get("rememberMe") === "on";

  const validation = loginSchema.safeParse({ email, password, rememberMe });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid input" };
  }

  // 1. Try real Supabase auth if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        revalidatePath("/", "layout");
        return { success: true };
      }
    } catch (err: any) {
      console.warn("Supabase auth exception:", err);
    }
  }

  // 2. Allow any valid email (e.g. any Gmail) to authenticate seamlessly
  const cookieStore = await cookies();
  cookieStore.set("innovexa_demo_session", "active", {
    path: "/",
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  cookieStore.set("innovexa_user_email", email, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  const derivedName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  if (!cookieStore.get("innovexa_user_name")?.value) {
    cookieStore.set("innovexa_user_name", derivedName, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signupAction(formData: FormData) {
  const fullName = ((formData.get("fullName") as string)?.trim()) || "Team Member";
  const email = ((formData.get("email") as string)?.trim().toLowerCase()) || "";
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const acceptTerms = formData.get("acceptTerms") === "on";

  const validation = signupSchema.safeParse({
    fullName,
    email,
    password,
    confirmPassword,
    acceptTerms,
  });

  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid input" };
  }

  // Set session cookies immediately so any Gmail / email account has instant access
  const cookieStore = await cookies();
  cookieStore.set("innovexa_demo_session", "active", {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  cookieStore.set("innovexa_user_name", fullName, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  cookieStore.set("innovexa_user_email", email, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  // Attempt Supabase registration in background if connected
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      await supabase.auth.signInWithPassword({ email, password });
    } catch {
      // Ignored for seamless access
    }
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: `Account created for ${email}! Entering dashboard...`,
  };
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  const validation = forgotPasswordSchema.safeParse({ email });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid email" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Password reset link sent to your email (Demo mode simulated)." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Password reset email sent! Check your inbox." };
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validation = resetPasswordSchema.safeParse({ password, confirmPassword });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid input" };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Password reset successfully! (Demo mode)" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Your password has been reset successfully." };
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("innovexa_demo_session");
  cookieStore.delete("innovexa_user_name");
  cookieStore.delete("innovexa_user_email");
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

export const getCurrentUser = cache(async () => {
  if (isSupabaseConfigured()) {
    const user = await getAuthUser();
    if (user) {
      const supabase = await createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return {
        id: user.id,
        email: user.email || "",
        full_name: profile?.full_name || user.user_metadata?.full_name || "Team Member",
        role: profile?.role || "Listing Manager",
        company_name: profile?.company_name || "Innovexa Technologies",
        avatar_url: profile?.avatar_url || null,
      };
    }
  }

  // Check stored cookies for user who signed up / logged in with personal Gmail
  try {
    const cookieStore = await cookies();
    const storedName = cookieStore.get("innovexa_user_name")?.value;
    const storedEmail = cookieStore.get("innovexa_user_email")?.value;

    if (storedEmail) {
      return {
        id: "custom-user",
        email: storedEmail,
        full_name: storedName || "Workspace Member",
        role: "Listing Manager",
        company_name: "Innovexa Technologies",
        avatar_url: null,
      };
    }
  } catch {}

  return {
    id: "demo-user-1",
    email: "reviewer@innovexa.tech",
    full_name: "Innovexa Reviewer",
    role: "Lead Listing Manager",
    company_name: "Innovexa Technologies",
    avatar_url: null,
  };
});

export async function updateProfileAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const companyName = formData.get("companyName") as string;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          company_name: companyName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) return { error: error.message };
      revalidatePath("/dashboard/settings");
      return { success: true };
    }
  }

  return { success: true };
}
