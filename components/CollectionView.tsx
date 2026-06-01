import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { Category, CATEGORY_META, getProductsByCategory } from "@/lib/products";

export default async function CollectionView({ category }: { category: Category }) {
  const meta = CATEGORY_META[category];
  const items = await getProductsByCategory(category);

  return (
    <section className="site-wrap py-[80px]">
      <SectionHeading kicker="Our Collections" title={meta.title} sub={meta.blurb} />
      {items.length ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-ink-soft">
          New idols coming soon to this collection.
        </p>
      )}
    </section>
  );
}
