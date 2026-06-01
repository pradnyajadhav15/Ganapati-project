"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useLocale } from "@/components/LocaleProvider";

type ButtonProduct = {
  id: string;
  name: string;
  price: number;
  size: string | null;
  image_url: string | null;
};

export default function AddToCartButtons({
  product,
  variant = "card",
}: {
  product: ButtonProduct;
  variant?: "card" | "page";
}) {
  const { add } = useCart();
  const router = useRouter();
  const { t } = useLocale();

  const buyNow = () => {
    add(product);
    router.push("/cart");
  };

  if (variant === "page") {
    return (
      <div className="flex gap-3">
        <button onClick={() => add(product)} className="btn-ghost">
          {t.addToCart}
        </button>
        <button onClick={buyNow} className="btn-primary">
          {t.buyNow}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3.5 flex gap-2">
      <button
        onClick={() => add(product)}
        className="flex-1 rounded-full border-[1.5px] border-ink py-2.5 text-[0.78rem] font-semibold transition hover:border-gold hover:bg-gold hover:text-white"
      >
        {t.addToCart}
      </button>
      <button
        onClick={buyNow}
        className="flex-1 rounded-full border-[1.5px] border-ink bg-ink py-2.5 text-[0.78rem] font-semibold text-cream transition hover:border-gold hover:bg-gold"
      >
        {t.buyNow}
      </button>
    </div>
  );
}