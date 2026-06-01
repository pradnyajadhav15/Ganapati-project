export default function PageHero({
  kicker,
  title,
  swatch = "from-peach to-rose",
}: {
  kicker: string;
  title: string;
  swatch?: string;
}) {
  return (
    <section
      className={`relative flex min-h-[42vh] items-center justify-center bg-gradient-to-br ${swatch} text-center`}
    >
      <div className="reveal site-wrap">
        <div className="mb-3 text-[0.78rem] uppercase tracking-[0.34em] text-ink/70">
          {kicker}
        </div>
        <h1 className="text-[clamp(2.4rem,5vw,3.8rem)]">{title}</h1>
      </div>
    </section>
  );
}
