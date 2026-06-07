"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function markMessageRead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabaseAdmin.from("contact_messages").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabaseAdmin.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
}
