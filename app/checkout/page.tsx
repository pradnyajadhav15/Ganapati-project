import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout — R. Ramesh Arts Studio" };

export default async function CheckoutPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="site-wrap py-24 text-center">
        <h1 className="text-3xl">Please log in to checkout</h1>
        <p className="mt-2 text-ink-soft">Your cart is saved — just sign in and come back.</p>
        <Link href="/login" className="btn-primary mt-6 inline-block">Log In</Link>
      </section>
    );
  }

  const defaultName = (user.user_metadata?.full_name as string) || "";
  return <CheckoutForm defaultName={defaultName} />;
}