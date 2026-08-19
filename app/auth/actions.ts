"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendPasswordResetEmail } from "@/lib/email";

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
  const email = String(formData.get("email")).trim();
  const siteUrl = getSiteUrl();

  // Mint the recovery token ourselves and mail it from our own domain.
  //
  // Supabase's resetPasswordForEmail routes the user through its /verify
  // endpoint, which then redirects to whatever the project's Site URL and
  // redirect allow list resolve to. That is dashboard configuration this app
  // cannot set, and when it is wrong the user is sent somewhere they cannot
  // finish the reset. Building the link here keeps the destination ours.
  //
  // /auth/confirm turns the token_hash into a session, then forwards to the
  // password form.
  let delivered = false;
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  if (error) {
    // Includes the ordinary "no such user" case, which must stay invisible to
    // the caller — see the redirect at the end.
    console.warn("generateLink(recovery) failed:", error.message);
  }

  const tokenHash = data?.properties?.hashed_token;
  if (!error && tokenHash) {
    const resetUrl =
      siteUrl +
      "/auth/confirm?token_hash=" +
      encodeURIComponent(tokenHash) +
      "&type=recovery&next=" +
      encodeURIComponent("/reset-password");
    delivered = await sendPasswordResetEmail({ to: email, resetUrl });
  }

  // Fall back to Supabase's own mailer if we could not send — better a link
  // that may land awkwardly than no email at all.
  if (!delivered) {
    console.warn("Falling back to Supabase recovery mail for", email);
    const supabase = createSupabaseServerClient();
    const { error: fallbackError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: siteUrl + "/auth/confirm?next=/reset-password" }
    );
    if (fallbackError) {
      console.error("Fallback recovery mail also failed:", fallbackError.message);
    }
  }

  // Always report the same result. Telling the visitor whether an account
  // exists would let anyone probe the customer list for valid addresses.
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
