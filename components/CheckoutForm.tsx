"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { useLocale } from "@/components/LocaleProvider";
import { placeOrder, verifyPayment, previewCoupon } from "@/app/checkout/actions";
import { formatINR } from "@/lib/format";

const STATES = ["Maharashtra","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];

const field = "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-sage-deep";
const lbl = "mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

type Method = "razorpay" | "upi" | "cod";

export default function CheckoutForm({ defaultName }: { defaultName: string }) {
  const { items, total, count, remove, clear, ready } = useCart();
  const { t } = useLocale();
  const router = useRouter();

  const [form, setForm] = useState({ name: defaultName, email: "", phone: "", address: "", city: "", state: "Maharashtra", pincode: "" });
  const [deliveryArea, setDeliveryArea] = useState<"solapur" | "outside">("solapur");
  const [method, setMethod] = useState<Method>("razorpay");

  const [coupon, setCoupon] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ orderId: string; method: Method } | null>(null);

  useEffect(() => {
    setAppliedCode(null);
    setDiscount(0);
    setCouponMsg(null);
  }, [total]);

  if (!ready) return <section className="site-wrap py-20" />;

  if (placed) {
    return (
      <section className="site-wrap py-24 text-center">
        <div className="mx-auto max-w-lg rounded-xl2 border border-line bg-white p-10">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-sage text-2xl text-white">✓</div>
          <h1 className="text-2xl">Order placed!</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Order #{placed.orderId.slice(0, 8).toUpperCase()}.{" "}
            {placed.method === "cod"
              ? "You can pay cash when your idol is delivered. We will contact you to confirm."
              : "Once we confirm your UPI payment, we will start preparing your order."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/shop" className="btn-primary">Continue shopping</Link>
            <Link href="/account" className="btn-ghost">View my orders</Link>
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="site-wrap py-24 text-center">
        <h1 className="text-3xl">{t.cartEmptyTitle}</h1>
        <Link href="/shop" className="btn-primary mt-6 inline-block">{t.browseIdols}</Link>
      </section>
    );
  }

  const accessoriesOnly = items.length > 0 && items.every((i) => i.kind === "accessory");
  const outsideShipping = accessoriesOnly ? 100 : 500;
  const shipping = deliveryArea === "outside" ? outsideShipping : 0;
  const payable = Math.max(0, total - discount + shipping);

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setApplying(true);
    setCouponMsg(null);
    const res = await previewCoupon({ items: items.map((i) => ({ id: i.id, qty: i.qty })), code: coupon });
    if (res.valid) { setDiscount(res.discount); setAppliedCode(coupon.trim().toUpperCase()); }
    else { setDiscount(0); setAppliedCode(null); }
    setCouponMsg(res.message);
    setApplying(false);
  }
  function removeCoupon() { setCoupon(""); setAppliedCode(null); setDiscount(0); setCouponMsg(null); }

  async function pay() {
    setError(null);
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      setError("Please fill your name, phone, address, city and pincode.");
      return;
    }
    setLoading(true);
    const order = await placeOrder({
      items: items.map((i) => ({ id: i.id, qty: i.qty })),
      name: form.name, email: form.email, phone: form.phone,
      address: form.address, city: form.city, state: form.state, pincode: form.pincode,
      deliveryArea, paymentMethod: method,
      couponCode: appliedCode ?? undefined,
    });
    if (order.error || !order.orderId) {
      setError(order.error || "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }
    if (order.method === "cod" || order.method === "upi") {
      const id = order.orderId;
      clear();
      setPlaced({ orderId: id, method: order.method });
      setLoading(false);
      return;
    }
    if (!order.razorpayOrderId) { setError("Could not start payment."); setLoading(false); return; }
    const ok = await loadRazorpayScript();
    if (!ok) { setError(t.paymentLoadError); setLoading(false); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay({
      key: order.keyId, amount: order.amount, currency: "INR",
      name: "R. Ramesh Arts Studio", description: "Eco-friendly Ganpati Idol",
      order_id: order.razorpayOrderId,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      theme: { color: "#7E9676" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async (resp: any) => {
        const v = await verifyPayment({ orderId: order.orderId!, razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature });
        if (v.ok) { clear(); router.push("/order-success?id=" + order.orderId); }
        else { setError(v.error || t.paymentNotVerified); setLoading(false); }
      },
      modal: { ondismiss: () => setLoading(false) },
    });
    rzp.open();
  }

  const payLabel =
    method === "razorpay" ? `${t.pay} ${formatINR(payable)}`
    : method === "upi" ? "I have paid - Place order"
    : "Place order (Cash on Delivery)";

  return (
    <section className="site-wrap py-12">
      <h1 className="mb-8 text-3xl">{t.checkout}</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_360px] lg:items-start">

        {/* Review order + delivery */}
        <div className="space-y-6">
          <div className="rounded-xl2 border border-line bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Review your order ({count} {count === 1 ? "item" : "items"})</h2>
            <div className="mt-4 space-y-4">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-[#faf9f7]">
                    {i.image_url ? <Image src={i.image_url} alt={i.name} fill sizes="64px" className="object-contain p-1" /> : null}
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">{i.name}{i.size ? ` · ${i.size}` : ""}</div>
                      <div className="mt-0.5 text-xs text-ink-soft">Qty: {i.qty}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm">{formatINR(i.price * i.qty)}</span>
                      <button type="button" onClick={() => remove(i.id)} className="mt-1 text-xs text-ink-soft underline hover:text-rose">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
              <span className="text-ink-soft">Subtotal</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Select delivery</h2>
            <div className="mt-4 space-y-3">
              <label className={"flex cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition " + (deliveryArea === "solapur" ? "border-sage-deep bg-cream-deep" : "border-line")}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="delivery" checked={deliveryArea === "solapur"} onChange={() => setDeliveryArea("solapur")} />
                  <span className="text-sm">
                    <span className="font-medium">Within Solapur city</span>
                    <span className="block text-xs text-ink-soft">Local delivery</span>
                  </span>
                </span>
                <span className="text-sm font-semibold text-sage-deep">Free</span>
              </label>
              <label className={"flex cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition " + (deliveryArea === "outside" ? "border-sage-deep bg-cream-deep" : "border-line")}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="delivery" checked={deliveryArea === "outside"} onChange={() => setDeliveryArea("outside")} />
                  <span className="text-sm">
                    <span className="font-medium">Outside Solapur</span>
                    <span className="block text-xs text-ink-soft">Box packing, travel and delivery to your address</span>
                  </span>
                </span>
                <span className="text-sm font-semibold">{formatINR(outsideShipping)}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="rounded-xl2 border border-line bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Delivery address</h2>
          <p className="mb-4 mt-1 text-xs text-ink-soft">All fields required</p>
          <div className="space-y-3">
            <div>
              <label className={lbl}>Full name</label>
              <input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className={lbl}>Email</label>
              <input className={field} type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className={lbl}>Phone</label>
              <input className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className={lbl}>Delivery address</label>
              <textarea rows={2} className={field} placeholder="House / building, street, area" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>City</label>
                <input className={field} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className={lbl}>Pincode</label>
                <input className={field} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={lbl}>State</label>
              <select className={field} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Payment + summary */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          <div className="rounded-xl2 border border-line bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Payment method</h2>
            <div className="mt-4 space-y-3">
              {[
                { id: "razorpay" as Method, title: "Card / UPI / Netbanking", sub: "Pay online securely (Razorpay)" },
                { id: "upi" as Method, title: "UPI - Scan & Pay", sub: "Scan our QR with any UPI app" },
                { id: "cod" as Method, title: "Cash on Delivery", sub: "Pay when you receive the idol" },
              ].map((m) => (
                <label key={m.id} className={"flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 transition " + (method === m.id ? "border-sage-deep bg-cream-deep" : "border-line")}>
                  <input type="radio" name="method" className="mt-1" checked={method === m.id} onChange={() => setMethod(m.id)} />
                  <span className="text-sm">
                    <span className="font-medium">{m.title}</span>
                    <span className="block text-xs text-ink-soft">{m.sub}</span>
                  </span>
                </label>
              ))}
            </div>

            {method === "upi" && (
              <div className="mt-4 rounded-xl border border-line bg-cream p-4 text-center">
                <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-lg bg-white">
                  <Image src="/images/upi-qr.png" alt="UPI QR code" fill sizes="192px" className="object-contain p-2" />
                </div>
                <p className="mt-3 text-sm font-medium">Scan & pay {formatINR(payable)}</p>
                <p className="mt-1 text-xs text-ink-soft">Use any UPI app (GPay, PhonePe, Paytm), then tap the button below.</p>
              </div>
            )}
          </div>

          <div className="rounded-xl2 border border-line bg-cream-deep p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Order summary</h2>

            <div className="mt-4">
              <div className="flex gap-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Discount code" className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm uppercase outline-none focus:border-sage-deep" />
                {appliedCode ? (
                  <button type="button" onClick={removeCoupon} className="flex-none rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink-soft">Remove</button>
                ) : (
                  <button type="button" onClick={applyCoupon} disabled={applying || !coupon.trim()} className="flex-none rounded-lg border border-sage-deep px-3 py-2 text-xs font-semibold text-sage-deep disabled:opacity-50">{applying ? "..." : "Apply"}</button>
                )}
              </div>
              {couponMsg && <p className={"mt-2 text-xs " + (discount > 0 ? "text-sage-deep" : "text-red-600")}>{couponMsg}</p>}
            </div>

            <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-ink-soft"><span>Subtotal</span><span>{formatINR(total)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-sage-deep"><span>Discount{appliedCode ? ` (${appliedCode})` : ""}</span><span>-{formatINR(discount)}</span></div>
              )}
              <div className="flex justify-between text-ink-soft"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
              <div className="flex justify-between border-t border-line pt-2 text-base"><span className="font-medium">{t.total}</span><b className="font-display text-xl text-terracotta">{formatINR(payable)}</b></div>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button onClick={pay} disabled={loading} className="btn-primary mt-5 block w-full text-center disabled:opacity-60">
              {loading ? t.processing : payLabel}
            </button>
            <p className="mt-3 text-center text-xs text-ink-soft">{t.securePayment}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
