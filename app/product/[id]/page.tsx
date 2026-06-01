import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, formatINR, CATEGORY_META, localizedName, localizedDescription } from "@/lib/products";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const locale = getLocale();
  const displayName = localizedName(product, locale);
  const displayDesc = localizedDescription(product, locale);

  return (
    <section className="site-wrap grid gap-10 py-16 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl2 bg-gradient-to-br from-peach to-rose">
        {product.image_url ? (
          <Image src={product.image_url} alt={displayName} fill className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-[10rem]">🪔</div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <Link
          href={`/collections/${product.category}`}
          className="kicker mb-3 hover:underline"
        >
          {CATEGORY_META[product.category]?.title}
        </Link>
        <h1 className="text-[clamp(2rem,4vw,3rem)]">
          {displayName} {product.size}
        </h1>
        <div className="my-4 font-display text-3xl text-terracotta">
          {formatINR(product.price)}
        </div>
        {displayDesc && (
          <p className="mb-6 max-w-md text-ink-soft">{displayDesc}</p>
        )}
        <div className="flex gap-3">
          <button className="btn-ghost">Add to Cart</button>
          <button className="btn-primary">Buy Now</button>
        </div>
        <p className="mt-4 text-xs text-ink-soft">
          {product.in_stock ? "In stock — ships before the festival." : "Currently unavailable."}
        </p>
      </div>
    </section>
  );
}