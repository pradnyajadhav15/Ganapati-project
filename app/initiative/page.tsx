import PageHero from "@/components/PageHero";
import { getLocale } from "@/lib/locale";
import { getDict, type Dict } from "@/lib/i18n";

export const metadata = { title: "Initiative - R. Ramesh Arts Studio" };

const stats = [
  { n: "100%", lKey: "statNaturalClay" },
  { n: "0", lKey: "statToxicChemicals" },
  { n: "20+", lKey: "statYearsCraft" },
] as const;

export default function Page() {
  const t = getDict(getLocale());

  return (
    <>
      <PageHero kicker={t.greenOption} title={t.ecoFriendlyIdols} swatch="from-sage to-sage-deep" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-2xl text-center text-ink-soft">
          <p className="text-lg leading-relaxed">
            {t.initiativePara1}
          </p>
          <p className="mt-5 leading-relaxed">
            {t.initiativePara2}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.lKey} className="rounded-xl2 bg-cream-deep p-8 text-center">
              <div className="font-display text-5xl text-terracotta">{s.n}</div>
              <div className="mt-2 text-[0.85rem] uppercase tracking-[0.16em] text-sage-deep">{t[s.lKey as keyof Dict]}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}