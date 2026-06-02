import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getLocale } from "@/lib/locale";
import { getDict, type Dict } from "@/lib/i18n";

export const metadata = { title: "Customized Work - R. Ramesh Arts Studio" };

const steps = [
  { n: "01", hKey: "step1H", pKey: "step1P" },
  { n: "02", hKey: "step2H", pKey: "step2P" },
  { n: "03", hKey: "step3H", pKey: "step3P" },
  { n: "04", hKey: "step4H", pKey: "step4P" },
] as const;

export default function Page() {
  const t = getDict(getLocale());

  return (
    <>
      <PageHero kicker={t.madeJustForYou} title={t.customizedWork} swatch="from-sage to-cream-deep" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-2xl text-center text-ink-soft">
          <p className="text-lg leading-relaxed">
            {t.customWorkIntro}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl2 border border-line bg-white p-7">
              <div className="font-display text-3xl text-terracotta">{s.n}</div>
              <h3 className="mb-1.5 mt-3 text-[1.15rem]">{t[s.hKey as keyof Dict]}</h3>
              <p className="text-[0.9rem] text-ink-soft">{t[s.pKey as keyof Dict]}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/contact" className="btn-primary">{t.requestCustomIdol}</Link>
        </div>
      </section>
    </>
  );
}