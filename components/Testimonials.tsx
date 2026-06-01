import SectionHeading from "@/components/SectionHeading";

// REPLACE these with real customer reviews before going live.
const testimonials = [
  { quote: "The detailing and colour work on our Ganpati was stunning. Everyone at home was amazed.", name: "Rohan Patil", city: "Pune" },
  { quote: "Ordered a custom idol and it came out exactly as we imagined. Beautiful craftsmanship.", name: "Sneha Kulkarni", city: "Solapur" },
  { quote: "Lovely finish and delivered well before the festival. Will order again next year.", name: "Amit Deshmukh", city: "Mumbai" },
  { quote: "Our mandal has been buying from R. Ramesh Arts for years. Always reliable, always beautiful.", name: "Mahesh Jadhav", city: "Solapur" },
  { quote: "Packed very safely and reached us without a scratch. Highly recommended.", name: "Priya Shah", city: "Nashik" },
];

export default function Testimonials() {
  return (
    <section className="bg-cream-deep py-[90px]">
      <div className="site-wrap">
        <SectionHeading kicker="Kind Words" title="What Our Customers Say" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-xl2 border border-line bg-white p-7">
              <p className="italic text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 font-display text-[1.05rem] text-ink">{t.name}</div>
              <div className="text-xs uppercase tracking-[0.16em] text-sage-deep">{t.city}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}