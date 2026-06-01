import PageHero from "@/components/PageHero";
import Image from "next/image";

export const metadata = { title: "About Us - R. Ramesh Arts Studio" };

const team = [
  {
    name: "Mr. Ramesh Raichurkar",
    role: "Founder & Master Artist",
    bio: "Solapur's No. 1 name for colour and detailing, sculpting Ganpati idols since 2002.",
    image: "/images/team/ramesh.jpg",
  },
  {
    name: "Mr. Suhas Raichurkar",
    role: "Co-Founder",
    bio: "An engineer who chose to carry the family legacy forward, leading production and innovation.",
    image: "/images/team/cofounder.jpg",
  },
  {
    name: "Mr. Amar Jakkan",
    role: "Studio Manager",
    bio: "Ensuring every order reaches your home with care, on time, every season.",
    image: "/images/team/manager.jpg",
  },
];

export default function Page() {
  return (
    <>
      <PageHero kicker="Our Story" title="About Us" swatch="from-peach to-rose" />

      <section className="site-wrap py-[80px]">
        <div className="mx-auto max-w-2xl space-y-5 text-ink-soft">
          <p>
            Ramesh Raichurkar is a dedicated school clerk by profession and a
            passionate artist at heart. In 2002 he founded R. Ramesh Arts, a
            Ganpati idol-making studio that has grown into a trusted name in
            Solapur.
          </p>
          <p>
            For over two decades he has sculpted not just idols, but emotions,
            transforming simple clay into the divine presence of Lord Ganesha.
            Renowned as the No. 1 name in Solapur for colour and detailing, his
            work brings vibrant shades and soulful craftsmanship to every
            festival season.
          </p>
        </div>

        <blockquote className="mx-auto mt-10 max-w-2xl border-l-4 border-gold pl-6 font-display text-2xl italic text-ink">
          &quot;Every Ganpati idol should carry a soul, not just a shape.&quot;
          <span className="mt-2 block text-sm not-italic text-ink-soft">- Ramesh Raichurkar</span>
        </blockquote>
      </section>

      <section className="bg-cream-deep py-[80px]">
        <div className="site-wrap">
          <div className="mb-12 text-center">
            <div className="kicker mb-3">The People Behind the Clay</div>
            <h2 className="text-[clamp(2rem,3.5vw,2.9rem)]">Meet Our Team</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((m) => (
              <div key={m.role} className="text-center">
                <div className="relative mx-auto mb-4 h-[150px] w-[150px] overflow-hidden rounded-full border-4 border-white shadow-soft">
                  <Image src={m.image} alt={m.name} fill className="object-cover" />
                </div>
                <h3 className="text-[1.3rem]">{m.name}</h3>
                <div className="my-2 text-[0.82rem] uppercase tracking-[0.16em] text-gold">{m.role}</div>
                <p className="mx-auto max-w-[280px] text-[0.92rem] text-ink-soft">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-wrap py-[80px] text-center">
        <blockquote className="mx-auto max-w-2xl font-display text-xl italic text-ink-soft">
          &quot;Work with your heart, not just your hands. Make every creation a prayer.&quot;
          <span className="mt-2 block text-sm not-italic">- Suhas Raichurkar</span>
        </blockquote>
      </section>
    </>
  );
}