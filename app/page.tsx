import Link from "next/link";
import { BLUR_DATA_URL } from "@/lib/image-placeholder";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import SeasonCountdown from "@/components/SeasonCountdown";
import { Lotus, Jaswand } from "@/components/Botanical";
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

const STUDIO_POINTS = [
  {
    img: "/images/studio-open.jpg",
    title: "Open All Year Round",
    body: "Drop by any day — our Solapur workshop stays open through the year, so you can plan your visit without worry.",
  },
  {
    img: "/images/studio-quality.jpg",
    title: "Check Strength and Finish Yourself",
    body: "Lift it, look closely, feel the finish — judge the quality with your own hands before you decide.",
  },
  {
    img: "/images/studio-material.jpg",
    title: "Pick the Right Material",
    body: "Understand POP, fibre and Shadu Mati so you can choose the idol that suits your home and budget.",
  },
  {
    img: "/images/studio-care.jpg",
    title: "Guidance on Care and Handling",
    body: "Learn how to carry, place and look after your idol safely, right up to visarjan — without cracks.",
  },
  {
    img: "/images/studio-real.jpg",
    title: "Real Idols, No Edited Photos",
    body: "What you see in our studio is exactly what you take home — genuine idols, no surprises.",
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
      <section className="relative flex min-h-hero items-center overflow-hidden">
        <Image
          src="/images/hero-idol.jpg"
          alt="Handcrafted Ganesha idol"
          fill
          sizes="100vw"
          className="animate-kenburns object-cover object-center"
          priority
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
        {/* layered cinematic scrims */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />

        <div className="site-wrap relative w-full">
          <div className="reveal-stagger max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold-light/80" />
              <span className="text-[0.74rem] uppercase tracking-luxe text-gold-light">
                {t.heroKicker}
              </span>
            </div>

            <h1 className="mt-6 text-[clamp(2.7rem,5.4vw,4.9rem)] font-medium leading-[1.02] text-white [text-shadow:0_2px_30px_rgba(0,0,0,.35)]">
              {t.heroTitleMain}{" "}
              <span className="gold-text italic">{t.heroTitleAccent}</span>
            </h1>

            <p className="my-7 max-w-md font-display text-[1.18rem] italic leading-relaxed text-cream/90">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-3.5">
              <Link href="/shop" className="btn-gold">
                {t.exploreCollections}
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/customized-work"
                className="btn-ghost border-white/70 text-white hover:border-white hover:bg-white hover:text-ink"
              >
                {t.customizedWork}
              </Link>
            </div>

            {/* hero trust row */}
            <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-6">
              {[
                ["2002", t.estSince],
                ["5.0★", t.googleRated],
                ["100%", t.handPainted],
              ].map(([big, small]) => (
                <div key={big as string}>
                  <div className="font-display text-[1.5rem] leading-none text-gold-light">{big}</div>
                  <div className="mt-1.5 text-[0.66rem] uppercase tracking-[0.2em] text-white/70">{small}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block" aria-hidden="true">
          <div className="animate-floaty grid place-items-center gap-2">
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/60">Scroll</span>
            <span className="h-9 w-px bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      </section>

      <SeasonCountdown />

      {/* FEATURED */}
      <section className="site-wrap py-[100px]">
        <SectionHeading kicker={t.ourCollections} title={t.featuredMurtis} sub={t.featuredSub} />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link href="/shop" className="btn-ghost">
            {t.viewAll}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>
      </section>

      {/* GANPATI SHASTRA */}
      {accessories.length > 0 && (
        <section className="relative overflow-hidden bg-cream-deep py-[100px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_380px_at_50%_-5%,rgba(255,255,255,.7),transparent_70%)]"
          />
          <div className="site-wrap relative">
            <SectionHeading kicker={t.toolsAccessories} title={t.ganpatiShastra} sub={t.shastraSub} />
            <Reveal>
              <AccessoryGrid accessories={accessories.slice(0, 5)} />
            </Reveal>
            <Reveal className="mt-12 flex flex-wrap justify-center gap-3">
              <Link href="/collections/accessories" className="btn-ghost">{t.viewAll}</Link>
              <a href="https://wa.me/917020290393" target="_blank" rel="noreferrer" className="btn-primary">{t.enquireWhatsApp}</a>
            </Reveal>
          </div>
        </section>
      )}

      {/* VISIT STUDIO */}
      <section className="bg-cream-veil py-[100px]">
        <div className="site-wrap">
          <SectionHeading
            kicker="Visit Us"
            title="Visit Our Solapur Studio"
            sub="See it, check it, and choose with confidence — every doubt cleared in person."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STUDIO_POINTS.map((pt, i) => (
              <Reveal key={pt.title} delay={i * 80}>
                <Link
                  href="/contact"
                  className="group flex h-full flex-col overflow-hidden rounded-xl2 border border-line-soft bg-white shadow-lux transition-all duration-500 hover:-translate-y-2 hover:shadow-lift"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-cream-deep">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pt.img}
                      alt={pt.title}
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.08]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                    <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/90 font-display text-xs font-semibold text-ink-deep shadow-lux backdrop-blur">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col bg-white p-5">
                    <h3 className="font-display text-base font-semibold leading-snug text-ink">{pt.title}</h3>
                    <p className="mt-2 pb-5 text-sm leading-relaxed text-ink-soft">{pt.body}</p>
                    <span className="mt-auto inline-flex h-9 w-9 items-center justify-center self-start rounded-full border border-gold/45 text-lg text-gold-deep transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                      &rarr;
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GOOGLE RATING */}
      <section className="site-wrap py-12 text-center">
        <Reveal>
          <a
            href="https://g.page/r/CYDuo4LYTn3-EAE/review"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-line bg-white px-7 py-4 shadow-lux transition-all duration-500 hover:-translate-y-0.5 hover:border-gold/45 hover:shadow-glow"
          >
            <span className="tracking-[0.18em] text-gold">★★★★★</span>
            <span className="font-display text-[1.1rem] font-semibold text-ink">5.0 on Google</span>
            <span className="hidden h-4 w-px bg-line sm:block" />
            <span className="text-sm text-ink-soft transition-colors group-hover:text-ink">
              See our reviews
              <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </span>
          </a>
        </Reveal>
      </section>

      {/* HERITAGE */}
      <section className="relative overflow-hidden py-[100px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_85%_30%,rgba(242,201,168,.40),transparent_62%),radial-gradient(700px_420px_at_5%_85%,rgba(175,194,168,.28),transparent_65%)]"
        />
        {/* botanical wash — texture, not decoration, so it stays very faint */}
        <Lotus className="pointer-events-none absolute -left-16 bottom-4 hidden w-[420px] text-sage-deep/[0.07] md:block" />
        <div className="site-wrap relative grid items-center gap-14 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/25 bg-terracotta/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-terracotta-deep">
              <span className="h-1 w-1 rotate-45 bg-terracotta-deep" />
              {h.kicker}
            </span>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3.2rem)] leading-[1.06]">{h.title}</h2>
            <div className="mt-6 max-w-md border-l-2 border-gold/40 pl-5">
              <p className="text-ink-soft">{h.p1}</p>
              <p className="mt-4 text-ink-soft">{h.p2}</p>
            </div>
            <Link href="/about" className="btn-primary mt-9">
              {h.cta}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>

          <Reveal delay={140}>
            <div className="mx-auto w-full max-w-sm">
              <div className="frame-lux relative aspect-[4/5] overflow-hidden rounded-xl3 shadow-lift ring-1 ring-gold/25">
                <Image
                  src="/images/aajoba-ganapati.jpg"
                  alt="Aajoba Ganapati - Pride of Solapur"
                  fill
                  sizes="(max-width: 500px) 100vw, 55vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:scale-[1.04]"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
              </div>

              {/* Est. medallion */}
              <div className="relative z-10 -mt-14 ml-auto mr-4 grid h-28 w-28 place-items-center rounded-full bg-gold-sheen p-[2px] shadow-lift">
                <div className="grid h-full w-full place-items-center rounded-full bg-[linear-gradient(160deg,#C08A68,#B97E5E)] text-center text-white">
                  <div>
                    <div className="text-[0.6rem] uppercase tracking-[0.2em] opacity-90">{h.estLabel}</div>
                    <div className="font-display text-2xl leading-none">2002</div>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center text-sm font-medium tracking-wide text-ink-soft">{h.caption}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRESS / STORIES */}
      <section className="site-wrap py-14">
        <Reveal className="rounded-xl3 border border-line-soft bg-white/70 px-8 py-10 text-center shadow-lux backdrop-blur-sm">
          <p className="kicker mb-3">As Featured In</p>
          <div className="flex flex-col items-center justify-center gap-x-8 gap-y-3 sm:flex-row">
            <a
              href="/media-coverage"
              className="group font-display text-[1.05rem] text-ink-soft transition-colors hover:text-ink"
            >
              See where R. Ramesh Arts Studio has been covered
              <span className="ml-1.5 inline-block text-gold transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </a>
            <span className="hidden h-4 w-px bg-line sm:block" />
            <a
              href="/blog"
              className="group font-display text-[1.05rem] text-ink-soft transition-colors hover:text-ink"
            >
              Read Our Stories
              <span className="ml-1.5 inline-block text-gold transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </Reveal>
      </section>

      <Testimonials />

      {/* WHY */}
      <section className="site-wrap py-[100px]">
        <SectionHeading kicker={t.whyChooseUs} title={t.craftedWithCare} />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.hKey} delay={i * 90}>
              <div className="group h-full rounded-xl2 border border-line-soft bg-white px-6 py-9 text-center shadow-lux transition-all duration-500 hover:-translate-y-2 hover:border-gold/35 hover:shadow-lift">
                <div className="relative mx-auto mb-5 grid h-[62px] w-[62px] place-items-center rounded-2xl bg-[linear-gradient(150deg,#AFC2A8,#7E9676)] text-white shadow-lux transition-transform duration-500 group-hover:scale-105">
                  <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30" aria-hidden="true" />
                  {f.icon}
                </div>
                <h3 className="mb-2 text-[1.1rem] leading-snug">{t[f.hKey as keyof Dict]}</h3>
                <p className="text-[0.86rem] leading-relaxed text-ink-soft">{t[f.pKey as keyof Dict]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden bg-ink-sheen py-[100px] text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_360px_at_50%_0%,rgba(201,162,75,.22),transparent_70%)]"
        />
        <div className="site-wrap relative">
          <Reveal>
            <div className="ornament mb-5">
              <span className="kicker text-gold-light">R. Ramesh Arts Studio</span>
            </div>
            <h2 className="mx-auto max-w-2xl text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.1] text-cream">
              Bring home a murti made <span className="gold-text italic">by hand</span>, not by machine.
            </h2>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-cream/70">
              Every idol leaves our Solapur workshop finished, checked and blessed by two decades of craft.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3.5">
              <Link href="/shop" className="btn-gold">
                {t.exploreCollections}
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/contact"
                className="btn-ghost border-cream/60 text-cream hover:border-cream hover:bg-cream hover:text-ink"
              >
                {t.contactUs}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
