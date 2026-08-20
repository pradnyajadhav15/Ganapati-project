import fs from "fs";
import path from "path";
import Image from "next/image";

/**
 * Soft background photography, read from public/images/flowers.
 *
 * The folder is listed once at build time rather than per request, so adding
 * a photograph and redeploying is all it takes — there is no code change and
 * no list to keep in sync. Until a file exists this renders nothing, so the
 * pages look exactly as they do today.
 */
const DIR = path.join(process.cwd(), "public", "images", "flowers");

function listFlowers(): string[] {
  try {
    return fs
      .readdirSync(DIR)
      .filter((f) => /\.(png|webp|jpe?g)$/i.test(f))
      .sort();
  } catch {
    return [];
  }
}

const FLOWERS = listFlowers();

type Spot = {
  /** Tailwind position classes for this bloom. */
  at: string;
  /** Rendered width. Kept modest — these sit behind the content. */
  w: string;
  opacity: string;
  rotate?: string;
  flip?: boolean;
};

const LAYOUTS: Record<string, Spot[]> = {
  // Two blooms hugging opposite corners.
  corners: [
    { at: "-left-16 -top-10", w: "w-[220px] lg:w-[300px]", opacity: "opacity-[0.16]", rotate: "-rotate-12" },
    { at: "-right-20 -bottom-16", w: "w-[240px] lg:w-[340px]", opacity: "opacity-[0.13]", rotate: "rotate-6", flip: true },
  ],
  // A single bloom leaning in from the right.
  right: [
    { at: "-right-16 top-4", w: "w-[240px] lg:w-[320px]", opacity: "opacity-[0.15]", rotate: "rotate-6" },
  ],
  // A single bloom low on the left.
  left: [
    { at: "-left-14 bottom-0", w: "w-[220px] lg:w-[300px]", opacity: "opacity-[0.14]", rotate: "-rotate-6", flip: true },
  ],
};

export default function FlowerBackdrop({
  layout = "corners",
  className = "",
}: {
  layout?: keyof typeof LAYOUTS;
  className?: string;
}) {
  if (FLOWERS.length === 0) return null;

  const spots = LAYOUTS[layout] ?? LAYOUTS.corners;

  return (
    <div
      aria-hidden="true"
      className={"pointer-events-none absolute inset-0 select-none overflow-hidden " + className}
    >
      {spots.map((spot, i) => {
        const file = FLOWERS[i % FLOWERS.length];
        return (
          <div
            key={file + i}
            className={
              "absolute hidden md:block " +
              spot.at + " " + spot.w + " " + spot.opacity + " " + (spot.rotate ?? "")
            }
          >
            <Image
              src={"/images/flowers/" + file}
              alt=""
              width={640}
              height={640}
              sizes="(max-width: 1024px) 240px, 340px"
              className={
                // multiply lets a white or transparent background melt into
                // the cream rather than sitting on it as a pale block
                "h-auto w-full mix-blend-multiply " + (spot.flip ? "scale-x-[-1]" : "")
              }
            />
          </div>
        );
      })}
    </div>
  );
}
