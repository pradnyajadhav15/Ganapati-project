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

const HERITAGE: Record<string, { kicker: string; title: string; p1: string; p2: string; cta: string; estLabel: string; caption: string }> = {
  en: {
    kicker: "Our Heritage",
    title: "Crafted in Solapur, Blessed by Tradition",
    p1: "R. Ramesh Arts has been creating sacred idols for over two decades, rooted in the rich artistic heritage of Solapur. Each idol is hand-crafted by skilled artisans using traditional techniques passed down through generations — from delicate Shadu Mati clay work to precision fibre craft.",
    p2: "Our city is home to the revered Aajoba Ganapati of Shukrawar Peth — established in 1885 and counted among the oldest sarvajanik (public) Ganesh festivals in India, a tradition older than the public Ganeshotsav movement itself. This 'Manacha' Ganpati is the timeless pride of Solapur, and its devotion inspires every murti we make.",
    cta: "Read Our Story",
    estLabel: "Est.",
    caption: "Aajoba Ganapati — Pride of Solapur",
  },
  hi: {
    kicker: "हमारी विरासत",
    title: "सोलापुर में निर्मित, परंपरा से धन्य",
    p1: "R. Ramesh Arts दो दशकों से अधिक समय से पवित्र मूर्तियाँ बना रहा है, जो सोलापुर की समृद्ध कलात्मक विरासत में निहित है। हर मूर्ति कुशल कारीगरों द्वारा पीढ़ियों से चली आ रही पारंपरिक तकनीकों से हाथ से बनाई जाती है — नाज़ुक शाडू माटी के काम से लेकर बारीक फाइबर शिल्प तक।",
    p2: "हमारा शहर श्रद्धेय आजोबा गणपती का निवास है — शुक्रवार पेठ में 1885 में स्थापित और भारत के सबसे पुराने सार्वजनिक गणेशोत्सवों में गिना जाने वाला, जो सार्वजनिक गणेशोत्सव परंपरा से भी पुराना है। यह 'मानाचा' गणपती सोलापुर का चिरंतन गौरव है, और इसकी भक्ति हमारी हर मूर्ति को प्रेरित करती है।",
    cta: "हमारी कहानी पढ़ें",
    estLabel: "स्थापना",
    caption: "आजोबा गणपती — सोलापुर का गौरव",
  },
  mr: {
    kicker: "आमचा वारसा",
    title: "सोलापुरात घडवलेले, परंपरेने पावन",
    p1: "R. Ramesh Arts दोन दशकांहून अधिक काळ पवित्र मूर्ती घडवत आहे, सोलापूरच्या समृद्ध कलात्मक वारशात रुजलेले. प्रत्येक मूर्ती कुशल कारागिरांकडून पिढ्यान्‌पिढ्या चालत आलेल्या पारंपरिक तंत्रांनी हाताने घडवली जाते — नाजूक शाडू मातीच्या कामापासून ते सूक्ष्म फायबर कलेपर्यंत.",
    p2: "आमचे शहर श्रद्धेय आजोबा गणपतीचे निवासस्थान आहे — शुक्रवार पेठेत 1885 मध्ये स्थापन झालेला आणि भारतातील सर्वात जुन्या सार्वजनिक गणेशोत्सवांपैकी एक, सार्वजनिक गणेशोत्सव परंपरेहूनही जुना. हा 'मानाचा' गणपती सोलापूरचा चिरंतन अभिमान आहे, आणि त्याची भक्ती आमच्या प्रत्येक मूर्तीला प्रेरणा देते.",
    cta: "आमची कथा वाचा",
    estLabel: "स्थापना",
    caption: "आजोबा गणपती — सोलापूरचा अभिमान",
  },
};

