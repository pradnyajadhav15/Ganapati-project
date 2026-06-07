"use client";

import { setProgressStatus } from "@/app/admin/orders/status-actions";

const PROGRESS = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_production", label: "In production" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function RowProgressSelect({ id, current }: { id: string; current: string }) {
  return (
    <form action={setProgressStatus}>
      <input type="hidden" name="id" value={id} />
      <select name="value" defaultValue={current} onChange={(e) => e.currentTarget.form?.requestSubmit()} className="w-full rounded-lg border border-line bg-white px-2 py-1 text-xs text-ink outline-none focus:border-sage-deep">
        {PROGRESS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
      </select>
    </form>
  );
}
