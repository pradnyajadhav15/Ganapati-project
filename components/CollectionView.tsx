import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Category, getProductsByCategory } from "@/lib/products";
import { materialFor } from "@/lib/materials";
import { getLocale } from "@/lib/locale";
import { getDict, type Dict } from "@/lib/i18n";

const META: Record<Category, { titleKey: keyof Dict; blurbKey: keyof Dict }> = {
  "dashboard-idols": { titleKey: "dashboardIdols", blurbKey: "dashboardIdolsBlurb" },
  "shadu-mati-idols": { titleKey: "shaduMatiIdols", blurbKey: "shaduMatiIdolsBlurb" },
  "fiber-idols": { titleKey: "fiberIdols", blurbKey: "fiberIdolsBlurb" },
  "pop-idols": { titleKey: "popIdols", blurbKey: "popIdolsBlurb" },
};

const LABELS = {
  en: { weight: "Weight", immersion: "At visarjan", reuse: "Lasts", compare: "Compare all materials" },
  hi: { weight: "वज़न", immersion: "विसर्जन पर", reuse: "कितने समय", compare: "सभी सामग्रियों की तुलना करें" },
  mr: { weight: "वजन", immersion: "विसर्जनाला", reuse: "किती काळ", compare: "सर्व साहित्यांची तुलना करा" },
} as const;

export default async function CollectionView({ category }: { category: Category }) {
  const items = await getProductsByCategory(category);
  const locale = getLocale();
  const t = getDict(locale);
  const m = META[category];

  // Each material carries its own accent and traits, so the four collection
  // pages no longer read as the same grid with a different sentence on top.
  const material = materialFor(category);
  const traits = material ? material.traits[locale] ?? material.traits.en : null;
  const l = LABELS[locale] ?? LABELS.en;

  return (
    <section className="site-wrap py-[80px]">
      <SectionHeading kicker={t.ourCollections} title={t[m.titleKey]} sub={t[m.blurbKey]} />

      {material && traits && (
        <Reveal className="mx-auto mb-12 max-w-3xl">
          <div className={"rounded-xl3 border border-line-soft p-6 shadow-lux ring-1 " + material.ring + " " + material.tint}>
            <div className="grid gap-4 sm:grid-cols-3">
              <Trait label={l.weight} value={traits.weight} accent={material.accent} />
              <Trait label={l.immersion} value={traits.immersion} accent={material.accent} />
              <Trait label={l.reuse} value={traits.reuse} accent={material.accent} />
            </div>
            <div className="mt-5 border-t border-line-soft pt-4 text-center">
              <Link
                href="/materials"
                className="text-sm font-semibold text-ink underline decoration-gold/50 underline-offset-4 transition hover:decoration-gold"
              >
                {l.compare} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </Reveal>
      )}

      {items.length ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 5) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-center text-ink-soft">{t.emptyCollection}</p>
      )}
    </section>
  );
}

function Trait({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <div className={"text-[0.68rem] uppercase tracking-[0.14em] " + accent}>{label}</div>
      <div className="mt-1 text-sm leading-relaxed text-ink-soft">{value}</div>
    </div>
  );
}
