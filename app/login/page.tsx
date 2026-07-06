import Link from "next/link";
import { signIn } from "../auth/actions";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";
import PasswordInput from "@/components/PasswordInput";

export const metadata = { title: "Log In — R. Ramesh Arts Studio" };
const field =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  const t = getDict(getLocale());

  return (
    <section className="grid min-h-[70vh] place-items-center px-6 py-16">
      <form
        action={signIn}
        className="w-full max-w-sm rounded-xl2 border border-line bg-white p-8 shadow-soft"
      >
        <h1 className="text-center text-3xl">{t.welcomeBack}</h1>
        <p className="mb-6 mt-1 text-center text-sm text-ink-soft">
          {t.loginToAccount}
        </p>
        <div className="space-y-4">
          <input name="email" type="email" required placeholder={t.emailPlaceholder} className={field} />
          <PasswordInput name="password" required placeholder={t.passwordPlaceholder} className={field} />
        </div>
        <p className="mt-2 text-right text-sm">
          <Link href="/forgot-password" className="text-sage-deep underline">
            Forgot password?
          </Link>
        </p>
        {searchParams?.message && (
          <p className="mt-3 text-sm text-sage-deep">{searchParams.message}</p>
        )}
        {searchParams?.error && (
          <p className="mt-3 text-sm text-red-600">{searchParams.error}</p>
        )}
        <button type="submit" className="btn-primary mt-5 w-full text-center">
          {t.logIn}
        </button>
        <p className="mt-5 text-center text-sm text-ink-soft">
          {t.newHere}{" "}
          <Link href="/signup" className="font-semibold text-sage-deep underline">
            {t.createAccount}
          </Link>
        </p>
      </form>
    </section>
  );
}
