import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatINR } from "@/lib/format";
import { regenerateReceipt } from "@/app/checkout/actions";
import { setPaymentStatus, setProgressStatus, saveOrderNotes } from "../status-actions";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Order" };

const PROGRESS = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_production", label: "In production" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];
const PAYMENTS = [
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];
const payColor: Record<string, string> = { unpaid: "bg-rose text-ink", paid: "bg-sage text-white", refunded: "bg-cream-deep text-ink-soft" };
const progColor: Record<string, string> = { new: "bg-peach text-ink", confirmed: "bg-sage/20 text-sage-deep", in_production: "bg-gold/20 text-ink", ready: "bg-sage/20 text-sage-deep", out_for_delivery: "bg-peach text-ink", delivered: "bg-sage-deep text-white", cancelled: "bg-rose text-ink" };

/* PHASE4_NOTIFY_I18N — customer notify messages in en/hi/mr (review wording freely) */
function buildNotices(locale: string, firstName: string, shortId: string) {
  const f = firstName;
  const id = shortId;
  const M: Record<string, { cLabel: string; oLabel: string; dLabel: string; xLabel: string; subject: string; confirmed: string; out: string; delivered: string; cancelled: string }> = {
    en: {
      cLabel: "Order confirmed",
      oLabel: "Out for delivery",
      dLabel: "Delivered",
      xLabel: "Cancelled",
      subject: "Update on your order " + id,
      confirmed: "Hi " + f + ", your order " + id + " with R. Ramesh Arts Studio is confirmed and we have started preparing it. Thank you!",
      out: "Hi " + f + ", your order " + id + " is out for delivery today. Please keep your phone reachable.",
      delivered: "Hi " + f + ", your order " + id + " has been delivered. Thank you for choosing R. Ramesh Arts Studio!",
      cancelled: "Hi " + f + ", your order " + id + " with R. Ramesh Arts Studio has been cancelled. If this was not expected or you have any questions, please reply here and we will be glad to help.",
    },
    hi: {
      cLabel: "ऑर्डर पुष्ट",
      oLabel: "डिलीवरी के लिए रवाना",
      dLabel: "डिलीवर हो गया",
      xLabel: "रद्द",
      subject: "आपके ऑर्डर " + id + " की जानकारी",
      confirmed: "नमस्ते " + f + ", R. Ramesh Arts Studio में आपका ऑर्डर " + id + " पुष्ट हो गया है और हमने उसे तैयार करना शुरू कर दिया है। धन्यवाद!",
      out: "नमस्ते " + f + ", आपका ऑर्डर " + id + " आज डिलीवरी के लिए निकल गया है। कृपया अपना फ़ोन चालू रखें।",
      delivered: "नमस्ते " + f + ", आपका ऑर्डर " + id + " डिलीवर कर दिया गया है। R. Ramesh Arts Studio चुनने के लिए धन्यवाद!",
      cancelled: "नमस्ते " + f + ", R. Ramesh Arts Studio में आपका ऑर्डर " + id + " रद्द कर दिया गया है। यदि यह अपेक्षित नहीं था या कोई सवाल हो, तो कृपया यहाँ उत्तर दें — हम मदद के लिए तैयार हैं।",
    },
    mr: {
      cLabel: "ऑर्डर निश्चित",
      oLabel: "डिलिव्हरीसाठी रवाना",
      dLabel: "डिलिव्हर झाले",
      xLabel: "रद्द",
      subject: "तुमच्या ऑर्डर " + id + " ची माहिती",
      confirmed: "नमस्कार " + f + ", R. Ramesh Arts Studio मधील तुमची ऑर्डर " + id + " निश्चित झाली आहे आणि आम्ही ती तयार करायला सुरुवात केली आहे. धन्यवाद!",
      out: "नमस्कार " + f + ", तुमची ऑर्डर " + id + " आज डिलिव्हरीसाठी निघाली आहे. कृपया तुमचा फोन सुरू ठेवा.",
      delivered: "नमस्कार " + f + ", तुमची ऑर्डर " + id + " डिलिव्हर करण्यात आली आहे. R. Ramesh Arts Studio निवडल्याबद्दल धन्यवाद!",
      cancelled: "नमस्कार " + f + ", R. Ramesh Arts Studio मधील तुमची ऑर्डर " + id + " रद्द करण्यात आली आहे. हे अपेक्षित नव्हते किंवा काही प्रश्न असल्यास, कृपया येथे उत्तर द्या — आम्ही मदतीसाठी तयार आहोत.",
    },
  };
  const d = M[locale] ?? M.en;
  return [
    { key: "confirmed", label: d.cLabel, subject: d.subject, msg: d.confirmed },
    { key: "out", label: d.oLabel, subject: d.subject, msg: d.out },
    { key: "delivered", label: d.dLabel, subject: d.subject, msg: d.delivered },
    { key: "cancelled", label: d.xLabel, subject: d.subject, msg: d.cancelled },
  ];
}

