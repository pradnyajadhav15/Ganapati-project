"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
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

/**
 * Where Supabase should send the user back to. A hardcoded production URL
 * breaks local development and preview deployments — the emailed link would
 * always bounce to the live site — so derive it from the request, with an
 * env override for cases where the public URL differs from the request host.
 *
 * Whatever this resolves to must also be listed under
 * Supabase → Authentication → URL Configuration → Redirect URLs,
 * otherwise Supabase refuses the redirect.
 */
function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  const h = headers();
  const origin = h.get("origin");
  if (origin) return origin;

  const host = h.get("host") ?? "www.rramesharts.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return proto + "://" + host;
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const email = String(formData.get("email"));

  // Land on /auth/confirm, not /reset-password: the recovery link carries a
  // one-time code that has to be exchanged for a session cookie before the
  // user can change their password. /reset-password cannot do that itself —
  // it is a page, and only a route handler can write the cookie.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getSiteUrl() + "/auth/confirm?next=/reset-password",
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
