import Link from "next/link";
import { requestPasswordReset } from "../auth/actions";

export const metadata = { title: "Forgot Password — R. Ramesh Arts Studio" };
const field =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { sent?: string; error?: string };
}) {
  return (
    <section className="grid min-h-[70vh] place-items-center px-6 py-16">
      <div className="w-full max-w-sm rounded-xl2 border border-line bg-white p-8 shadow-soft">
        <h1 className="text-center text-3xl">Forgot Password</h1>
        <p className="mb-6 mt-1 text-center text-sm text-ink-soft">
          Enter your email and we will send you a link to reset your password.
        </p>

        {searchParams?.sent ? (
          <p className="rounded-xl border border-sage-deep bg-cream px-4 py-3 text-center text-sm text-ink">
            Check your email for a password reset link. It may take a minute to arrive — please check spam too.
          </p>
        ) : (
          <form action={requestPasswordReset} className="space-y-4">
            <input name="email" type="email" required placeholder="Email" className={field} />
            {searchParams?.error && (
              <p className="text-sm text-red-600">{searchParams.error}</p>
            )}
            <button type="submit" className="btn-primary w-full text-center">
              Send Reset Link
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-ink-soft">
          <Link href="/login" className="font-semibold text-sage-deep underline">
            Back to Log In
          </Link>
        </p>
      </div>
    </section>
  );
}
