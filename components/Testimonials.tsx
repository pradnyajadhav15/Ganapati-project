import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Jaswand } from "@/components/Botanical";
import { getTestimonials } from "@/lib/testimonials";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export default async function Testimonials() {
  const items = await getTestimonials();
  const t = getDict(getLocale());

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-cream-deep py-[100px]">
      {/* warm ambient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_360px_at_15%_0%,rgba(242,201,168,.45),transparent_65%),radial-gradient(700px_360px_at_85%_100%,rgba(175,194,168,.35),transparent_65%)]"
      />
      <Jaswand stroke className="pointer-events-none absolute -right-14 -top-10 hidden w-[300px] text-terracotta-deep/[0.09] lg:block" />
      <Jaswand stroke className="pointer-events-none absolute -bottom-16 -left-16 hidden w-[240px] text-sage-deep/[0.08] lg:block" />
      <div className="site-wrap relative">
        <SectionHeading kicker={t.kindWords} title={t.customerSay} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 90}>
              <figure className="card-lux group relative flex h-full flex-col p-8 pt-10">
                {/* oversized quote glyph */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-3 font-display text-[5rem] leading-none text-gold/15 transition-colors duration-500 group-hover:text-gold/25"
                >
                  &rdquo;
                </span>

                <div className="mb-4 text-[0.95rem] tracking-[0.15em]">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={s < item.rating ? "text-gold" : "text-ink/15"}>★</span>
                  ))}
                </div>

                <blockquote className="relative flex-1 font-display text-[1.05rem] italic leading-relaxed text-ink-soft">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-line-soft pt-5">
                  {item.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.image_url}
                      alt={item.customer_name}
                      className="h-11 w-11 flex-none rounded-full object-cover ring-2 ring-gold/40 ring-offset-2 ring-offset-white"
                    />
                  ) : (
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-cream-deep font-display text-lg text-sage-deep ring-2 ring-gold/30 ring-offset-2 ring-offset-white">
                      {item.customer_name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <div className="font-display text-[1.05rem] text-ink">{item.customer_name}</div>
                    {item.city ? (
                      <div className="text-xs uppercase tracking-[0.16em] text-sage-deep">{item.city}</div>
                    ) : null}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
