"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function signUp(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const fullName = String(formData.get("name") || "");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }
  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signIn(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }
  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

const siteUrl = "https://www.rramesharts.com";

export async function requestPasswordReset(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const email = String(formData.get("email"));

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: siteUrl + "/reset-password",
  });

  if (error) {
    redirect("/forgot-password?error=" + encodeURIComponent(error.message));
  }
  redirect("/forgot-password?sent=1");
}

export async function updatePassword(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const password = String(formData.get("password"));
  const confirm = String(formData.get("confirm"));

  if (password !== confirm) {
    redirect("/reset-password?error=" + encodeURIComponent("Passwords do not match."));
  }
  if (password.length < 6) {
    redirect("/reset-password?error=" + encodeURIComponent("Password must be at least 6 characters."));
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/reset-password?error=" + encodeURIComponent(error.message));
  }

  await supabase.auth.signOut();
  redirect("/login?message=" + encodeURIComponent("Password updated. Please log in with your new password."));
}
