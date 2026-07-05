"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function deleteSubscriber(formData: FormData) {
  const id = String(formData.get("id"));
  const { error } = await supabaseAdmin.from("subscribers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/subscribers");
}
