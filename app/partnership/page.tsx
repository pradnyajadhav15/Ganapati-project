import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export const metadata = { title: "Partnership - R. Ramesh Arts Studio" };

export default function Page() {
  const t = getDict(getLocale());

  return (
    <>
      <PageHero kicker={t.growWithUs} title={t.becomeAPartner} swatch="from-peach to-terracotta" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-2xl space-y-5 text-center text-ink-soft">
          <p>{t.partnerPara1}</p>
          <p>{t.partnerPara2}</p>
          <p>{t.partnerPara3}</p>
          <p>{t.partnerPara4}</p>
          <p className="font-display text-xl italic text-ink">
            {t.partnerPara5}
          </p>
        </div>
        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">{t.partnerWithUs}</Link>
        </div>
      </section>
    </>
  );
}