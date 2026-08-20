import { MarigoldPetal } from "@/components/Botanical";

/**
 * A brief drift of marigold petals over the order confirmation.
 *
 * The values are a fixed table rather than random, so the server and the
 * browser render the same thing. Hidden entirely under prefers-reduced-motion
 * — a petal frozen mid-air is worse than no petal.
 */
const PETALS = [
  { left: "6%",  delay: "0s",    dur: "7.5s", drift: "40px",  spin: "220deg", size: 16, tone: "text-gold"        },
  { left: "17%", delay: "1.4s",  dur: "9s",   drift: "-30px", spin: "-180deg", size: 12, tone: "text-terracotta"  },
  { left: "29%", delay: "0.6s",  dur: "8.2s", drift: "55px",  spin: "300deg", size: 20, tone: "text-gold-light"   },
  { left: "41%", delay: "2.6s",  dur: "7s",   drift: "-45px", spin: "-260deg", size: 14, tone: "text-terracotta"  },
  { left: "53%", delay: "0.2s",  dur: "9.6s", drift: "35px",  spin: "200deg", size: 18, tone: "text-gold"        },
  { left: "66%", delay: "3.1s",  dur: "8s",   drift: "-50px", spin: "-320deg", size: 13, tone: "text-peach"       },
  { left: "78%", delay: "1.1s",  dur: "7.8s", drift: "45px",  spin: "240deg", size: 17, tone: "text-gold-light"   },
  { left: "89%", delay: "2.2s",  dur: "9.2s", drift: "-35px", spin: "-200deg", size: 15, tone: "text-terracotta"  },
  { left: "12%", delay: "4.2s",  dur: "8.6s", drift: "25px",  spin: "180deg", size: 11, tone: "text-peach"        },
  { left: "72%", delay: "5s",    dur: "8.8s", drift: "-25px", spin: "-220deg", size: 12, tone: "text-gold"        },
];

export default function PetalFall() {
  return (
    <div className="petal-fall pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className={"petal absolute top-0 " + p.tone}
          style={
            {
              left: p.left,
              width: p.size,
              animationDelay: p.delay,
              animationDuration: p.dur,
              "--drift": p.drift,
              "--spin": p.spin,
            } as React.CSSProperties
          }
        >
          <MarigoldPetal className="w-full" />
        </span>
      ))}
    </div>
  );
}
