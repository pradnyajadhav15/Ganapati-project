import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatINR } from "@/lib/format";
import { signOut } from "../auth/actions";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account" };

/* PHASE4_TRACK — customer-facing order tracking */
const TRACK: Record<string, { stages: string[]; cancelled: string }> = {
  en: { stages: ["New", "Confirmed", "Out for delivery", "Delivered"], cancelled: "This order was cancelled." },
  hi: { stages: ["नया", "पुष्ट", "डिलीवरी के लिए रवाना", "डिलीवर हो गया"], cancelled: "यह ऑर्डर रद्द कर दिया गया है।" },
  mr: { stages: ["नवीन", "निश्चित", "डिलिव्हरीसाठी रवाना", "डिलिव्हर झाले"], cancelled: "ही ऑर्डर रद्द करण्यात आली आहे." },
};

function stepFor(p: string | null | undefined): number {
  switch (p) {
    case "new": return 0;
    case "confirmed":
    case "in_production":
    case "ready": return 1;
    case "out_for_delivery": return 2;
    case "delivered": return 3;
    default: return 0;
  }
}

export default async function AccountPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const locale = getLocale();
  const t = getDict(locale);
  const tr = TRACK[locale] ?? TRACK.en;
  const name = (user.user_metadata?.full_name as string) || "";

  const { data: orders } = await supabase
    .from("orders")
    .select("id,total,invoice_no,progress_status,created_at,receipt_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="site-wrap py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl">{t.hello}{name ? ", " + name : ""}</h1>
          <p className="mt-2 text-ink-soft">{t.signedInAs} {user.email}</p>
        </div>
        <form action={signOut}>
          <button className="btn-ghost">{t.logOut}</button>
        </form>
      </div>

      <h2 className="mb-4 mt-10 text-2xl">{t.yourOrders}</h2>
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((o) => {
            const cancelled = o.progress_status === "cancelled";
            const step = stepFor(o.progress_status as string | null);
            return (
              <div key={o.id} className="rounded-xl2 border border-line bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{(o.invoice_no as string) || ("#" + String(o.id).slice(0, 8))}</p>
                    <p className="text-sm text-ink-soft">{new Date(o.created_at as string).toLocaleDateString("en-IN")}</p>
                  </div>
                  <p className="text-lg font-medium">{formatINR(o.total as number)}</p>
                </div>

                {cancelled ? (
                  <div className="mt-4 rounded-lg border border-terracotta/40 bg-peach px-4 py-3 text-sm text-terracotta">{tr.cancelled}</div>
                ) : (
                  <div className="relative mt-5">
                    <div className="absolute top-[11px] h-0.5 bg-line" style={{ left: "12.5%", width: "75%" }} />
                    <div className="absolute top-[11px] h-0.5 bg-sage-deep" style={{ left: "12.5%", width: `${(75 * step) / 3}%` }} />
                    <div className="relative grid grid-cols-4">
                      {tr.stages.map((label, i) => (
                        <div key={i} className="flex flex-col items-center px-1">
                          <span className={`h-6 w-6 rounded-full border-2 ${i <= step ? "border-sage-deep bg-sage-deep" : "border-line bg-white"}`} />
                          <span className={`mt-2 text-center text-[11px] leading-tight ${i <= step ? "font-medium text-sage-deep" : "text-ink-soft"}`}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-4 text-sm">
                  <Link href={`/order-success?id=${o.id}`} className="text-sage-deep underline">{t.view}</Link>
                  {o.receipt_url && (<a href={o.receipt_url as string} target="_blank" rel="noreferrer" className="text-sage-deep underline">{t.receipt}</a>)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl2 border border-line bg-white p-8 text-center text-ink-soft">{t.noOrdersYet}</p>
      )}
    </section>
  );
}
