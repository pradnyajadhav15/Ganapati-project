import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = { title: "Partnership - R. Ramesh Arts Studio" };

export default function Page() {
  return (
    <>
      <PageHero kicker="Grow With Us" title="Become a Partner" swatch="from-peach to-terracotta" />
      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-2xl space-y-5 text-center text-ink-soft">
          <p>Partner with one of Solapur&apos;s most trusted names in Ganpati idols.</p>
          <p>
            For over two decades, R. Ramesh Arts Studio has been known for its
            colour work and fine detailing, crafting idols in plaster, Shadu Mati
            and fiber across a wide range of sizes and styles.
          </p>
          <p>
            Whether you are a retailer, a decorator, or a mandal organising
            celebrations, we can supply beautifully finished, hand-painted idols
            in the quantities you need, season after season.
          </p>
          <p>
            As a partner, you get competitive pricing, priority production during
            the festival rush, and a reliable supply you can count on. We will
            work closely with you so every idol you offer carries the quality our
            name stands for.
          </p>
          <p className="font-display text-xl italic text-ink">
            Let&apos;s bring devotion and craftsmanship to more homes, together.
          </p>
        </div>
        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">Partner With Us</Link>
        </div>
      </section>
    </>
  );
}