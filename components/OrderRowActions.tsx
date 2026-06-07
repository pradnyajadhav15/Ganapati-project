"use client";

import Link from "next/link";
import { archiveOrder, unarchiveOrder, deleteOrder } from "@/app/admin/orders/order-actions";

export default function OrderRowActions({ id, archived }: { id: string; archived: boolean }) {
  if (archived) {
    return (
      <div className="flex items-center justify-end gap-3">
        <form action={unarchiveOrder} className="inline-block">
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="text-xs font-semibold text-sage-deep underline">Restore</button>
        </form>
        <form action={deleteOrder} onSubmit={(e) => { if (!confirm("Permanently delete this order? This cannot be undone.")) e.preventDefault(); }} className="inline-block">
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50">Delete</button>
        </form>
        <Link href={"/admin/orders/" + id} className="text-sage-deep underline">View</Link>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-end gap-3">
      <form action={archiveOrder} onSubmit={(e) => { if (!confirm("Hide this order from the list? You can restore it from Archived.")) e.preventDefault(); }} className="inline-block">
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-soft transition hover:bg-cream-deep">Archive</button>
      </form>
      <Link href={"/admin/orders/" + id} className="text-sage-deep underline">View</Link>
    </div>
  );
}
