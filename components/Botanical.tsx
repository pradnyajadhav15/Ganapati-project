/**
 * Botanical motifs drawn from what is actually offered to Ganpati, rather
 * than generic ornament: durva grass and jaswand (hibiscus), with lotus used
 * for the large background washes.
 *
 * Everything is inline SVG using currentColor, so there are no image assets
 * to manage and each mark inherits the colour of wherever it is placed.
 */

/** Three blades of durva grass — the offering most particular to Ganesha. */
export function DurvaMark({ className = "" }: { className?: string }) {
  // One well-shaped blade, fanned by rotation about a common base. Drawing
  // each blade separately made them uneven and the mark read as a spike.
  const blade = "M0 0C1.7-6 2.2-12.5 0-22c-2.2 9.5-1.7 16-0 22Z";
  return (
    <svg viewBox="0 0 52 28" className={className} fill="currentColor" aria-hidden="true">
      <g transform="translate(26 25)">
        <path d={blade} transform="rotate(-42) scale(0.92)" opacity="0.55" />
        <path d={blade} transform="rotate(-21) scale(0.8)" opacity="0.78" />
        <path d={blade} />
        <path d={blade} transform="rotate(21) scale(0.8)" opacity="0.78" />
        <path d={blade} transform="rotate(42) scale(0.92)" opacity="0.55" />
        <circle cy="-1" r="1.5" />
      </g>
    </svg>
  );
}

/** Jaswand — broad petals with the long stamen hibiscus is known for. */
export function Jaswand({ className = "", stroke = false }: { className?: string; stroke?: boolean }) {
  // Petal springs from the centre at (50,60) and reaches to y=16.
  // Narrow where it meets the centre, widest about two-thirds out, rounded at
  // the tip — a hibiscus petal rather than a circle.
  const petal =
    "M50 52C43 43 37 33 38.5 21.5 39.8 11.5 44.6 5.5 50 5.5s10.2 6 11.5 16C63 33 57 43 50 52Z";
  const petals = stroke
    ? { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinejoin: "round" as const }
    : { fill: "currentColor", fillOpacity: 0.72 };
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g {...petals}>
        {[0, 72, 144, 216, 288].map((deg) => (
          <path key={deg} d={petal} transform={`rotate(${deg} 50 52)`} />
        ))}
      </g>
      {/* stamen column reaches beyond the bloom, which is what makes it a jaswand */}
      <g fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
        <path d="M50 52c1.2-16 1.2-30 0-44" />
      </g>
      <g fill="currentColor">
        <circle cx="50" cy="6.4" r="2.3" />
        <circle cx="45" cy="10.6" r="1.7" />
        <circle cx="55" cy="10.6" r="1.7" />
        <circle cx="46.4" cy="16.4" r="1.5" />
        <circle cx="53.6" cy="16.4" r="1.5" />
      </g>
    </svg>
  );
}

/** Lotus in five layered petals, for large low-opacity washes. */
export function Lotus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 84" className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" aria-hidden="true">
      <path d="M60 78c-22-8-40-22-50-40 18 10 40 26 50 40Z" />
      <path d="M60 78c22-8 40-22 50-40-18 10-40 26-50 40Z" />
      <path d="M60 78C44 64 34 42 32 22c12 14 24 36 28 56Z" />
      <path d="M60 78c16-14 26-36 28-56-12 14-24 36-28 56Z" />
      <path d="M60 78c-8-16-8-46 0-68 8 22 8 52 0 68Z" />
    </svg>
  );
}

/** A corner flourish: a single jaswand bloom, tucked into the corner.
 *  Blades were tried alongside it and read as a dart, so the bloom stands
 *  alone — the restrained version is the one that looks considered. */
export function CornerSpray({ className = "" }: { className?: string }) {
  const petal = "M0 0C6-2 10-8 9-16 8-22 4-26 0-26c-4 0-8 4-9 10-1 8 3 14 9 16Z";
  return (
    <svg viewBox="0 0 76 76" className={className} fill="currentColor" aria-hidden="true">
      <g transform="translate(42 34)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <path key={deg} d={petal} transform={`rotate(${deg})`} opacity="0.8" />
        ))}
        <circle r="3.2" />
      </g>
    </svg>
  );
}

/** A single marigold petal — narrow at the base, rounded and notched at the tip. */
export function MarigoldPetal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 22" className={className} fill="currentColor" aria-hidden="true">
      <path d="M10 21.4c-1.5-5-2.8-9-3.3-12.2C5.9 4.6 7 1.6 8.7 1.6c.7 0 1 .5 1.3 1.3.3-.8.6-1.3 1.3-1.3 1.7 0 2.8 3 2 7.6-.5 3.2-1.8 7.2-3.3 12.2Z" />
    </svg>
  );
}
