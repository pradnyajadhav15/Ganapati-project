import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { Category } from "@/lib/products";
import { getLocale } from "@/lib/locale";
import { getDict, type Dict } from "@/lib/i18n";

export const metadata = { title: "Collections — R. Ramesh Arts Studio" };

const META: Record<Category, { titleKey: keyof Dict; blurbKey: keyof Dict; swatch: string }> = {
  "dashboard-idols": { titleKey: "dashboardIdols", blurbKey: "dashboardIdolsBlurb", swatch: "from-peach to-sage" },
  "shadu-mati-idols": { titleKey: "shaduMatiIdols", blurbKey: "shaduMatiIdolsBlurb", swatch: "from-sage to-cream-deep" },
  "fiber-idols": { titleKey: "fiberIdols", blurbKey: "fiberIdolsBlurb", swatch: "from-terracotta to-peach" },
  "pop-idols": { titleKey: "popIdols", blurbKey: "popIdolsBlurb", swatch: "from-rose to-cream-deep" },
};

export default function Page() {
  const t = getDict(getLocale());
  const cats = Object.keys(META) as Category[];

  return (
    <section className="site-wrap py-[80px]">
      <SectionHeading
        kicker={t.ourCollections}
        title={t.exploreRange}
        sub={t.collectionsSub}
      />
      <div className="grid gap-6 md:grid-cols-3">
        {cats.map((c) => (
          <Link
            key={c}
            href={`/collections/${c}`}
            className="group overflow-hidden rounded-xl2 border border-line bg-white transition hover:-translate-y-1.5 hover:shadow-soft"
          >
            <div className={`grid aspect-[4/3] place-items-center bg-gradient-to-br ${META[c].swatch} text-7xl`}>
              🪔
            </div>
            <div className="p-6">
              <h3 className="text-[1.3rem]">{t[META[c].titleKey]}</h3>
              <p className="mt-1.5 text-[0.9rem] text-ink-soft">{t[META[c].blurbKey]}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}