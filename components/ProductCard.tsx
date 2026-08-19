import Link from "next/link";
import Image from "next/image";
import { Product, formatINR, localizedName } from "@/lib/products";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";
import AddToCartButtons from "@/components/AddToCartButtons";

export default function ProductCard({ product }: { product: Product }) {
  const locale = getLocale();
  const t = getDict(locale);
  const displayName = localizedName(product, locale);

  const waText = encodeURIComponent("Hi, I'm interested in " + displayName + (product.size ? " " + product.size : "") + ".");
  const waHref = "https://wa.me/917020290393?text=" + waText;

  return (
    <div className="card-lux group flex flex-col overflow-hidden">
      <Link href={"/product/" + product.id} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-peach to-rose">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={displayName}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.08]"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="font-display text-lg italic text-white/70">R. Ramesh Arts</span>
            </div>
          )}

          {/* soft vignette that deepens on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          {/* view-detail cue */}
          <span className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 rounded-full bg-white/95 py-2 text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink opacity-0 shadow-lux backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {t.viewDetails}
          </span>

          {product.tag && (
            <span className="absolute right-3 top-3 rounded-full bg-gold-sheen px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink-deep shadow-lux">
              {product.tag}
            </span>
          )}

          {!product.in_stock && (
            <span className="absolute left-3 top-3 rounded-full bg-ink/88 px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-cream backdrop-blur-sm">
              {t.soldOut}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-[18px]">
        <Link href={"/product/" + product.id}>
          <h3 className="text-[1.15rem] leading-snug transition-colors duration-300 group-hover:text-terracotta-deep">
            {displayName}
            {product.size ? " " + product.size : ""}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-[1.28rem] font-semibold text-terracotta-deep">
            {formatINR(product.price)}
          </span>
        </div>

        <div className="my-3.5 rule-gold" />

        <div className="mt-auto">
          {product.in_stock ? (
            <AddToCartButtons product={{ id: product.id, name: displayName, price: product.price, size: product.size, image_url: product.image_url }} />
          ) : (
            <button disabled className="w-full cursor-not-allowed rounded-full bg-cream-deep py-2.5 text-center text-[0.85rem] font-semibold text-ink-soft">
              {t.soldOut}
            </button>
          )}
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-sage py-2 text-center text-[0.8rem] font-semibold text-sage-deep transition-all duration-300 hover:border-sage-deep hover:bg-sage-deep hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.06 1.6 5.82L2 22l4.4-1.15a9.9 9.9 0 0 0 5.64 1.74c5.46 0 9.91-4.45 9.91-9.91a9.82 9.82 0 0 0-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
