import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CheckoutForm from "@/components/CheckoutForm";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout — R. Ramesh Arts Studio" };

export default async function CheckoutPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const t = getDict(getLocale());

  if (!user) {
    return (
      <section className="site-wrap py-24 text-center">
        <h1 className="text-3xl">{t.pleaseLogIn}</h1>
        <p className="mt-2 text-ink-soft">{t.cartSaved}</p>
        <Link href="/login" className="btn-primary mt-6 inline-block">{t.logIn}</Link>
      </section>
    );
  }

  const defaultName = (user.user_metadata?.full_name as string) || "";
  return <CheckoutForm defaultName={defaultName} />;
}