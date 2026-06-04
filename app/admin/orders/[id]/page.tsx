import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatINR } from "@/lib/format";
import { updateOrderStatus } from "../actions";
import { regenerateReceipt } from "@/app/checkout/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Order" };

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

async function regenerateAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await regenerateReceipt(id);
}

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", params.id).single();
  if (!order) notFound();

  const { data: items } = await supabaseAdmin.from("order_items").select("*").eq("order_id", params.id);

  return (
    <section className="site-wrap py-12">
      <Link href="/admin/orders" className="text-sm text-sage-deep underline">Back to orders</Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">Order #{String(order.id).slice(0, 8).toUpperCase()}</h1>
          <p className="mt-1 text-ink-soft">Placed on {new Date(order.created_at as string).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        {order.receipt_url && (
          <a href={order.receipt_url as string} target="_blank" rel="noreferrer" className="btn-ghost">Download Receipt</a>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-xl2 border border-line bg-white p-6">
            <h2 className="text-lg">Customer</h2>
            <div className="mt-3 space-y-1 text-sm">
              <div>{order.customer_name}</div>
              <div className="text-ink-soft">Phone: {order.phone}</div>
              <div className="text-ink-soft">{order.address}</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl2 border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-deep text-ink-soft">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(items ?? []).map((it) => (
                  <tr key={it.id} className="border-t border-line">
                    <td className="p-4">{it.name}</td>
                    <td className="p-4">{it.qty}</td>
                    <td className="p-4">{formatINR(it.price as number)}</td>
                    <td className="p-4">{formatINR((it.price as number) * (it.qty as number))}</td>
                  </tr>
                ))}
                {(order.discount as number) > 0 && (
                  <>
                    <tr className="border-t border-line">
                      <td colSpan={3} className="p-4 text-right text-ink-soft">Subtotal</td>
                      <td className="p-4 text-ink-soft">{formatINR(Number(order.subtotal ?? (order.total as number) + (order.discount as number)))}</td>
                    </tr>
                    <tr className="border-t border-line">
                      <td colSpan={3} className="p-4 text-right text-sage-deep">Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</td>
                      <td className="p-4 text-sage-deep">-{formatINR(order.discount as number)}</td>
                    </tr>
                  </>
                )}
                <tr className="border-t border-line bg-cream-deep">
                  <td colSpan={3} className="p-4 text-right font-semibold">Total</td>
                  <td className="p-4 font-semibold">{formatINR(order.total as number)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <aside className="h-fit space-y-4">
          <div className="rounded-xl2 border border-line bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Status</h3>
            <div className="mt-2 text-sm text-ink-soft">Current: <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs font-medium capitalize text-sage-deep">{order.status as string}</span></div>
            <form action={updateOrderStatus} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={order.id as string} />
              <select name="status" defaultValue={order.status as string} className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 capitalize outline-none focus:border-sage-deep">
                {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
              <button className="btn-primary w-full text-center">Update Status</button>
            </form>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Payment</h3>
            <div className="mt-3 space-y-1 text-sm">
              <div className="text-ink-soft">Razorpay Payment ID</div>
              <div className="break-all font-mono text-xs">{order.razorpay_payment_id || "-"}</div>
              <div className="mt-2 text-ink-soft">Razorpay Order ID</div>
              <div className="break-all font-mono text-xs">{order.razorpay_order_id || "-"}</div>
            </div>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Receipt</h3>
            <p className="mt-2 text-xs text-ink-soft">{order.receipt_url ? "Receipt PDF stored. Use the button above to download." : "No receipt PDF yet - click below to generate."}</p>
            <form action={regenerateAction} className="mt-3">
              <input type="hidden" name="id" value={order.id as string} />
              <button className="btn-ghost w-full text-center">{order.receipt_url ? "Regenerate Receipt" : "Generate Receipt"}</button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}
