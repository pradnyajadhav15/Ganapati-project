import SectionHeading from "@/components/SectionHeading";
import { getLocale } from "@/lib/locale";
import { getDict, type Dict } from "@/lib/i18n";

const testimonials = [
  { qKey: "testi1Q", name: "Rohan Patil", cityKey: "cityPune" },
  { qKey: "testi2Q", name: "Sneha Kulkarni", cityKey: "citySolapur" },
  { qKey: "testi3Q", name: "Amit Deshmukh", cityKey: "cityMumbai" },
  { qKey: "testi4Q", name: "Mahesh Jadhav", cityKey: "citySolapur" },
  { qKey: "testi5Q", name: "Priya Shah", cityKey: "cityNashik" },
] as const;

export default function Testimonials() {
  const t = getDict(getLocale());

  return (
    <section className="bg-cream-deep py-[90px]">
      <div className="site-wrap">
        <SectionHeading kicker={t.kindWords} title={t.customerSay} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((r, i) => (
            <div key={i} className="rounded-xl2 border border-line bg-white p-7">
              <p className="italic text-ink-soft">&ldquo;{t[r.qKey as keyof Dict]}&rdquo;</p>
              <div className="mt-4 font-display text-[1.05rem] text-ink">{r.name}</div>
              <div className="text-xs uppercase tracking-[0.16em] text-sage-deep">{t[r.cityKey as keyof Dict]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}