import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Only ever redirect to a path on this site. Without this, a crafted
// ?next=https://example.com would turn this route into an open redirect.
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

/**
 * Landing route for every emailed auth link (password recovery, email
 * confirmation, magic links). Its job is to turn the one-time credential in
 * the URL into a real session cookie before handing off to `next`.
 *
 * Supabase sends one of two shapes depending on the email template:
 *   ?code=...                  PKCE — the default templates
 *   ?token_hash=...&type=...   templates using {{ .TokenHash }}
 * Both are handled so the flow survives a template change.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  const supabase = createSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(
    new URL(
      "/login?error=" +
        encodeURIComponent("That link is invalid or has expired. Please request a new one."),
      origin
    )
  );
}
