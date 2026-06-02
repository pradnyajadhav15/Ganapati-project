import PageHero from "@/components/PageHero";
import Image from "next/image";
import { getLocale } from "@/lib/locale";
import { getDict, type Dict } from "@/lib/i18n";

export const metadata = { title: "About Us - R. Ramesh Arts Studio" };

const team = [
  { name: "Mr. Ramesh Raichurkar", roleKey: "roleFounder", bioKey: "bioRamesh", image: "/images/team/ramesh.jpg" },
  { name: "Mr. Suhas Raichurkar", roleKey: "roleCoFounder", bioKey: "bioSuhas", image: "/images/team/cofounder.jpg" },
  { name: "Mr. Amar Jakkan", roleKey: "roleStudioManager", bioKey: "bioAmar", image: "/images/team/manager.jpg" },
] as const;

export default function Page() {
  const t = getDict(getLocale());

  return (
    <>
      <PageHero kicker={t.ourStory} title={t.aboutUs} swatch="from-peach to-rose" />

      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-2xl space-y-5 text-ink-soft">
          <p>{t.aboutPara1}</p>
          <p>{t.aboutPara2}</p>
        </div>

        <blockquote className="mx-auto mt-10 max-w-2xl border-l-4 border-gold pl-6 font-display text-2xl italic text-ink">
          &quot;{t.aboutQuote1}&quot;
          <span className="mt-2 block text-sm not-italic text-ink-soft">- Ramesh Raichurkar</span>
        </blockquote>
      </section>

      <section className="bg-cream-deep py-[80px]">
        <div className="site-wrap">
          <div className="mb-12 text-center">
            <div className="kicker mb-3">{t.peopleBehindClay}</div>
            <h2 className="text-[clamp(2rem,3.5vw,2.9rem)]">{t.meetOurTeam}</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((m) => (
              <div key={m.roleKey} className="text-center">
                <div className="relative mx-auto mb-4 h-[150px] w-[150px] overflow-hidden rounded-full border-4 border-white shadow-soft">
                  <Image src={m.image} alt={m.name} fill className="object-cover" />
                </div>
                <h3 className="text-[1.3rem]">{m.name}</h3>
                <div className="my-2 text-[0.82rem] uppercase tracking-[0.16em] text-gold">{t[m.roleKey as keyof Dict]}</div>
                <p className="mx-auto max-w-[280px] text-[0.92rem] text-ink-soft">{t[m.bioKey as keyof Dict]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-wrap py-[80px] text-center">
        <blockquote className="mx-auto max-w-2xl font-display text-xl italic text-ink-soft">
          &quot;{t.aboutQuote2}&quot;
          <span className="mt-2 block text-sm not-italic">- Suhas Raichurkar</span>
        </blockquote>
      </section>
    </>
  );
}