import { updatePassword } from "../auth/actions";
import PasswordInput from "@/components/PasswordInput";

export const metadata = { title: "Reset Password — R. Ramesh Arts Studio" };
const field =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="grid min-h-[70vh] place-items-center px-6 py-16">
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
