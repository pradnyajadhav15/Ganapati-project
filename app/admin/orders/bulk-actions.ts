"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED = ["new", "confirmed", "in_production", "ready", "out_for_delivery", "delivered", "cancelled"];
const LABELS: Record<string, string> = { new: "New", confirmed: "Confirmed", in_production: "In production", ready: "Ready", out_for_delivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled" };

export async function bulkSetProgress(formData: FormData) {
  const value = String(formData.get("value") || "");
  if (!ALLOWED.includes(value)) return;
  const ids = formData.getAll("ids").map((x) => String(x)).filter(Boolean);
  if (ids.length === 0) return;

  await supabaseAdmin.from("orders").update({ progress_status: value }).in("id", ids);

  if (value === "delivered") {
    const { data: cods } = await supabaseAdmin
      .from("orders")
      .select("id")
      .in("id", ids)
      .eq("payment_method", "cod")
      .eq("payment_status", "unpaid");
    const codIds = (cods ?? []).map((o) => o.id as string);
    if (codIds.length) {
      await supabaseAdmin.from("orders").update({ payment_status: "paid" }).in("id", codIds);
    }
  }

  const label = "Status -> " + (LABELS[value] ?? value) + " (bulk)";
  await supabaseAdmin.from("order_events").insert(ids.map((id) => ({ order_id: id, label })));

  revalidatePath("/admin/orders");
}
