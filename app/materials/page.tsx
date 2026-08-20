import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { MATERIALS } from "@/lib/materials";
import { getProducts, formatINR } from "@/lib/products";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Which Ganpati Idol Material Should You Choose? — R. Ramesh Arts Studio",
  description:
    "Shadu Mati, plaster or fibre — how the materials differ in finish, weight, immersion and reuse, so you can pick the right Ganpati idol for your home.",
};

const T = {
  en: {
    kicker: "Choosing your murti",
    title: "Which Material Is Right for You?",
    sub: "Every idol we make is hand-sculpted and hand-painted. What changes between them is the material — and that decides how it feels, how you carry it, and what happens at visarjan.",
    finish: "Finish",
    weight: "Weight",
    immersion: "At visarjan",
    reuse: "Lasts",
    bestFor: "Best for",
    price: "In our shop",
    none: "None listed right now",
    from: "from",
    browse: "Browse",
    helpTitle: "Still not sure?",
    helpBody:
      "Tell us the size you have in mind and where the murti will sit. We will tell you honestly which material suits it — including when the cheaper one is the right answer.",
    helpCta: "Ask us on WhatsApp",
    visit: "Or visit the studio in Solapur and see all three side by side.",
  },
  hi: {
    kicker: "अपनी मूर्ति चुनें",
    title: "आपके लिए कौन सी सामग्री सही है?",
    sub: "हमारी हर मूर्ति हाथ से गढ़ी और हाथ से रंगी जाती है। फर्क सामग्री का होता है — और वही तय करती है कि मूर्ति कैसी लगेगी, उठाने में कैसी होगी, और विसर्जन पर क्या होगा।",
    finish: "फिनिश",
    weight: "वज़न",
    immersion: "विसर्जन पर",
    reuse: "कितने समय",
    bestFor: "किसके लिए सबसे अच्छी",
    price: "हमारी दुकान में",
    none: "अभी कोई सूचीबद्ध नहीं",
    from: "से",
    browse: "देखें",
    helpTitle: "अब भी तय नहीं कर पा रहे?",
    helpBody:
      "हमें बताइए कि आप किस आकार की सोच रहे हैं और मूर्ति कहाँ रखी जाएगी। हम ईमानदारी से बताएँगे कि कौन सी सामग्री सही रहेगी — भले ही सस्ता विकल्प ही सही जवाब हो।",
    helpCta: "व्हाट्सएप पर पूछें",
    visit: "या सोलापुर स्टूडियो आइए और तीनों एक साथ देखिए।",
  },
  mr: {
    kicker: "तुमची मूर्ती निवडा",
    title: "तुमच्यासाठी कोणते साहित्य योग्य?",
    sub: "आमची प्रत्येक मूर्ती हाताने घडवली आणि हाताने रंगवली जाते. फरक साहित्याचा असतो — आणि तेच ठरवते की मूर्ती कशी दिसेल, उचलायला कशी असेल आणि विसर्जनाला काय होईल.",
    finish: "फिनिश",
    weight: "वजन",
    immersion: "विसर्जनाला",
    reuse: "किती काळ",
    bestFor: "कोणासाठी सर्वोत्तम",
    price: "आमच्या दुकानात",
    none: "सध्या यादीत नाही",
    from: "पासून",
    browse: "पाहा",
    helpTitle: "अजूनही ठरत नाही?",
    helpBody:
      "तुम्हाला कोणता आकार हवा आहे आणि मूर्ती कुठे ठेवणार ते सांगा. कोणते साहित्य योग्य आहे ते आम्ही प्रामाणिकपणे सांगू — स्वस्त पर्यायच योग्य असला तरीही.",
    helpCta: "व्हॉट्सअॅपवर विचारा",
    visit: "किंवा सोलापूरच्या स्टुडिओला भेट द्या आणि तिन्ही एकत्र पाहा.",
  },
} as const;

export default async function MaterialsPage() {
  const locale = getLocale();
  const t = T[locale] ?? T.en;
  const products = await getProducts();

  // Price ranges come from the live catalogue rather than being written down
  // here, so the guide cannot quote a figure the shop no longer sells at.
  const priceFor = (category: string) => {
    const prices = products.filter((p) => p.category === category).map((p) => p.price);
    if (!prices.length) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatINR(min) : `${formatINR(min)} – ${formatINR(max)}`;
  };

  return (
    <>
      <PageHero kicker={t.kicker} title={t.title} sub={t.sub} swatch="from-sage to-cream-deep" />

      <section className="site-wrap py-[80px]">
        <div className="grid gap-6 md:grid-cols-2">
          {MATERIALS.map((m, i) => {
            const traits = m.traits[locale] ?? m.traits.en;
            const price = priceFor(m.category);
            return (
              <Reveal key={m.category} delay={i * 80}>
                <div className={"h-full rounded-xl3 border border-line-soft p-7 shadow-lux ring-1 " + m.ring + " " + m.tint}>
                  <h2 className={"font-display text-[1.6rem] leading-tight " + m.accent}>
                    {m.name[locale] ?? m.name.en}
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">{m.tagline[locale] ?? m.tagline.en}</p>

                  <dl className="mt-6 space-y-3 border-t border-line-soft pt-5 text-sm">
                    <Row label={t.finish} value={traits.finish} />
                    <Row label={t.weight} value={traits.weight} />
                    <Row label={t.immersion} value={traits.immersion} />
                    <Row label={t.reuse} value={traits.reuse} />
                    <Row label={t.bestFor} value={traits.bestFor} />
                    <Row label={t.price} value={price ?? t.none} emphasis />
                  </dl>

                  {price && (
                    <Link
                      href={m.href}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-gold/50 underline-offset-4 transition hover:decoration-gold"
                    >
                      {t.browse} {m.name[locale] ?? m.name.en}
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12 rounded-xl3 border border-line-soft bg-white p-8 text-center shadow-lux">
          <h2 className="text-2xl">{t.helpTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-soft">{t.helpBody}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/917020290393"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              {t.helpCta}
            </a>
            <Link href="/contact" className="btn-ghost">
              {t.visit}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-3">
      <dt className="text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">{label}</dt>
      <dd className={emphasis ? "font-semibold text-ink" : "text-ink-soft"}>{value}</dd>
    </div>
  );
}
