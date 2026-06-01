import Link from "next/link";
import { signUp } from "../auth/actions";

export const metadata = { title: "Sign Up — R. Ramesh Arts Studio" };
const field =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="grid min-h-[70vh] place-items-center px-6 py-16">
      <form
        action={signUp}
        className="w-full max-w-sm rounded-xl2 border border-line bg-white p-8 shadow-soft"
      >
        <h1 className="text-center text-3xl">Create account</h1>
        <p className="mb-6 mt-1 text-center text-sm text-ink-soft">
          Join R. Ramesh Arts Studio
        </p>
        <div className="space-y-4">
          <input name="name" type="text" placeholder="Full name" className={field} />
          <input name="email" type="email" required placeholder="Email" className={field} />
          <input name="password" type="password" required minLength={6} placeholder="Password (min 6 chars)" className={field} />
        </div>
        {searchParams?.error && (
          <p className="mt-3 text-sm text-red-600">{searchParams.error}</p>
        )}
        <button type="submit" className="btn-primary mt-5 w-full text-center">
          Sign Up
        </button>
        <p className="mt-5 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-sage-deep underline">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}