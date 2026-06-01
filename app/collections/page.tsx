import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { CATEGORY_META, Category } from "@/lib/products";

export const metadata = { title: "Collections — R. Ramesh Arts Studio" };

export default function Page() {
  const cats = Object.keys(CATEGORY_META) as Category[];
  const swatch: Record<Category, string> = {
    "dashboard-idols": "from-peach to-sage",
    "shadu-mati-idols": "from-sage to-cream-deep",
    "fiber-idols": "from-terracotta to-peach",
    "pop-idols": "from-rose to-cream-deep",
  };
  return (
    <section className="site-wrap py-[80px]">
      <SectionHeading
        kicker="Our Collections"
        title="Explore Our Range"
        sub="From dashboard idols to grand Shadu Mati murtis — choose your collection."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {cats.map((c) => (
          <Link
            key={c}
            href={`/collections/${c}`}
            className="group overflow-hidden rounded-xl2 border border-line bg-white transition hover:-translate-y-1.5 hover:shadow-soft"
          >
            <div className={`grid aspect-[4/3] place-items-center bg-gradient-to-br ${swatch[c]} text-7xl`}>
              🪔
            </div>
            <div className="p-6">
              <h3 className="text-[1.3rem]">{CATEGORY_META[c].title}</h3>
              <p className="mt-1.5 text-[0.9rem] text-ink-soft">{CATEGORY_META[c].blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
