import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatINR } from "@/lib/format";
import RowProgressSelect from "@/components/RowProgressSelect";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Today" };

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

function OrderLine({ o, items }: { o: any; items: any[] }) {
  const id = o.id as string;
  const idLabel = (o.invoice_no as string) || ("#" + String(id).slice(0, 8).toUpperCase());
  const phone = String(o.phone || "").replace(/\D/g, "").slice(-10);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
      <div className="flex min-w-0 items-center gap-3">
        {items.length > 0 && (
          <div className="flex flex-none -space-x-2">
            {items.slice(0, 3).map((it) => (
              <div
                key={it.id}
                title={it.qty > 1 ? it.qty + " x " + it.name : it.name}
                className="relative h-10 w-10 overflow-hidden rounded-lg border-2 border-white bg-cream-deep shadow-sm"
              >
                {it.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={it.image_url as string} alt={it.name as string} className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-sm" aria-hidden="true">🪔</span>
                )}
                {it.qty > 1 && (
                  <span className="absolute bottom-0 right-0 rounded-tl bg-ink/85 px-1 text-[0.6rem] font-semibold leading-tight text-cream">
                    {it.qty}
                  </span>
                )}
              </div>
            ))}
            {items.length > 3 && (
              <div className="grid h-10 w-10 flex-none place-items-center rounded-lg border-2 border-white bg-cream-deep text-[0.7rem] font-semibold text-ink-soft shadow-sm">
                +{items.length - 3}
              </div>
            )}
          </div>
        )}
        <div className="min-w-0">
          <div className="font-mono text-xs text-ink-soft">{idLabel}</div>
          <div className="font-medium">{o.customer_name || "-"}</div>
          <div className="text-xs text-ink-soft">{o.phone || ""} · {formatINR(o.total as number)}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-40"><RowProgressSelect id={id} current={(o.progress_status as string) ?? "new"} /></div>
        {phone && <a href={"https://wa.me/91" + phone} target="_blank" rel="noreferrer" className="rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-semibold text-white">WhatsApp</a>}
        <Link href={"/admin/orders/" + id} className="text-xs text-sage-deep underline">View</Link>
      </div>
    </div>
  );
}

function Bucket({ title, accent, orders, itemsByOrder }: { title: string; accent: string; orders: any[]; itemsByOrder: Map<string, any[]> }) {
  return (
    <div className="rounded-xl2 border border-line bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg">{title}</h2>
        <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + accent}>{orders.length}</span>
      </div>
      {orders.length === 0 ? (
        <p className="py-3 text-sm text-ink-soft">Nothing here right now.</p>
      ) : (
        <div>{orders.map((o) => (<OrderLine key={o.id} o={o} items={itemsByOrder.get(o.id) ?? []} />))}</div>
      )}
    </div>
  );
}

export default async function AdminTodayPage() {
  const { data } = await supabaseAdmin
    .from("orders")
    .select("id,customer_name,phone,total,payment_status,progress_status,invoice_no,created_at")
    .eq("archived", false)
    .order("created_at", { ascending: false });
  const all = (data ?? []) as any[];

  // One query for every visible order, rather than one per row.
  const itemsByOrder = new Map<string, any[]>();
  if (all.length) {
    const { data: itemRows } = await supabaseAdmin
      .from("order_items")
      .select("id,order_id,name,qty,image_url")
      .in("order_id", all.map((o) => o.id as string));
    for (const row of (itemRows ?? []) as any[]) {
      const list = itemsByOrder.get(row.order_id as string);
      if (list) list.push(row);
      else itemsByOrder.set(row.order_id as string, [row]);
    }
  }

  const prog = (o: any) => (o.progress_status as string) ?? "new";
  const newOrders = all.filter((o) => prog(o) === "new");
  const toMake = all.filter((o) => prog(o) === "confirmed" || prog(o) === "in_production");
  const toDeliver = all.filter((o) => prog(o) === "ready" || prog(o) === "out_for_delivery");
  const attention = all.filter((o) => needsAttention(o));

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="site-wrap py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Today</h1>
          <p className="text-ink-soft">{today}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/orders" className="btn-ghost">All orders</Link>
          <Link href="/admin" className="btn-ghost">Products</Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Bucket title="New - confirm these" accent="bg-peach text-ink" itemsByOrder={itemsByOrder} orders={newOrders} />
        <Bucket title="To make" accent="bg-gold/30 text-ink" itemsByOrder={itemsByOrder} orders={toMake} />
        <Bucket title="To deliver" accent="bg-sage/20 text-sage-deep" itemsByOrder={itemsByOrder} orders={toDeliver} />
        <Bucket title="Needs attention" accent="bg-rose text-ink" itemsByOrder={itemsByOrder} orders={attention} />
      </div>
    </section>
  );
}
