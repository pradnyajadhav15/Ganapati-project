import { describeHeight } from "@/lib/size";
import type { Dict } from "@/lib/i18n";

// Everyday objects, in centimetres. A person is useless as a reference at this
// range — these murtis run roughly 4 to 17 inches — so the comparison uses
// things the buyer already has on the table in front of them.
const PHONE_CM = 15;
const BOTTLE_CM = 26;

const BAR_MAX_PX = 132;

/**
 * Shows the idol's height beside familiar objects at the same scale, because
 * "14 inches" is hard to picture and getting it wrong means an unhappy
 * customer and a return.
 */
export default function SizeScale({ inches, t }: { inches: number; t: Dict }) {
  const { cm, feet } = describeHeight(inches);
  const tallest = Math.max(cm, BOTTLE_CM);
  const px = (value: number) => Math.max(10, Math.round((value / tallest) * BAR_MAX_PX));

  const idolLabel =
    inches % 1 === 0 ? `${inches}"` : `${inches.toFixed(1)}"`;

  return (
    <div className="mt-6 rounded-xl2 border border-line bg-cream-warm p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
          {t.actualSize}
        </h3>
        <p className="font-display text-[1.05rem] text-terracotta-deep">
          {idolLabel} · {cm} cm{feet ? ` · ${feet}` : ""}
        </p>
      </div>

      <div className="mt-5 flex items-end gap-6" aria-hidden="true">
        <Bar
          heightPx={px(cm)}
          label={t.thisIdol}
          sub={`${cm} cm`}
          className="bg-[linear-gradient(180deg,#D9A78B,#B97E5E)]"
          emphasis
        />
        <Bar
          heightPx={px(PHONE_CM)}
          label={t.sizeRefPhone}
          sub={`${PHONE_CM} cm`}
          className="bg-line"
        />
        <Bar
          heightPx={px(BOTTLE_CM)}
          label={t.sizeRefBottle}
          sub={`${BOTTLE_CM} cm`}
          className="bg-line"
        />
      </div>

      <p className="mt-4 text-xs text-ink-soft">{t.sizeScaleNote}</p>
    </div>
  );
}

function Bar({
  heightPx,
  label,
  sub,
  className,
  emphasis,
}: {
  heightPx: number;
  label: string;
  sub: string;
  className: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        style={{ height: heightPx }}
        className={
          "w-9 rounded-t-md " + className + (emphasis ? " shadow-lux ring-1 ring-terracotta-deep/25" : "")
        }
      />
      <div className="text-center">
        <div
          className={
            "text-[0.72rem] leading-tight " +
            (emphasis ? "font-semibold text-ink" : "text-ink-soft")
          }
        >
          {label}
        </div>
        <div className="text-[0.66rem] tabular-nums text-ink-soft/80">{sub}</div>
      </div>
    </div>
  );
}
