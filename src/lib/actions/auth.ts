"use server";

import { createClient, getAuthUser } from "@/lib/supabase/server";
import { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cache } from "react";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder") && !url.includes("innovexa-demo"));
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rememberMe = formData.get("rememberMe") === "on";

  const validation = loginSchema.safeParse({ email, password, rememberMe });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid input" };
  }

  if (!isSupabaseConfigured()) {
    // Demo environment login
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signupAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
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

  if (!isSupabaseConfigured()) {
    // Demo environment signup
    return { success: true, message: "Account created! You can now log in." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If user signed up with auto-confirm enabled, seed demo data for them
  if (data.user) {
    try {
      await supabase.rpc("seed_demo_data_for_user", { target_user_id: data.user.id });
    } catch {
      // Ignored if RPC is not loaded yet
    }
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: "Registration successful! Please check your email for confirmation or log in.",
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
