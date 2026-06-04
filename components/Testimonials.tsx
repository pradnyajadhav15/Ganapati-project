import SectionHeading from "@/components/SectionHeading";
import { getTestimonials } from "@/lib/testimonials";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export default async function Testimonials() {
  const items = await getTestimonials();
  const t = getDict(getLocale());

  if (items.length === 0) return null;

  return (
    <section className="bg-cream-deep py-[90px]">
      <div className="site-wrap">
        <SectionHeading kicker={t.kindWords} title={t.customerSay} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl2 border border-line bg-white p-7">
              <div className="mb-3 text-[0.95rem] tracking-[0.15em]">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className={s < item.rating ? "text-[#E0A458]" : "text-ink/20"}>★</span>
                ))}
              </div>
              <p className="italic text-ink-soft">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                {item.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.image_url} alt={item.customer_name} className="h-10 w-10 flex-none rounded-full object-cover" />
                ) : null}
                <div>
                  <div className="font-display text-[1.05rem] text-ink">{item.customer_name}</div>
                  {item.city ? (
                    <div className="text-xs uppercase tracking-[0.16em] text-sage-deep">{item.city}</div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
