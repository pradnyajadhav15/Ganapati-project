import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import ShopControls from "@/components/ShopControls";
import AccessoryGrid from "@/components/AccessoryGrid";
import { searchProducts, type Category } from "@/lib/products";
import { getAccessories } from "@/lib/accessories";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop All Idols - R. Ramesh Arts Studio" };

type SortKey = "newest" | "price-asc" | "price-desc";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string };
}) {
  const t = getDict(getLocale());

  const q = searchParams.q?.trim() || "";
  const category = (searchParams.category as Category | "all") || "all";
  const sort = (searchParams.sort as SortKey) || "newest";

  const products = await searchProducts({ q, category, sort });
  const accessories = await getAccessories();

  return (
    <>
      <PageHero kicker={t.shopKicker} title={t.shopTitle} swatch="from-peach to-cream-deep" />
      <section className="site-wrap py-12">
        <Suspense fallback={null}>
          <ShopControls />
        </Suspense>

        {products.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 5) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-ink-soft">{t.noResults}</p>
        )}

        {accessories.length > 0 && (
          <div className="mt-20 pt-14">
            <div className="rule-gold mb-14" />
            <Reveal className="mb-10 text-center">
              <div className="ornament mb-3">
                <span className="text-[0.72rem] uppercase tracking-[0.3em] text-sage-deep">{t.toolsAccessories}</span>
              </div>
              <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">{t.ganpatiShastra}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">{t.shastraSub}</p>
            </Reveal>
            <AccessoryGrid accessories={accessories} />
            <div className="mt-10 text-center">
              <a href="https://wa.me/917020290393" target="_blank" rel="noreferrer" className="btn-primary">{t.enquireWhatsApp}</a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
