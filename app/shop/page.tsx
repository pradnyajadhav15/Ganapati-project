import { Suspense } from "react";
import PageHero from "@/components/PageHero";
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
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-ink-soft">{t.noResults}</p>
        )}

        {accessories.length > 0 && (
          <div className="mt-16 border-t border-line pt-12">
            <div className="mb-8 text-center">
              <div className="mb-2 text-[0.72rem] uppercase tracking-[0.3em] text-sage-deep">{t.toolsAccessories}</div>
              <h2 className="text-2xl">{t.ganpatiShastra}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">{t.shastraSub}</p>
            </div>
            <AccessoryGrid accessories={accessories} />
            <div className="mt-8 text-center">
              <a href="https://wa.me/917020290393" target="_blank" rel="noreferrer" className="btn-primary">{t.enquireWhatsApp}</a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