export default async function Home() {
  const products = await getProducts();
  const accessories = await getAccessories();
  const locale = getLocale();
  const t = getDict(locale);
  const h = HERITAGE[locale] ?? HERITAGE.en;

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <Image src="/images/hero-idol.jpg" alt="Handcrafted Ganesha idol" fill sizes="100vw" className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
        <div className="site-wrap relative w-full">
          <div className="reveal max-w-xl">
            <div className="mb-5 text-[0.78rem] uppercase tracking-[0.34em] text-peach">
              {t.heroKicker}
            </div>
            <h1 className="text-[clamp(2.6rem,5vw,4.6rem)] leading-[1.02] text-white">
              {t.heroTitleMain} <span className="italic text-peach">{t.heroTitleAccent}</span>
            </h1>
            <p className="my-6 max-w-md font-display text-[1.15rem] italic leading-relaxed text-cream/90">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/shop" className="btn-primary">{t.exploreCollections}</Link>
            </div>
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

      {/* VISIT STUDIO */}
      <section className="bg-cream py-[90px]">
        <div className="site-wrap">
          <SectionHeading kicker="Visit Us" title="Visit Our Solapur Studio" sub="See it, check it, and choose with confidence — every doubt cleared in person." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Link href="/contact" className="group flex flex-col overflow-hidden rounded-xl2 shadow-soft">
              <div className="relative aspect-square w-full overflow-hidden bg-cream-deep">
                <img src="/images/studio-open.jpg" alt="Open all year round" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col bg-gold p-5">
                <h3 className="font-display text-base font-semibold leading-snug text-ink">Open All Year Round</h3>
                <p className="mt-2 text-sm text-ink-soft">Drop by any day — our Solapur workshop stays open through the year, so you can plan your visit without worry.</p>
                <span className="mt-auto inline-flex h-9 w-9 items-center justify-center self-start rounded-full border border-ink/40 text-lg text-ink transition group-hover:bg-ink group-hover:text-white">→</span>
              </div>
            </Link>
            <Link href="/contact" className="group flex flex-col overflow-hidden rounded-xl2 shadow-soft">
              <div className="relative aspect-square w-full overflow-hidden bg-cream-deep">
                <img src="/images/studio-quality.jpg" alt="Check strength and finish" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col bg-sage p-5">
                <h3 className="font-display text-base font-semibold leading-snug text-ink">Check Strength and Finish Yourself</h3>
                <p className="mt-2 text-sm text-ink-soft">Lift it, look closely, feel the finish — judge the quality with your own hands before you decide.</p>
                <span className="mt-auto inline-flex h-9 w-9 items-center justify-center self-start rounded-full border border-ink/40 text-lg text-ink transition group-hover:bg-ink group-hover:text-white">→</span>
              </div>
            </Link>
            <Link href="/contact" className="group flex flex-col overflow-hidden rounded-xl2 shadow-soft">
              <div className="relative aspect-square w-full overflow-hidden bg-cream-deep">
                <img src="/images/studio-material.jpg" alt="Pick the right material" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col bg-gold p-5">
                <h3 className="font-display text-base font-semibold leading-snug text-ink">Pick the Right Material</h3>
                <p className="mt-2 text-sm text-ink-soft">Understand POP, fibre and Shadu Mati so you can choose the idol that suits your home and budget.</p>
                <span className="mt-auto inline-flex h-9 w-9 items-center justify-center self-start rounded-full border border-ink/40 text-lg text-ink transition group-hover:bg-ink group-hover:text-white">→</span>
              </div>
            </Link>
            <Link href="/contact" className="group flex flex-col overflow-hidden rounded-xl2 shadow-soft">
              <div className="relative aspect-square w-full overflow-hidden bg-cream-deep">
                <img src="/images/studio-care.jpg" alt="Care and handling guidance" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col bg-sage p-5">
                <h3 className="font-display text-base font-semibold leading-snug text-ink">Guidance on Care and Handling</h3>
                <p className="mt-2 text-sm text-ink-soft">Learn how to carry, place and look after your idol safely, right up to visarjan — without cracks.</p>
                <span className="mt-auto inline-flex h-9 w-9 items-center justify-center self-start rounded-full border border-ink/40 text-lg text-ink transition group-hover:bg-ink group-hover:text-white">→</span>
              </div>
            </Link>
            <Link href="/contact" className="group flex flex-col overflow-hidden rounded-xl2 shadow-soft">
              <div className="relative aspect-square w-full overflow-hidden bg-cream-deep">
                <img src="/images/studio-real.jpg" alt="Real idols, no edited photos" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col bg-gold p-5">
                <h3 className="font-display text-base font-semibold leading-snug text-ink">Real Idols, No Edited Photos</h3>
                <p className="mt-2 text-sm text-ink-soft">What you see in our studio is exactly what you take home — genuine idols, no surprises.</p>
                <span className="mt-auto inline-flex h-9 w-9 items-center justify-center self-start rounded-full border border-ink/40 text-lg text-ink transition group-hover:bg-ink group-hover:text-white">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* HERITAGE */}
      <section className="bg-[radial-gradient(900px_500px_at_85%_30%,rgba(242,201,168,.35),transparent_60%)] py-[90px]">
        <div className="site-wrap grid items-center gap-12 md:grid-cols-[0.82fr_1.18fr]">
          <div>
            <span className="inline-block rounded-full bg-terracotta/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-terracotta">{h.kicker}</span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">{h.title}</h2>
            <p className="mt-6 max-w-md text-ink-soft">{h.p1}</p>
            <p className="mt-4 max-w-md text-ink-soft">{h.p2}</p>
            <Link href="/about" className="btn-primary mt-8 inline-block">{h.cta}</Link>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 border border-line shadow-soft">
              <Image src="/images/aajoba-ganapati.jpg" alt="Aajoba Ganapati - Pride of Solapur" fill sizes="(max-width: 500px) 100vw, 55vw" className="object-cover" />
            </div>
            <div className="relative z-10 -mt-14 ml-auto mr-3 grid h-28 w-28 place-items-center rounded-full bg-terracotta text-center text-white shadow-soft">
              <div>
                <div className="text-[0.62rem] uppercase tracking-[0.18em] opacity-90">{h.estLabel}</div>
                <div className="font-display text-2xl leading-none">2002</div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm font-medium text-ink-soft">{h.caption}</p>
          </div>
        </div>
      </section>



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
