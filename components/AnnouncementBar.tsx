import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export default function AnnouncementBar() {
  const t = getDict(getLocale());
  return (
    <div className="bg-sage-deep py-2 text-center text-xs uppercase tracking-[0.08em] text-[#fdfaf4]">
      &#10022; &nbsp; {t.announcement} &nbsp; &#10022;
    </div>
  );
}