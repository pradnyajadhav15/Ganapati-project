import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Overview" };

const STUCK_DAYS = 7;

// Same rule the orders and today screens use, so the counts agree everywhere.
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

const progLabel: Record<string, string> = {
  new: "New",
  confirmed: "Confirmed",
  in_production: "In production",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default async function AdminOverviewPage() {
  const [ordersRes, messagesRes, bookingsRes, productsRes] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("id,customer_name,phone,total,payment_status,progress_status,invoice_no,created_at")
      .eq("archived", false)
      .order("created_at", { ascending: false }),
    supabaseAdmin.from("contact_messages").select("id,is_read"),
    supabaseAdmin.from("bookings").select("id,status"),
    supabaseAdmin.from("products").select("id,name,size,in_stock"),
  ]);

  const orders = (ordersRes.data ?? []) as any[];
  const messages = (messagesRes.data ?? []) as any[];
  const bookings = (bookingsRes.data ?? []) as any[];
  const products = (productsRes.data ?? []) as any[];

  const attention = orders.filter(needsAttention);
  const unpaid = orders.filter(
    (o) => o.payment_status === "unpaid" && ((o.progress_status as string) ?? "new") !== "cancelled"
  );
  const unread = messages.filter((m) => !m.is_read).length;
  const pendingBookings = bookings.filter((b) => (b.status ?? "pending") === "pending").length;
  const soldOut = products.filter((p) => !p.in_stock);

  const now = new Date();
  const paidThisMonth = orders.filter(
    (o) =>
      o.payment_status === "paid" &&
      new Date(o.created_at as string).getMonth() === now.getMonth() &&
      new Date(o.created_at as string).getFullYear() === now.getFullYear()
  );
  const revenue = paidThisMonth.reduce((s, o) => s + Number(o.total || 0), 0);

  const inFlight = orders.filter((o) => {
    const p = (o.progress_status as string) ?? "new";
    return p !== "delivered" && p !== "cancelled";
  });

  const monthLabel = now.toLocaleString("en-IN", { month: "long" });

  return (
    <section className="site-wrap py-10">
      <div className="mb-8">
        <h1 className="text-3xl">Overview</h1>
        <p className="text-ink-soft">Everything that needs you, in one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Needs attention" value={attention.length} href="/admin/orders?view=attention"
              tone={attention.length > 0 ? "alert" : "calm"} hint="Unpaid, or sitting too long" />
        <Stat label="Unpaid orders" value={unpaid.length} href="/admin/orders?view=unpaid"
              tone={unpaid.length > 0 ? "warn" : "calm"} hint="Payment not recorded" />
        <Stat label="Orders in flight" value={inFlight.length} href="/admin/orders"
              tone="calm" hint="Not delivered or cancelled" />
        <Stat label={"Revenue · " + monthLabel} value={formatINR(revenue)} href="/admin/orders"
              tone="calm" hint={paidThisMonth.length + " paid orders"} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Stat label="Unread messages" value={unread} href="/admin/messages"
              tone={unread > 0 ? "warn" : "calm"} hint="From the contact form" compact />
        <Stat label="Pre-bookings pending" value={pendingBookings} href="/admin/bookings"
              tone={pendingBookings > 0 ? "warn" : "calm"} hint="Awaiting confirmation" compact />
        <Stat label="Sold-out idols" value={soldOut.length} href="/admin"
              tone="calm" hint="Hidden from customers" compact />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl2 border border-line bg-white p-6">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-xl">Needs attention</h2>
            <Link href="/admin/orders?view=attention" className="text-sm text-sage-deep underline">
              Open in orders
            </Link>
          </div>
          {attention.length === 0 ? (
            <p className="text-sm text-ink-soft">Nothing waiting. Every order is paid and moving.</p>
          ) : (
            <ul className="divide-y divide-line">
              {attention.slice(0, 8).map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-ink-soft">
                      {o.invoice_no || "#" + String(o.id).slice(0, 8).toUpperCase()}
                    </div>
                    <div className="font-medium">{o.customer_name || "—"}</div>
                    <div className="text-xs text-ink-soft">
                      {progLabel[(o.progress_status as string) ?? "new"]} ·{" "}
                      {o.payment_status === "unpaid" ? "Unpaid" : "Paid"} ·{" "}
                      {formatINR(Number(o.total || 0))}
                    </div>
                  </div>
                  <Link href={"/admin/orders/" + o.id} className="text-sm text-sage-deep underline">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {attention.length > 8 && (
            <p className="mt-3 text-xs text-ink-soft">and {attention.length - 8} more</p>
          )}
        </div>

        <div className="rounded-xl2 border border-line bg-white p-6">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-xl">Latest orders</h2>
            <Link href="/admin/orders" className="text-sm text-sage-deep underline">All orders</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-ink-soft">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {orders.slice(0, 8).map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="font-medium">{o.customer_name || "—"}</div>
                    <div className="text-xs text-ink-soft">
                      {new Date(o.created_at as string).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {" · "}
                      {progLabel[(o.progress_status as string) ?? "new"]}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatINR(Number(o.total || 0))}</span>
                    <Link href={"/admin/orders/" + o.id} className="text-sm text-sage-deep underline">View</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {soldOut.length > 0 && (
        <div className="mt-6 rounded-xl2 border border-line bg-white p-6">
          <h2 className="mb-3 text-xl">Currently sold out</h2>
          <p className="mb-4 text-sm text-ink-soft">
            These idols show as sold out to customers until you mark them back in stock.
          </p>
          <ul className="flex flex-wrap gap-2">
            {soldOut.map((p) => (
              <li key={p.id} className="rounded-full border border-line bg-cream-deep px-3 py-1.5 text-sm">
                {p.name} {p.size ?? ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, href, hint, tone, compact }: {
  label: string; value: number | string; href: string;
  hint?: string; tone: "alert" | "warn" | "calm"; compact?: boolean;
}) {
  const ring =
    tone === "alert" ? "border-red-200 bg-red-50/60"
    : tone === "warn" ? "border-gold/40 bg-gold/[0.06]"
    : "border-line bg-white";

  return (
    <Link href={href} className={"block rounded-xl2 border p-5 transition-shadow duration-300 hover:shadow-lux " + ring}>
      <div className="text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">{label}</div>
      <div className={"mt-2 font-display tabular-nums leading-none " + (compact ? "text-2xl" : "text-[2rem]")}>
        {value}
      </div>
      {hint && <div className="mt-1.5 text-xs text-ink-soft">{hint}</div>}
    </Link>
  );
}
