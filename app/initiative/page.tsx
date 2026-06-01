import PageHero from "@/components/PageHero";

export const metadata = { title: "Initiative - R. Ramesh Arts Studio" };

const stats = [
  { n: "100%", l: "Natural Shadu Mati" },
  { n: "0", l: "Toxic Chemicals" },
  { n: "20+", l: "Years of Craft" },
];

export default function Page() {
  return (
    <>
      <PageHero kicker="Our Green Option" title="Eco-Friendly Idols" swatch="from-sage to-sage-deep" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-2xl text-center text-ink-soft">
          <p className="text-lg leading-relaxed">
            Alongside our range, we proudly craft eco-friendly Shadu Mati idols,
            shaped from natural clay that dissolves cleanly in water. For devotees
            who want a greener Ganesh Chaturthi, it is a beautiful and traditional
            choice.
          </p>
          <p className="mt-5 leading-relaxed">
            We are committed to keeping this ancient craft alive. We encourage
            clean, responsible immersion, work with our local community, and train
            young artisans so the art of natural-clay idol making continues for the
            next generation.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl2 bg-cream-deep p-8 text-center">
              <div className="font-display text-5xl text-terracotta">{s.n}</div>
              <div className="mt-2 text-[0.85rem] uppercase tracking-[0.16em] text-sage-deep">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}