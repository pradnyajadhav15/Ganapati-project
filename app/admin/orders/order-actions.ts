"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function archiveOrder(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabaseAdmin.from("orders").update({ archived: true }).eq("id", id);
  revalidatePath("/admin/orders");
}

export async function unarchiveOrder(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabaseAdmin.from("orders").update({ archived: false }).eq("id", id);
  revalidatePath("/admin/orders");
}

export async function deleteOrder(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await supabaseAdmin.storage.from("receipts").remove([id + ".pdf"]);
  } catch {}
  await supabaseAdmin.from("order_items").delete().eq("order_id", id);
  await supabaseAdmin.from("orders").delete().eq("id", id);
  revalidatePath("/admin/orders");
}
