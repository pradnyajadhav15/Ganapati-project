import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export default function AnnouncementBar() {
  const t = getDict(getLocale());
  return (
    <div className="relative overflow-hidden bg-[linear-gradient(90deg,#5E7457_0%,#7E9676_50%,#5E7457_100%)] py-2.5 text-center">
      {/* slow light sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(100deg,transparent_38%,rgba(255,255,255,.22)_50%,transparent_62%)] bg-[length:200%_100%]"
      />
      <p className="relative flex items-center justify-center gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-[#fdfaf4]">
        <span className="text-gold-light">&#10022;</span>
        {t.announcement}
        <span className="text-gold-light">&#10022;</span>
      </p>
    </div>
  );
}
