import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatINR } from "@/lib/format";
import { signOut } from "../auth/actions";
import { getLocale } from "@/lib/locale";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const t = getDict(getLocale());
  const name = (user.user_metadata?.full_name as string) || "";

  const { data: orders } = await supabase
    .from("orders")
    .select("id,total,status,created_at,receipt_url")
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
        <div className="overflow-hidden rounded-xl2 border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-deep text-ink-soft">
              <tr>
                <th className="p-4">{t.orderColumn}</th>
                <th className="p-4">{t.date}</th>
                <th className="p-4">{t.status}</th>
                <th className="p-4">{t.total}</th>
                <th className="p-4 text-right">{t.receipt}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="p-4 font-medium">#{String(o.id).slice(0, 8)}</td>
                  <td className="p-4 text-ink-soft">{new Date(o.created_at as string).toLocaleDateString("en-IN")}</td>
                  <td className="p-4"><span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs capitalize text-sage-deep">{o.status}</span></td>
                  <td className="p-4">{formatINR(o.total as number)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/order-success?id=${o.id}`} className="text-sage-deep underline">{t.view}</Link>
                      {o.receipt_url && (<a href={o.receipt_url as string} target="_blank" rel="noreferrer" className="text-sage-deep underline">{t.receipt}</a>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl2 border border-line bg-white p-8 text-center text-ink-soft">{t.noOrdersYet}</p>
      )}
    </section>
  );
}