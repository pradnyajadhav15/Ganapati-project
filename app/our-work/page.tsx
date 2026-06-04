import GalleryGrid from "@/components/GalleryGrid";
import { getGalleryImages } from "@/lib/gallery";
import { getLocale } from "@/lib/locale";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Work - R. Ramesh Arts Studio",
  description: "A gallery of handcrafted Ganpati idols and finished work by R. Ramesh Arts Studio, Solapur.",
};

const T = {
  en: {
    kicker: "Our Work",
    title: "Handcrafted, One Idol at a Time",
    sub: "A look at idols we have sculpted and the celebrations they have been part of.",
    empty: "Our gallery is coming soon.",
  },
  hi: {
    kicker: "हमारा काम",
    title: "हर मूर्ति, हाथों से बनाई गई",
    sub: "हमारे द्वारा गढ़ी गई मूर्तियों और उन उत्सवों की एक झलक जिनका वे हिस्सा रहीं।",
    empty: "हमारी गैलरी जल्द ही आ रही है।",
  },
  mr: {
    kicker: "आमचे काम",
    title: "प्रत्येक मूर्ती, हाताने घडवलेली",
    sub: "आम्ही घडवलेल्या मूर्ती आणि त्या ज्या उत्सवांचा भाग होत्या त्याची एक झलक.",
    empty: "आमची गॅलरी लवकरच येत आहे.",
  },
};

export default async function OurWorkPage() {
  const images = await getGalleryImages();
  const locale = getLocale();
  const t = T[locale] ?? T.en;

  return (
    <section className="site-wrap py-[70px]">
      <div className="mb-10 text-center">
        <div className="mb-3 text-[0.78rem] uppercase tracking-[0.34em] text-sage-deep">{t.kicker}</div>
        <h1 className="text-[clamp(2rem,4vw,3rem)]">{t.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">{t.sub}</p>
      </div>

      {images.length === 0 ? (
        <p className="text-center text-ink-soft">{t.empty}</p>
      ) : (
        <GalleryGrid images={images.map((i) => ({ id: i.id, image_url: i.image_url, caption: i.caption }))} />
      )}
    </section>
  );
}
