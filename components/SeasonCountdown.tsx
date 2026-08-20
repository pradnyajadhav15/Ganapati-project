import Link from "next/link";
import { getSeasonCountdown } from "@/lib/settings";
import { getLocale } from "@/lib/locale";

const T = {
  en: { today: "Booking closes today", tomorrow: "Booking closes tomorrow", days: (n: number) => `${n} days left to book this season`, cta: "Reserve yours" },
  hi: { today: "बुकिंग आज बंद हो रही है", tomorrow: "बुकिंग कल बंद हो रही है", days: (n: number) => `इस मौसम की बुकिंग के लिए ${n} दिन बाकी`, cta: "अभी आरक्षित करें" },
  mr: { today: "बुकिंग आज बंद होत आहे", tomorrow: "बुकिंग उद्या बंद होत आहे", days: (n: number) => `या हंगामासाठी बुकिंगला ${n} दिवस बाकी`, cta: "आताच राखून ठेवा" },
} as const;

/**
 * Counts down to the owner's own booking cutoff, set in admin. Renders nothing
 * until a cutoff exists, so the season pressure is real rather than theatre.
 */
export default async function SeasonCountdown() {
  const countdown = await getSeasonCountdown();
  if (!countdown) return null;

  const t = T[getLocale()] ?? T.en;
  const label =
    countdown.days === 0 ? t.today : countdown.days === 1 ? t.tomorrow : t.days(countdown.days);
  const urgent = countdown.days <= 7;

  return (
    <div className={"border-y " + (urgent ? "border-terracotta/30 bg-terracotta/[0.08]" : "border-line bg-cream-warm")}>
      <div className="site-wrap flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-3 text-center">
        <span
          aria-hidden="true"
          className={"h-2 w-2 rotate-45 " + (urgent ? "bg-terracotta-deep" : "bg-gold")}
        />
        <p className="text-sm font-semibold tracking-wide text-ink">{label}</p>
        <Link
          href="/shop"
          className="text-sm font-semibold text-sage-deep underline underline-offset-4 transition hover:text-ink"
        >
          {t.cta} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
