export default function PageHero({
  kicker,
  title,
  sub,
  swatch = "from-peach to-rose",
}: {
  kicker: string;
  title: string;
  sub?: string;
  swatch?: string;
}) {
  return (
    <section
      className={`relative flex min-h-[46vh] items-center justify-center overflow-hidden bg-gradient-to-br ${swatch} text-center`}
    >
      {/* luminous centre + soft vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_340px_at_50%_18%,rgba(255,255,255,.55),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_100%,rgba(51,41,31,.16),transparent_60%)]"
      />
      {/* fade into the page below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-cream"
      />

      <div className="reveal site-wrap relative py-16">
        <div className="ornament mb-4">
          <span className="text-[0.74rem] uppercase tracking-luxe text-ink/65">{kicker}</span>
        </div>
        <h1 className="text-[clamp(2.4rem,5vw,3.9rem)] leading-[1.06] text-ink">{title}</h1>
        <div className="mx-auto mt-5 flex items-center justify-center gap-2" aria-hidden="true">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-ink/30" />
          <span className="h-1.5 w-1.5 rotate-45 bg-ink/40" />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-ink/30" />
        </div>
        {sub && (
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink/70">{sub}</p>
        )}
      </div>
    </section>
  );
}
