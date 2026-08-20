import fs from "fs";
import path from "path";
import Image from "next/image";
import { PaintedLotus } from "@/components/Botanical";

/**
 * Soft background photography, read from public/images/flowers.
 *
 * The folder is listed once at build time rather than per request, so adding
 * a photograph and redeploying is all it takes — there is no code change and
 * no list to keep in sync.
 *
 * With the folder empty it falls back to the painted lotus, so the pages carry
 * flowers either way. Photographs simply take over when they are added.
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
  /** The drawn lotus is paler, so it takes a stronger value. */
  lotusOpacity: string;
  rotate?: string;
  flip?: boolean;
};

const LAYOUTS: Record<string, Spot[]> = {
  // Two blooms hugging opposite corners.
  corners: [
    { at: "-left-16 -top-10", w: "w-[220px] lg:w-[300px]", opacity: "opacity-[0.16]", lotusOpacity: "opacity-[0.34]", rotate: "-rotate-12" },
    { at: "-right-20 -bottom-16", w: "w-[240px] lg:w-[340px]", opacity: "opacity-[0.13]", lotusOpacity: "opacity-[0.28]", rotate: "rotate-6", flip: true },
  ],
  // A single bloom leaning in from the right.
  right: [
    { at: "-right-16 top-4", w: "w-[240px] lg:w-[320px]", opacity: "opacity-[0.15]", lotusOpacity: "opacity-[0.32]", rotate: "rotate-6" },
  ],
  // A single bloom low on the left.
  left: [
    { at: "-left-14 bottom-0", w: "w-[220px] lg:w-[300px]", opacity: "opacity-[0.14]", lotusOpacity: "opacity-[0.30]", rotate: "-rotate-6", flip: true },
  ],
};

export default function FlowerBackdrop({
  layout = "corners",
  className = "",
}: {
  layout?: keyof typeof LAYOUTS;
  className?: string;
}) {
  const spots = LAYOUTS[layout] ?? LAYOUTS.corners;
  const usePhotos = FLOWERS.length > 0;

  return (
    <div
      aria-hidden="true"
      className={"pointer-events-none absolute inset-0 select-none overflow-hidden " + className}
    >
      {spots.map((spot, i) => {
        if (!usePhotos) {
          // Painted lotus stands in. It is already pale, so it carries more
          // opacity than a photograph would without shouting.
          return (
            <div
              key={"lotus" + i}
              className={
                "absolute hidden md:block " +
                spot.at + " " + spot.w + " " + spot.lotusOpacity + " " + (spot.rotate ?? "")
              }
            >
              <PaintedLotus
                gid={"lot-" + layout + "-" + i}
                className={"h-auto w-full " + (spot.flip ? "scale-x-[-1]" : "")}
              />
            </div>
          );
        }
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
