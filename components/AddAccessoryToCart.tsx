"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function AddAccessoryToCart({
  id,
  name,
  price,
  image_url,
}: {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add({ id, name, price, size: null, image_url, kind: "accessory" }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={handleAdd} className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-cream">Add to Cart</button>
      <Link href="/cart" className="rounded-xl border border-line px-6 py-3 text-sm font-semibold">Go to Cart</Link>
      {added && <span className="text-sm font-medium text-sage-deep">Added!</span>}
    </div>
  );
}
