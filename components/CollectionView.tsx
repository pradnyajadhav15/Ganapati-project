import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { Category, getProductsByCategory } from "@/lib/products";
import { getLocale } from "@/lib/locale";
import { getDict, type Dict } from "@/lib/i18n";

const META: Record<Category, { titleKey: keyof Dict; blurbKey: keyof Dict }> = {
  "dashboard-idols": { titleKey: "dashboardIdols", blurbKey: "dashboardIdolsBlurb" },
  "shadu-mati-idols": { titleKey: "shaduMatiIdols", blurbKey: "shaduMatiIdolsBlurb" },
  "fiber-idols": { titleKey: "fiberIdols", blurbKey: "fiberIdolsBlurb" },
  "pop-idols": { titleKey: "popIdols", blurbKey: "popIdolsBlurb" },
};

export default async function CollectionView({ category }: { category: Category }) {
  const items = await getProductsByCategory(category);
  const t = getDict(getLocale());
  const m = META[category];

  return (
    <section className="site-wrap py-[80px]">
      <SectionHeading kicker={t.ourCollections} title={t[m.titleKey]} sub={t[m.blurbKey]} />
      {items.length ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-ink-soft">
          {t.emptyCollection}
        </p>
      )}
    </section>
  );
}