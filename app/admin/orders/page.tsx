import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatINR } from "@/lib/format";
import OrderRowActions from "@/components/OrderRowActions";
import RowProgressSelect from "@/components/RowProgressSelect";
import { bulkSetProgress } from "./bulk-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Orders" };

const methodLabel: Record<string, string> = { razorpay: "Online", upi: "UPI", cod: "COD" };
const payColor: Record<string, string> = { unpaid: "bg-rose text-ink", paid: "bg-sage text-white", refunded: "bg-cream-deep text-ink-soft" };
const progColor: Record<string, string> = { new: "bg-peach text-ink", confirmed: "bg-sage/20 text-sage-deep", in_production: "bg-gold/20 text-ink", ready: "bg-sage/20 text-sage-deep", out_for_delivery: "bg-peach text-ink", delivered: "bg-sage-deep text-white", cancelled: "bg-rose text-ink" };
const progLabel: Record<string, string> = { new: "New", confirmed: "Confirmed", in_production: "In production", ready: "Ready", out_for_delivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled" };

const STUCK_DAYS = 7;
function needsAttention(o: any): boolean {
  const prog = (o.progress_status as string) ?? "new";
  if (prog === "cancelled") return false;
  if (o.payment_status === "unpaid") return true;
  if (prog !== "delivered" && prog !== "in_production") {
    const ageDays = (Date.now() - new Date(o.created_at as string).getTime()) / 86400000;
    if (ageDays > STUCK_DAYS) return true;
  }
  return false;
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in_production", label: "In production" },
  { key: "ready", label: "Ready" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "unpaid", label: "Unpaid" },
  { key: "attention", label: "Needs attention" },
];

export default async function AdminOrdersPage({ searchParams }: { searchParams: { archived?: string; view?: string; q?: string } }) {
  const showArchived = searchParams?.archived === "1";
  const view = typeof searchParams?.view === "string" ? searchParams.view : "all";
  const q = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";

  const { data } = await supabaseAdmin
    .from("orders")
    .select("id,customer_name,phone,total,discount,coupon_code,payment_method,payment_status,progress_status,invoice_no,created_at")
    .eq("archived", showArchived)
    .order("created_at", { ascending: false });
  const all = (data ?? []) as any[];

  const counts: Record<string, number> = { new: 0, confirmed: 0, in_production: 0, ready: 0, out_for_delivery: 0, delivered: 0, cancelled: 0, unpaid: 0, attention: 0 };
  for (const o of all) {
    const p = (o.progress_status as string) ?? "new";
    counts[p] = (counts[p] ?? 0) + 1;
    if (o.payment_status === "unpaid" && p !== "cancelled") counts.unpaid++;
    if (needsAttention(o)) counts.attention++;
  }
  const now = new Date();
  const revenue = all
    .filter((o) => o.payment_status === "paid" && new Date(o.created_at as string).getMonth() === now.getMonth() && new Date(o.created_at as string).getFullYear() === now.getFullYear())
    .reduce((s, o) => s + Number(o.total || 0), 0);

  let rows = all;
  if (q) {
    const qq = q.toLowerCase();
    rows = all.filter((o) => (o.customer_name || "").toLowerCase().includes(qq) || (o.phone || "").includes(q) || String(o.id).toLowerCase().includes(qq));
  } else if (view === "unpaid") {
    rows = all.filter((o) => o.payment_status === "unpaid" && ((o.progress_status as string) ?? "new") !== "cancelled");
  } else if (view === "attention") {
    rows = all.filter((o) => needsAttention(o));
  } else if (view !== "all") {
    rows = all.filter((o) => ((o.progress_status as string) ?? "new") === view);
  }

  return (
    <section className="site-wrap py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">{showArchived ? "Archived orders" : "Orders"}</h1>
          {showArchived ? (
            <p className="text-ink-soft">{all.length} archived</p>
          ) : (
            <p className="text-ink-soft">{all.length} active · {formatINR(revenue)} collected this month{counts.attention > 0 ? " · " + counts.attention + " need attention" : ""}</p>
          )}
        </div>
        <div className="flex gap-3">
          {showArchived ? (
            <Link href="/admin/orders" className="btn-ghost">Active orders</Link>
          ) : (
            <Link href="/admin/orders?archived=1" className="btn-ghost">Archived</Link>
          )}
          <Link href="/admin/today" className="btn-ghost">Today</Link>
          <a href="/admin/orders/export" className="btn-ghost">Export CSV</a>
          <Link href="/admin" className="btn-ghost">Products</Link>
        </div>
      </div>

      {!showArchived && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = view === f.key && !q;
              const count = f.key === "all" ? all.length : counts[f.key] ?? 0;
              return (
                <Link key={f.key} href={f.key === "all" ? "/admin/orders" : "/admin/orders?view=" + f.key} className={"rounded-full border px-3 py-1.5 text-xs font-medium transition " + (active ? "border-sage-deep bg-sage-deep text-white" : f.key === "attention" && count > 0 ? "border-terracotta/40 bg-peach text-terracotta hover:bg-peach/80" : "border-line bg-white text-ink-soft hover:bg-cream-deep")}>
                  {f.label} <span className={active ? "opacity-90" : "font-semibold text-ink"}>{count}</span>
                </Link>
              );
            })}
          </div>

          <form action="/admin/orders" className="mb-4">
            <input name="q" defaultValue={q} placeholder="Search by name, phone, or order #" className="w-full max-w-sm rounded-xl border border-line bg-white px-4 py-2 text-sm outline-none focus:border-sage-deep" />
          </form>

          <form id="bulkForm" action={bulkSetProgress} className="mb-6 flex flex-wrap items-center gap-2 rounded-xl2 border border-line bg-cream-deep px-4 py-3">
            <span className="text-sm text-ink-soft">Tick orders below, choose a stage, then apply:</span>
            <select name="value" defaultValue="confirmed" className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-sage-deep">
              <option value="new">New</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_production">In production</option>
              <option value="ready">Ready</option>
              <option value="out_for_delivery">Out for delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn-primary px-4 py-1.5 text-sm">Apply to selected</button>
          </form>
        </>
      )}

      <div className="overflow-hidden rounded-xl2 border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-deep text-ink-soft">
            <tr>
              <th className="w-8 p-4"></th>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Progress</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className={"border-t border-line " + (needsAttention(o) ? "bg-peach/40" : "")}>
                <td className="p-4">{!showArchived && (<input type="checkbox" name="ids" value={o.id as string} form="bulkForm" className="h-4 w-4 accent-sage-deep" />)}</td>
                <td className="p-4 font-mono text-xs">{(o.invoice_no as string) || ("#" + String(o.id).slice(0, 8).toUpperCase())}</td>
                <td className="p-4">
                  <div className="font-medium">{o.customer_name || "-"}</div>
                  <div className="text-xs text-ink-soft">{o.phone || ""}</div>
                </td>
                <td className="p-4 text-ink-soft">{new Date(o.created_at as string).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td className="p-4">
                  {formatINR(o.total as number)}
                  {(o.discount as number) > 0 && (
                    <div className="text-[11px] font-normal text-sage-deep">{o.coupon_code as string} (-{formatINR(o.discount as number)})</div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-xs text-ink-soft">{methodLabel[o.payment_method as string] ?? "-"}</div>
                  <span className={"mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize " + (payColor[o.payment_status as string] ?? "bg-cream-deep text-ink-soft")}>{(o.payment_status as string) ?? "unpaid"}</span>
                </td>
                <td className="p-4">
                  <span className={"rounded-full px-2.5 py-1 text-xs font-medium " + (progColor[o.progress_status as string] ?? "bg-cream-deep text-ink-soft")}>{progLabel[o.progress_status as string] ?? "New"}</span>
                  {needsAttention(o) && (<div className="mt-1 text-[11px] font-medium text-terracotta">Needs attention</div>)}
                  <div className="mt-2"><RowProgressSelect id={o.id as string} current={(o.progress_status as string) ?? "new"} /></div>
                </td>
                <td className="p-4 text-right">
                  <OrderRowActions id={o.id as string} archived={showArchived} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-ink-soft">{showArchived ? "No archived orders." : q ? "No orders match your search." : "No orders here."}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
