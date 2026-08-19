import { renderWithBold } from "@/lib/renderWithBold";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, formatINR, CATEGORY_META, localizedName, localizedDescription } from "@/lib/products";
import { getReviews, getRatingSummary } from "@/lib/reviews";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getOrderingStatus } from "@/lib/settings";
import AddToCartButtons from "@/components/AddToCartButtons";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import ProductGallery from "@/components/ProductGallery";
import PreBookForm from "@/components/PreBookForm";

export const dynamic = "force-dynamic";

const siteUrl = "https://www.rramesharts.com";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const locale = getLocale();
  const t = getDict(locale);
  const displayName = localizedName(product, locale);
  const displayDesc = localizedDescription(product, locale);

  const galleryImages = [product.image_url, ...(product.image_urls ?? [])].filter(
    Boolean
  ) as string[];

  const [reviews, summary] = await Promise.all([
    getReviews(product.id),
    getRatingSummary(product.id),
  ]);

  // Season capacity: how many of this product are still available this season.
  const { data: capRow } = await supabaseAdmin
    .from("products")
    .select("season_capacity")
    .eq("id", product.id)
    .maybeSingle();
  const seasonCap = (capRow?.season_capacity as number | null) ?? null;
  let remaining: number | null = null;
  if (seasonCap != null) {
    const { data: bookedRow } = await supabaseAdmin
      .from("product_booked")
      .select("booked")
      .eq("product_id", product.id)
      .maybeSingle();
    remaining = Math.max(0, seasonCap - ((bookedRow?.booked as number) ?? 0));
  }
  const capSoldOut = remaining !== null && remaining <= 0;
  const available = !!product.in_stock && !capSoldOut;

  // Site-wide ordering switch (season cutoff).
  const ordering = await getOrderingStatus();
  const canBuy = available && ordering.open;

  const sb = createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const isLoggedIn = !!user;
  const defaultName = (user?.user_metadata?.full_name as string) || "";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    ...(galleryImages.length ? { image: galleryImages } : {}),
    ...(displayDesc ? { description: displayDesc } : {}),
    category: CATEGORY_META[product.category]?.title,
    brand: { "@type": "Brand", name: "R. Ramesh Arts Studio" },
    ...(summary.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: summary.average.toFixed(1),
            reviewCount: summary.count,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: siteUrl + "/product/" + product.id,
    },
  };

  return (
    <>
      <section className="site-wrap grid gap-12 py-16 md:grid-cols-2">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />

        <ProductGallery images={galleryImages} alt={displayName} name={displayName} price={product.price} />

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

          {!available && (
            <span className="mt-3 inline-block w-fit rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-terracotta">
              {t.soldOut}
            </span>
          )}

          {summary.count > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <StarRating value={summary.average} />
              <span className="text-sm text-ink-soft">
                {summary.average.toFixed(1)} ({summary.count} {t.reviewsLabel})
              </span>
            </div>
          )}

          <div className="my-5">
            <div className="rule-gold mb-5" />
            <div className="font-display text-[2.1rem] font-semibold leading-none text-terracotta-deep">
              {formatINR(product.price)}
            </div>
          </div>
          {displayDesc && (
            <p className="mb-6 max-w-md whitespace-pre-wrap text-ink-soft">{renderWithBold(displayDesc)}</p>
          )}

          {canBuy && remaining !== null && (
            <p className={"mb-3 text-sm font-medium " + (remaining <= 5 ? "text-terracotta" : "text-ink-soft")}>
              {remaining <= 5 ? "Only " + remaining + " left this season" : remaining + " available this season"}
            </p>
          )}

          {canBuy ? (
            <AddToCartButtons
              variant="page"
              product={{ id: product.id, name: displayName, price: product.price, size: product.size, image_url: product.image_url }}
            />
          ) : (
            <button disabled className="w-full cursor-not-allowed rounded-full bg-cream-deep py-3 text-center font-semibold text-ink-soft">
              {!available ? t.soldOut : "Orders closed for now"}
            </button>
          )}

          {ordering.open ? (
            <p className="mt-4 text-xs text-ink-soft">{available ? t.inStockNote : t.outOfStockNote}</p>
          ) : (
            <p className="mt-4 rounded-lg border border-line bg-cream-deep px-4 py-3 text-sm text-ink-soft">{ordering.message || "We are not taking new orders right now - you can pre-book below for the next batch."}</p>
          )}

          {/* reassurance strip */}
          <ul className="mt-7 grid grid-cols-1 gap-3 border-t border-line-soft pt-6 sm:grid-cols-3">
            {[
              { t: "Hand-finished", d: "Painted and checked by our artisans" },
              { t: "Safe delivery", d: "Packed to travel without cracks" },
              { t: "Talk to us", d: "WhatsApp us before you buy" },
            ].map((item) => (
              <li key={item.t} className="flex items-start gap-2.5">
                <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full bg-sage/25 text-sage-deep">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[0.82rem] font-semibold text-ink">{item.t}</span>
                  <span className="block text-[0.76rem] leading-snug text-ink-soft">{item.d}</span>
                </span>
              </li>
            ))}
          </ul>

          <PreBookForm
            productId={product.id}
            productName={displayName}
            price={product.price}
            defaultName={defaultName}
          />
        </div>
      </section>

      <section className="site-wrap pb-20">
        <h2 className="text-2xl">
          {t.reviews}{summary.count > 0 ? ` (${summary.count})` : ""}
        </h2>

        {reviews.length > 0 ? (
          <div className="mt-6 space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl2 border border-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.customer_name}</span>
                  <StarRating value={r.rating} size={16} />
                </div>
                {r.comment && <p className="mt-2 text-sm text-ink-soft">{r.comment}</p>}
                <div className="mt-2 text-xs text-ink-soft/60">
                  {new Date(r.created_at).toLocaleDateString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-ink-soft">{t.noReviews}</p>
        )}

        <div className="mt-8 max-w-xl">
          <ReviewForm productId={product.id} isLoggedIn={isLoggedIn} defaultName={defaultName} />
        </div>
      </section>
    </>
  );
}
