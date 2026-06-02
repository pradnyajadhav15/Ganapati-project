import PageHero from "@/components/PageHero";
import { getLocale } from "@/lib/locale";
import { getDict, type Dict } from "@/lib/i18n";

export const metadata = { title: "Media Coverage - R. Ramesh Arts Studio" };

const videos = [
  { titleKey: "videoStudioTour", id: "mJO0CykniaU" },
  { titleKey: "videoPopMaking", id: "WXhY8IxtP8s" },
  { titleKey: "videoRandomDay", id: "CFeRdhuUDXg" },
] as const;

export default function Page() {
  const t = getDict(getLocale());

  return (
    <>
      <PageHero kicker={t.inTheSpotlight} title={t.mediaCoverage} swatch="from-rose to-peach" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto mb-12 max-w-2xl text-center text-ink-soft">
          <p>{t.mediaIntro}</p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {videos.map((v) => (
            <a key={v.id} href={"https://www.youtube.com/watch?v=" + v.id} target="_blank" rel="noreferrer" className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-white transition hover:-translate-y-1.5 hover:shadow-soft">
              <div className="relative aspect-video overflow-hidden bg-cream-deep">
                <img src={"https://img.youtube.com/vi/" + v.id + "/hqdefault.jpg"} alt={t[v.titleKey as keyof Dict]} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 grid place-items-center bg-black/15 transition group-hover:bg-black/25">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 shadow-soft">
                    <svg viewBox="0 0 24 24" fill="#D9534F" className="ml-0.5 h-6 w-6"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </div>
              </div>
              <div className="p-4 font-display text-[1.05rem]">{t[v.titleKey as keyof Dict]}</div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="https://www.youtube.com/@R.RameshArts" target="_blank" rel="noreferrer" className="btn-ghost">{t.visitYoutube}</a>
        </div>
      </section>
    </>
  );
}