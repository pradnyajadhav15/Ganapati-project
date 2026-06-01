import { login } from "../actions";

export const metadata = { title: "Admin Login" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="grid min-h-[70vh] place-items-center px-6">
      <form
        action={login}
        className="w-full max-w-sm rounded-xl2 border border-line bg-white p-8 shadow-soft"
      >
        <h1 className="text-center text-2xl">Admin Login</h1>
        <p className="mb-6 mt-1 text-center text-sm text-ink-soft">
          R. Ramesh Arts Studio
        </p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep"
        />
        {searchParams?.error && (
          <p className="mt-2 text-sm text-red-600">Wrong password. Try again.</p>
        )}
        <button type="submit" className="btn-primary mt-5 w-full text-center">
          Log In
        </button>
      </form>
    </section>
  );
}
