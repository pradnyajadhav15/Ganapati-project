"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { formatINR } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, remove, total, ready } = useCart();

  if (!ready) return <section className="site-wrap py-20" />;

  if (!items.length) {
    return (
      <section className="site-wrap py-24 text-center">
        <h1 className="text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-ink-soft">Add an idol to get started.</p>
        <Link href="/collections/shadu-mati-idols" className="btn-primary mt-6 inline-block">
          Browse Idols
        </Link>
      </section>
    );
  }

  return (
    <section className="site-wrap py-12">
      <h1 className="mb-8 text-3xl">Your Cart</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 rounded-xl2 border border-line bg-white p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-peach to-rose">
                {i.image_url ? (
                  <Image src={i.image_url} alt={i.name} fill className="object-cover" />
                ) : (
                  <span className="grid h-full place-items-center text-2xl">🪔</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-[1.05rem]">
                  {i.name}
                  {i.size ? ` ${i.size}` : ""}
                </h3>
                <div className="font-display text-terracotta">{formatINR(i.price)}</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-line">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="grid h-7 w-7 place-items-center text-lg" aria-label="decrease">−</button>
                    <span className="w-5 text-center text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="grid h-7 w-7 place-items-center text-lg" aria-label="increase">+</button>
                  </div>
                  <button onClick={() => remove(i.id)} className="text-xs text-ink-soft underline hover:text-red-600">
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-display text-[1.05rem]">{formatINR(i.price * i.qty)}</div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl2 border border-line bg-cream-deep p-6">
          <h2 className="text-xl">Summary</h2>
          <div className="mt-4 flex justify-between border-t border-line pt-4">
            <span>Total</span>
            <b className="font-display text-xl text-terracotta">{formatINR(total)}</b>
          </div>
          <Link href="/checkout" className="btn-primary mt-5 block w-full text-center">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}