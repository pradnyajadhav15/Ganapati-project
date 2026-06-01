export default function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-12 text-center">
      <div className="kicker mb-3">{kicker}</div>
      <h2 className="text-[clamp(2rem,3.5vw,2.9rem)]">{title}</h2>
      {sub && (
        <p className="mx-auto mt-3.5 max-w-xl text-ink-soft">{sub}</p>
      )}
    </div>
  );
}
