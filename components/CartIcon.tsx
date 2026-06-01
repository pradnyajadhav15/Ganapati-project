"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartIcon() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="relative text-lg opacity-80">
      🛒
      {count > 0 && (
        <span className="absolute -right-2 -top-2 grid h-4 min-w-[1rem] place-items-center rounded-full bg-terracotta px-1 text-[0.6rem] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}