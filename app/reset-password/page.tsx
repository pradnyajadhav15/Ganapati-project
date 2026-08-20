import Link from "next/link";
import { updatePassword } from "../auth/actions";
import PasswordInput from "@/components/PasswordInput";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = { title: "Reset Password — R. Ramesh Arts Studio" };
const field =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  // Reaching this page with no session means the recovery link never produced
  // one — it was already used, it expired, or it was opened in a different
  // browser than the one that requested it. Say so, instead of showing a form
  // whose submit can only fail with "Auth session missing!".
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="grid min-h-panel place-items-center px-6 py-16">
        <div className="w-full max-w-sm rounded-xl2 border border-line bg-white p-8 text-center shadow-soft">
          <h1 className="text-3xl">Link Expired</h1>
          <p className="mb-6 mt-3 text-sm leading-relaxed text-ink-soft">
            This password reset link is no longer valid. Reset links work once and
            expire after a short while, and they need to be opened in the same
            browser you requested them from.
          </p>
          <Link href="/forgot-password" className="btn-primary w-full text-center">
            Request a New Link
          </Link>
          <p className="mt-5 text-sm text-ink-soft">
            <Link href="/login" className="font-semibold text-sage-deep underline">
              Back to Log In
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid min-h-panel place-items-center px-6 py-16">
      <form
        action={updatePassword}
        className="w-full max-w-sm rounded-xl2 border border-line bg-white p-8 shadow-soft"
      >
        <h1 className="text-center text-3xl">Set a New Password</h1>
        <p className="mb-6 mt-1 text-center text-sm text-ink-soft">
          Choose a new password for your account.
        </p>
        <div className="space-y-4">
          <PasswordInput name="password" required minLength={6} placeholder="New password" className={field} />
          <PasswordInput name="confirm" required minLength={6} placeholder="Confirm new password" className={field} />
        </div>
        {searchParams?.error && (
          <p className="mt-3 text-sm text-red-600">{searchParams.error}</p>
        )}
        <button type="submit" className="btn-primary mt-5 w-full text-center">
          Update Password
        </button>
      </form>
    </section>
  );
}
