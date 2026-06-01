"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof ALLOWED)[number];

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  console.log("updateOrderStatus called ->", { id, status });

  if (!ALLOWED.includes(status as Status)) {
    console.error("updateOrderStatus: status not allowed ->", status);
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("id,status");

  if (error) console.error("updateOrderStatus DB error ->", error.message);
  else console.log("updateOrderStatus updated rows ->", data);

  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/" + id);
}