"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useLocale } from "@/components/LocaleProvider";
import { placeOrder, verifyPayment } from "@/app/checkout/actions";
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
        <div className="mt-4 flex justify-between border-t border-line pt-4">
          <span>{t.total}</span>
          <b className="font-display text-xl text-terracotta">{formatINR(total)}</b>
        </div>
        <button onClick={pay} disabled={loading} className="btn-primary mt-5 block w-full text-center disabled:opacity-60">
          {loading ? t.processing : `${t.pay} ${formatINR(total)}`}
        </button>
        <p className="mt-3 text-center text-xs text-ink-soft">
          {t.securePayment}
        </p>
      </aside>
    </section>
  );
}