import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import AccessoryGrid from "@/components/AccessoryGrid";
import { getProducts } from "@/lib/products";
import { getAccessories } from "@/lib/accessories";
import Testimonials from "@/components/Testimonials";
import { getLocale } from "@/lib/locale";
import { getDict, type Dict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const features = [
  {
    hKey: "fineDetailing", pKey: "fineDetailingP",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      </svg>
    ),
  },
  {
    hKey: "vibrantFinish", pKey: "vibrantFinishP",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z" />
      </svg>
    ),
  },
  {
    hKey: "manyMaterials", pKey: "manyMaterialsP",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3 3 8l9 5 9-5z" />
        <path d="M3 13l9 5 9-5" />
      </svg>
    ),
  },
  {
    hKey: "easyHandle", pKey: "easyHandleP",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
        <path d="M3 8l9 5 9-5" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
] as const;

export default async function Home() {
  const products = await getProducts();
  const accessories = await getAccessories();
  const locale = getLocale();
  const t = getDict(locale);

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-[radial-gradient(1200px_600px_at_80%_20%,rgba(242,201,168,.55),transparent_60%),radial-gradient(900px_500px_at_10%_80%,rgba(175,194,168,.45),transparent_60%)]">
        <div className="site-wrap grid w-full items-center gap-10 md:grid-cols-[1.05fr_.95fr]">
          <div className="reveal">
            <div className="mb-5 text-[0.78rem] uppercase tracking-[0.34em] text-sage-deep">
              {t.heroKicker}
            </div>
            <h1 className="text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.02]">
              {t.heroTitleMain} <span className="italic text-terracotta">{t.heroTitleAccent}</span>
            </h1>
            <p className="my-6 max-w-md font-display text-[1.15rem] italic leading-relaxed text-ink-soft">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/shop" className="btn-primary">{t.exploreCollections}</Link>
            </div>
          </div>

          <div className="reveal relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[200px_200px_24px_24px] bg-gradient-to-br from-peach to-rose shadow-soft [animation-delay:.15s]">
            <div className="absolute inset-[18px] rounded-[190px_190px_16px_16px] border-2 border-dashed border-white/60" />
            <Image src="/images/hero-idol.jpg" alt="Handcrafted Ganesha idol" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="site-wrap py-[90px]">
        <SectionHeading kicker={t.ourCollections} title={t.featuredMurtis} sub={t.featuredSub} />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/shop" className="btn-ghost">{t.viewAll}</Link>
        </div>
      </section>

      {/* GANPATI SHASTRA */}
      {accessories.length > 0 && (
        <section className="bg-cream-deep py-[90px]">
          <div className="site-wrap">
            <SectionHeading kicker={t.toolsAccessories} title={t.ganpatiShastra} sub={t.shastraSub} />
            <AccessoryGrid accessories={accessories.slice(0, 5)} />
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/collections/accessories" className="btn-ghost">{t.viewAll}</Link>
              <a href="https://wa.me/917020290393" target="_blank" rel="noreferrer" className="btn-primary">{t.enquireWhatsApp}</a>
            </div>
          </div>
        </section>
      )}

      <Testimonials />

      {/* WHY */}
      <section className="site-wrap py-[90px]">
        <SectionHeading kicker={t.whyChooseUs} title={t.craftedWithCare} />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {features.map((f) => (
            <div key={f.hKey} className="rounded-xl border border-line bg-white px-6 py-8 text-center">
              <div className="mx-auto mb-4 grid h-[58px] w-[58px] place-items-center rounded-2xl bg-sage text-white">{f.icon}</div>
              <h3 className="mb-1.5 text-[1.1rem]">{t[f.hKey as keyof Dict]}</h3>
              <p className="text-[0.86rem] text-ink-soft">{t[f.pKey as keyof Dict]}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
