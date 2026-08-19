import Reveal from "@/components/Reveal";

export default function SectionHeading({
  kicker,
  title,
  sub,
  tone = "dark",
}: {
  kicker: string;
  title: string;
  sub?: string;
  tone?: "dark" | "light";
}) {
  const titleColor = tone === "light" ? "text-white" : "text-ink";
  const subColor = tone === "light" ? "text-white/75" : "text-ink-soft";

  return (
    <Reveal className="mb-12 text-center">
      <div className="ornament mb-4">
        <span className="kicker">{kicker}</span>
      </div>
      <h2 className={"text-[clamp(2rem,3.5vw,2.9rem)] leading-[1.08] " + titleColor}>{title}</h2>
      <div className="mx-auto mt-5 flex items-center justify-center gap-2" aria-hidden="true">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
      </div>
      {sub && <p className={"mx-auto mt-5 max-w-xl leading-relaxed " + subColor}>{sub}</p>}
    </Reveal>
  );
}
