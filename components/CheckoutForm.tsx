"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { placeOrder, verifyPayment } from "@/app/checkout/actions";
import { formatINR } from "@/lib/format";

const field =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

// Load Razorpay's checkout script once, on demand.
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
  const router = useRouter();
  const [form, setForm] = useState({ name: defaultName, phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return <section className="site-wrap py-20" />;

  if (!items.length) {
    return (
      <section className="site-wrap py-24 text-center">
        <h1 className="text-3xl">Your cart is empty</h1>
        <Link href="/collections/shadu-mati-idols" className="btn-primary mt-6 inline-block">
          Browse Idols
        </Link>
      </section>
    );
  }

  async function pay() {
    setError(null);
    if (!form.name || !form.phone || !form.address) {
      setError("Please fill in name, phone, and address.");
      return;
    }
    setLoading(true);

    // 1) Create our order + a Razorpay order on the server.
    const order = await placeOrder({
      items: items.map((i) => ({ id: i.id, qty: i.qty })),
      name: form.name,
      phone: form.phone,
      address: form.address,
    });
    if (order.error || !order.razorpayOrderId) {
      setError(order.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    // 2) Load the Razorpay checkout popup.
    const ok = await loadRazorpayScript();
    if (!ok) {
      setError("Could not load the payment screen. Check your connection.");
      setLoading(false);
      return;
    }

    // 3) Open the payment popup.
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
        // 4) Verify the payment signature on the server, then mark paid.
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
          setError(v.error || "Payment could not be verified.");
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
        <h1 className="mb-6 text-3xl">Checkout</h1>
        <div className="space-y-4 rounded-xl2 border border-line bg-white p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Delivery address</label>
            <textarea rows={3} className={field} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <aside className="h-fit rounded-xl2 border border-line bg-cream-deep p-6">
        <h2 className="text-xl">Order Summary</h2>
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
          <span>Total</span>
          <b className="font-display text-xl text-terracotta">{formatINR(total)}</b>
        </div>
        <button onClick={pay} disabled={loading} className="btn-primary mt-5 block w-full text-center disabled:opacity-60">
          {loading ? "Processing…" : `Pay ${formatINR(total)}`}
        </button>
        <p className="mt-3 text-center text-xs text-ink-soft">
          Secure payment by Razorpay. Test mode — no real money is charged.
        </p>
      </aside>
    </section>
  );
}