async function regenerateAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await regenerateReceipt(id);
  revalidatePath("/admin/orders/" + id);
}

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", params.id).single();
  if (!order) notFound();

  const { data: items } = await supabaseAdmin.from("order_items").select("*").eq("order_id", params.id);
  const { data: events } = await supabaseAdmin.from("order_events").select("label,created_at").eq("order_id", params.id).order("created_at", { ascending: false });

  const methodName =
    order.payment_method === "razorpay" ? "Online (Razorpay)" :
    order.payment_method === "upi" ? "UPI - Scan & Pay" :
    order.payment_method === "cod" ? "Cash on Delivery" : "-";
  const addressLine = [order.city, order.state, order.pincode].filter(Boolean).join(", ");

  const pay = (order.payment_status as string) ?? "unpaid";
  const prog = (order.progress_status as string) ?? "new";
  const payLabel = PAYMENTS.find((p) => p.value === pay)?.label ?? pay;
  const progLabel = PROGRESS.find((p) => p.value === prog)?.label ?? prog;

  const custPhone = String(order.phone || "").replace(/\D/g, "").slice(-10);
  const shortId = String(order.id).slice(0, 8).toUpperCase();
  const firstName = String(order.customer_name || "there").split(" ")[0];
  const orderRef = (order.invoice_no as string) || ("#" + shortId);
  const notices = buildNotices(getLocale(), firstName, orderRef);

  return (
    <section className="site-wrap py-12">
      <Link href="/admin/orders" className="text-sm text-sage-deep underline">Back to orders</Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">Order {(order.invoice_no as string) || ("#" + shortId)}</h1>
          <p className="mt-1 text-ink-soft">Placed on {new Date(order.created_at as string).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        {order.receipt_url && (
          <a href={order.receipt_url as string} target="_blank" rel="noreferrer" className="btn-ghost">Download Receipt</a>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-xl2 border border-line bg-white p-6">
            <h2 className="text-lg">Customer &amp; Delivery</h2>
            <div className="mt-3 space-y-1 text-sm">
              <div className="font-medium">{order.customer_name}</div>
              <div className="text-ink-soft">Phone: {order.phone}</div>
              {order.email ? <div className="text-ink-soft">Email: {order.email as string}</div> : null}
              <div className="text-ink-soft">{order.address}</div>
              {addressLine ? <div className="text-ink-soft">{addressLine}</div> : null}
              <div className="mt-2 text-xs">Delivery area: <span className="font-medium">{order.delivery_area === "outside" ? "Outside Solapur" : "Within Solapur"}</span></div>
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
                {((order.discount as number) > 0 || (order.shipping as number) > 0) && (
                  <>
                    <tr className="border-t border-line">
                      <td colSpan={3} className="p-4 text-right text-ink-soft">Subtotal</td>
                      <td className="p-4 text-ink-soft">{formatINR(Number(order.subtotal ?? 0))}</td>
                    </tr>
                    {(order.discount as number) > 0 && (
                      <tr className="border-t border-line">
                        <td colSpan={3} className="p-4 text-right text-sage-deep">Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</td>
                        <td className="p-4 text-sage-deep">-{formatINR(order.discount as number)}</td>
                      </tr>
                    )}
                    {(order.shipping as number) > 0 && (
                      <tr className="border-t border-line">
                        <td colSpan={3} className="p-4 text-right text-ink-soft">Shipping</td>
                        <td className="p-4 text-ink-soft">{formatINR(order.shipping as number)}</td>
                      </tr>
                    )}
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Payment</h3>
            <div className="mt-2 text-sm">Status: <span className={"rounded-full px-2.5 py-1 text-xs font-medium " + (payColor[pay] ?? "bg-cream-deep text-ink-soft")}>{payLabel}</span></div>
            <form action={setPaymentStatus} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={order.id as string} />
              <select name="value" defaultValue={pay} className="min-w-0 flex-1 rounded-xl border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-sage-deep">
                {PAYMENTS.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
              </select>
              <button className="btn-primary px-4 text-sm">Save</button>
            </form>
            <div className="mt-4 space-y-1 text-sm">
              <div>Method: <span className="font-medium">{methodName}</span></div>
              {(order.payment_method === "cod" || order.payment_method === "upi") && (
                <p className="mt-2 rounded-lg bg-cream-deep px-3 py-2 text-xs text-ink-soft">{order.payment_method === "cod" ? `Collect ${formatINR(order.total as number)} on delivery.` : `Confirm UPI payment of ${formatINR(order.total as number)} before shipping.`}</p>
              )}
              <div className="mt-2 text-ink-soft">Razorpay Payment ID</div>
              <div className="break-all font-mono text-xs">{order.razorpay_payment_id || "-"}</div>
            </div>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Progress</h3>
            <div className="mt-2 text-sm">Stage: <span className={"rounded-full px-2.5 py-1 text-xs font-medium " + (progColor[prog] ?? "bg-cream-deep text-ink-soft")}>{progLabel}</span></div>
            <form action={setProgressStatus} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={order.id as string} />
              <select name="value" defaultValue={prog} className="min-w-0 flex-1 rounded-xl border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-sage-deep">
                {PROGRESS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
              </select>
              <button className="btn-primary px-4 text-sm">Save</button>
            </form>
            <p className="mt-3 text-xs text-ink-soft">Marking an order Delivered also marks COD payments as paid.</p>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Notify customer</h3>
            <p className="mt-1 text-xs text-ink-soft">{custPhone ? "One tap opens a ready-made message." : "No phone on file for WhatsApp."}</p>
            <div className="mt-3 space-y-3">
              {notices.map((n) => (
                <div key={n.key} className="flex items-center justify-between gap-2">
                  <span className="text-sm">{n.label}</span>
                  <div className="flex gap-2">
                    {custPhone && <a href={"https://web.whatsapp.com/send?phone=91" + custPhone + "&text=" + encodeURIComponent(n.msg)} target="_blank" rel="noreferrer" className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white">WhatsApp</a>}
                    {order.email && <a href={"mailto:" + order.email + "?subject=" + encodeURIComponent(n.subject) + "&body=" + encodeURIComponent(n.msg)} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-sage-deep">Email</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Notes (private)</h3>
            <form action={saveOrderNotes} className="mt-3 space-y-2">
              <input type="hidden" name="id" value={order.id as string} />
              <textarea name="notes" rows={3} defaultValue={(order.owner_notes as string) ?? ""} placeholder="Internal notes - not shown to the customer" className="w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-sage-deep" />
              <button className="btn-ghost w-full text-center text-sm">Save notes</button>
            </form>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Timeline</h3>
            {(events ?? []).length === 0 ? (
              <p className="mt-2 text-xs text-ink-soft">No changes logged yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {(events ?? []).map((e, i) => (
                  <li key={i} className="text-sm">
                    <div className="text-ink">{e.label as string}</div>
                    <div className="text-xs text-ink-soft">{new Date(e.created_at as string).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                  </li>
                ))}
              </ul>
            )}
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
