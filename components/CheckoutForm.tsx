"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useLocale } from "@/components/LocaleProvider";
import { placeOrder, verifyPayment, previewCoupon } from "@/app/checkout/actions";
import { formatINR } from "@/lib/format";

const field =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

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

export default function CheckoutForm({ defaultName }: { defaultName: string }) {
  const { items, total, clear, ready } = useCart();
  const { t } = useLocale();
  const router = useRouter();
  const [form, setForm] = useState({ name: defaultName, phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [coupon, setCoupon] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  // If the cart changes, clear any applied coupon (it must be re-applied).
  useEffect(() => {
    setAppliedCode(null);
    setDiscount(0);
    setCouponMsg(null);
  }, [total]);

  if (!ready) return <section className="site-wrap py-20" />;

  if (!items.length) {
    return (
      <section className="site-wrap py-24 text-center">
        <h1 className="text-3xl">{t.cartEmptyTitle}</h1>
        <Link href="/collections/shadu-mati-idols" className="btn-primary mt-6 inline-block">
          {t.browseIdols}
        </Link>
      </section>
    );
  }

  const payable = Math.max(0, total - discount);

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setApplying(true);
    setCouponMsg(null);
    const res = await previewCoupon({
      items: items.map((i) => ({ id: i.id, qty: i.qty })),
      code: coupon,
    });
    if (res.valid) {
      setDiscount(res.discount);
      setAppliedCode(coupon.trim().toUpperCase());
    } else {
      setDiscount(0);
      setAppliedCode(null);
    }
    setCouponMsg(res.message);
    setApplying(false);
  }

  function removeCoupon() {
    setCoupon("");
    setAppliedCode(null);
    setDiscount(0);
    setCouponMsg(null);
  }

  async function pay() {
    setError(null);
    if (!form.name || !form.phone || !form.address) {
      setError(t.fillAllFields);
      return;
    }
    setLoading(true);

    const order = await placeOrder({
      items: items.map((i) => ({ id: i.id, qty: i.qty })),
      name: form.name,
      phone: form.phone,
      address: form.address,
      couponCode: appliedCode ?? undefined,
    });
    if (order.error || !order.razorpayOrderId) {
      setError(order.error || t.somethingWrong);
      setLoading(false);
      return;
    }

    const ok = await loadRazorpayScript();
    if (!ok) {
      setError(t.paymentLoadError);
      setLoading(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: "INR",
      name: "R. Ramesh Arts Studio",
      description: "Eco-friendly Ganpati Idol",
      order_id: order.razorpayOrderId,
      prefill: { name: form.name, contact: form.phone },
      theme: { color: "#7E9676" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async (resp: any) => {
        const v = await verifyPayment({
          orderId: order.orderId!,
          razorpay_order_id: resp.razorpay_order_id,
          razorpay_payment_id: resp.razorpay_payment_id,
          razorpay_signature: resp.razorpay_signature,
        });
        if (v.ok) {
          clear();
          router.push("/order-success?id=" + order.orderId);
        } else {
          setError(v.error || t.paymentNotVerified);
          setLoading(false);
        }
      },
      modal: { ondismiss: () => setLoading(false) },
    });
    rzp.open();
  }

  return (
    <section className="site-wrap grid gap-8 py-12 md:grid-cols-[1fr_320px]">
      <div>
        <h1 className="mb-6 text-3xl">{t.checkout}</h1>
        <div className="space-y-4 rounded-xl2 border border-line bg-white p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">{t.fullName}</label>
            <input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t.phone}</label>
            <input className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t.deliveryAddress}</label>
            <textarea rows={3} className={field} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <aside className="h-fit rounded-xl2 border border-line bg-cream-deep p-6">
        <h2 className="text-xl">{t.orderSummary}</h2>
        <div className="mt-4 space-y-2 text-sm">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between">
              <span className="text-ink-soft">
                {i.name}
                {i.size ? ` ${i.size}` : ""} × {i.qty}
              </span>
              <span>{formatINR(i.price * i.qty)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-soft">
            Discount code
          </label>
          <div className="flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="e.g. GANESH10"
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm uppercase outline-none focus:border-sage-deep"
            />
            {appliedCode ? (
              <button type="button" onClick={removeCoupon} className="flex-none rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink-soft">
                Remove
              </button>
            ) : (
              <button type="button" onClick={applyCoupon} disabled={applying || !coupon.trim()} className="flex-none rounded-lg border border-sage-deep px-3 py-2 text-xs font-semibold text-sage-deep disabled:opacity-50">
                {applying ? "..." : "Apply"}
              </button>
            )}
          </div>
          {couponMsg && (
            <p className={"mt-2 text-xs " + (discount > 0 ? "text-sage-deep" : "text-red-600")}>{couponMsg}</p>
          )}
        </div>

        <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
          {discount > 0 && (
            <>
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span>{formatINR(total)}</span>
              </div>
              <div className="flex justify-between text-sage-deep">
                <span>Discount{appliedCode ? ` (${appliedCode})` : ""}</span>
                <span>-{formatINR(discount)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between pt-1">
            <span className="font-medium">{t.total}</span>
            <b className="font-display text-xl text-terracotta">{formatINR(payable)}</b>
          </div>
        </div>

        <button onClick={pay} disabled={loading} className="btn-primary mt-5 block w-full text-center disabled:opacity-60">
          {loading ? t.processing : `${t.pay} ${formatINR(payable)}`}
        </button>
        <p className="mt-3 text-center text-xs text-ink-soft">
          {t.securePayment}
        </p>
      </aside>
    </section>
  );
}
