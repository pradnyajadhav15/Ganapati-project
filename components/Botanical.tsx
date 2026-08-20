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

/**
 * A painted lotus, built from layered petals with soft gradients rather than
 * flat fills, so it reads as artwork instead of an icon.
 *
 * `gid` must be unique per instance on a page — the gradients are referenced
 * by id, and duplicates would make one bloom borrow another's colours.
 */
export function PaintedLotus({
  className = "",
  gid = "lot",
}: {
  className?: string;
  gid?: string;
}) {
  // One petal, tip up, springing from the origin.
  // Fuller petal than a simple lens — lotus petals are broad with a drawn tip.
  const petal = "M0 0C-20-28-23-62 0-106 23-62 20-28 0 0Z";
  // Kept under 70 degrees so the outer whorl still cups upward instead of
  // lying flat, which read as a water lily rather than a lotus.
  const back = [-68, -45, -22, 0, 22, 45, 68];
  const front = [-38, -19, 0, 19, 38];
  const inner = [-13, 0, 13];

  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid + "-back"} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#B0466F" />
          <stop offset="45%" stopColor="#D2769D" />
          <stop offset="100%" stopColor="#F3CBDA" />
        </linearGradient>
        <linearGradient id={gid + "-front"} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#C0517D" />
          <stop offset="40%" stopColor="#E091B2" />
          <stop offset="100%" stopColor="#FBE2EB" />
        </linearGradient>
        <radialGradient id={gid + "-core"}>
          <stop offset="0%" stopColor="#F6D98A" />
          <stop offset="70%" stopColor="#E9B65E" />
          <stop offset="100%" stopColor="#D89F4E" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(160 186)">
        {/* outer whorl, opened wide and sitting behind */}
        <g fill={`url(#${gid}-back)`} opacity="0.85">
          {back.map((deg) => (
            <path key={"b" + deg} d={petal} transform={`rotate(${deg}) scale(1 0.96)`} />
          ))}
        </g>
        {/* inner whorl, lighter and more upright */}
        <g fill={`url(#${gid}-front)`}>
          {front.map((deg) => (
            <path key={"f" + deg} d={petal} transform={`rotate(${deg}) scale(0.78)`} />
          ))}
        </g>
        {/* innermost whorl, still closing over the core */}
        <g fill={`url(#${gid}-front)`} opacity="0.95">
          {inner.map((deg) => (
            <path key={"i" + deg} d={petal} transform={`rotate(${deg}) scale(0.5)`} />
          ))}
        </g>
        {/* veins, only on the front petals, where they read */}
        <g stroke="#C0517D" strokeWidth="0.9" strokeOpacity="0.28" fill="none" strokeLinecap="round">
          {front.map((deg) => (
            <g key={"v" + deg} transform={`rotate(${deg}) scale(0.78)`}>
              <path d="M0-6C-3-28-4-52 0-92" />
              <path d="M0-6C3-28 4-52 0-92" />
            </g>
          ))}
        </g>
        <circle r="15" fill={`url(#${gid}-core)`} />
      </g>
    </svg>
  );
}
