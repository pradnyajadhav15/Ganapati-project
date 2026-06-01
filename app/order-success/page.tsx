import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order Confirmed - R. Ramesh Arts Studio" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const supabase = createSupabaseServerClient();
  const id = searchParams.id;

  const { data: order } = id
    ? await supabase.from("orders").select("*").eq("id", id).single()
    : { data: null };
  const { data: items } = id
    ? await supabase.from("order_items").select("*").eq("order_id", id)
    : { data: [] };

  return (
    <section className="site-wrap py-20">
      <div className="mx-auto max-w-lg rounded-xl border border-line bg-white p-8 text-center shadow-soft">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-sage text-3xl">
          &#10003;
        </div>
        <h1 className="text-3xl">Thank you!</h1>
        <p className="mt-2 text-ink-soft">
          Your order has been placed.
          {order ? ` Order #${String(order.id).slice(0, 8)}` : ""}
        </p>

        {items && items.length > 0 && (
          <div className="mt-6 space-y-2 text-left text-sm">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between">
                <span className="text-ink-soft">
                  {it.name} x {it.qty}
                </span>
                <span>{formatINR(it.price * it.qty)}</span>
              </div>
            ))}
            {order && (
              <div className="flex justify-between border-t border-line pt-2 font-semibold">
                <span>Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {order?.receipt_url && (
            <a
              href={order.receipt_url as string}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              Download Receipt
            </a>
          )}
          <Link href="/account" className="btn-ghost">
            View My Orders
          </Link>
          <Link href="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
