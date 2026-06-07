import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { markMessageRead, deleteMessage } from "@/app/admin/messages-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin - Messages" };

type Msg = { id: string; name: string; email: string | null; phone: string | null; message: string; is_read: boolean; created_at: string };

export default async function AdminMessagesPage() {
  if (cookies().get("admin_session")?.value !== "ok") redirect("/admin/login");

  const { data } = await supabaseAdmin
    .from("contact_messages")
    .select("id,name,email,phone,message,is_read,created_at")
    .order("created_at", { ascending: false });
  const messages = (data ?? []) as Msg[];
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <section className="site-wrap py-12">
      <Link href="/admin" className="text-sm text-sage-deep underline">Back to products</Link>
      <h1 className="mb-2 mt-3 text-3xl">Messages ({messages.length})</h1>
      <p className="mb-8 text-ink-soft">{unread} unread</p>

      {messages.length === 0 ? (
        <p className="text-ink-soft">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={"rounded-xl2 border bg-white p-5 " + (m.is_read ? "border-line" : "border-sage-deep")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="font-semibold">{m.name}</span>
                  {!m.is_read && <span className="ml-2 rounded-full bg-sage-deep px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">New</span>}
                  <div className="text-sm text-ink-soft">
                    {m.email && <a href={"mailto:" + m.email} className="underline">{m.email}</a>}
                    {m.phone && <span>{m.email ? " · " : ""}{m.phone}</span>}
                  </div>
                </div>
                <span className="text-xs text-ink-soft/70">{new Date(m.created_at).toLocaleString("en-IN")}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink">{m.message}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {m.phone && <a href={"https://wa.me/91" + m.phone.replace(/\D/g, "").slice(-10)} target="_blank" rel="noreferrer" className="rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white">WhatsApp</a>}
                {m.email && <a href={"mailto:" + m.email} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-sage-deep">Reply by email</a>}
                {!m.is_read && (
                  <form action={markMessageRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="rounded-lg border border-line px-3 py-2 text-sm font-semibold">Mark read</button>
                  </form>
                )}
                <form action={deleteMessage} className="ml-auto">
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
