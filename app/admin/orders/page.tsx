import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Orders" };

const statusColor: Record<string, string> = {
  pending: "bg-cream-deep text-ink-soft",
  paid: "bg-sage text-white",
  shipped: "bg-peach text-ink",
  delivered: "bg-sage-deep text-white",
  cancelled: "bg-rose text-ink",
};

export default async function AdminOrdersPage() {
  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("id,customer_name,phone,total,status,razorpay_payment_id,receipt_url,created_at")
    .order("created_at", { ascending: false });

  return (
    <section className="site-wrap py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Orders</h1>
          <p className="text-ink-soft">{orders?.length ?? 0} orders</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin" className="btn-ghost">Products</Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl2 border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-deep text-ink-soft">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="p-4 font-mono text-xs">#{String(o.id).slice(0, 8).toUpperCase()}</td>
                <td className="p-4">
                  <div className="font-medium">{o.customer_name || "—"}</div>
                  <div className="text-xs text-ink-soft">{o.phone || ""}</div>
                </td>
                <td className="p-4 text-ink-soft">
                  {new Date(o.created_at as string).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>
                <td className="p-4">{formatINR(o.total as number)}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs capitalize ${
                      statusColor[o.status as string] ?? "bg-cream-deep text-ink-soft"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="text-sage-deep underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-soft">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}