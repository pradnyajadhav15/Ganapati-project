"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

async function logEvent(orderId: string, label: string) {
  try {
    await supabaseAdmin.from("order_events").insert({ order_id: orderId, label });
  } catch {}
}

export async function setPaymentStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const value = String(formData.get("value") ?? "");
  if (!id || !value) return;
  await supabaseAdmin.from("orders").update({ payment_status: value }).eq("id", id);
  await logEvent(id, "Payment marked " + value);
  revalidatePath("/admin/orders/" + id);
  revalidatePath("/admin/orders");
}

export async function setProgressStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const value = String(formData.get("value") ?? "");
  if (!id || !value) return;
  const updates: Record<string, unknown> = { progress_status: value };
  if (value === "delivered") {
    const { data: o } = await supabaseAdmin.from("orders").select("payment_method,payment_status").eq("id", id).single();
    if (o && o.payment_method === "cod" && o.payment_status !== "paid") {
      updates.payment_status = "paid";
    }
  }
  await supabaseAdmin.from("orders").update(updates).eq("id", id);
  await logEvent(id, "Progress: " + value.replace(/_/g, " "));
  if (updates.payment_status === "paid") await logEvent(id, "Payment marked paid (COD collected)");
  revalidatePath("/admin/orders/" + id);
  revalidatePath("/admin/orders");
}

export async function saveOrderNotes(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const notes = String(formData.get("notes") ?? "");
  await supabaseAdmin.from("orders").update({ owner_notes: notes }).eq("id", id);
  revalidatePath("/admin/orders/" + id);
}
