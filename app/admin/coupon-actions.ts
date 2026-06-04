"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

function requireAdmin() {
  if (cookies().get("admin_session")?.value !== "ok") {
    redirect("/admin/login");
  }
}

export async function createCoupon(formData: FormData) {
  requireAdmin();
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (!code) throw new Error("Code is required");
  const maxUsesRaw = String(formData.get("max_uses") || "").trim();
  const expiresRaw = String(formData.get("expires_at") || "").trim();

  const { error } = await supabaseAdmin.from("coupons").insert({
    code,
    discount_type: String(formData.get("discount_type") || "percent"),
    discount_value: Number(formData.get("discount_value") || 0),
    min_order: Number(formData.get("min_order") || 0),
    max_uses: maxUsesRaw ? Number(maxUsesRaw) : null,
    expires_at: expiresRaw ? new Date(expiresRaw).toISOString() : null,
    active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}

export async function updateCoupon(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");
  const maxUsesRaw = String(formData.get("max_uses") || "").trim();
  const expiresRaw = String(formData.get("expires_at") || "").trim();

  const { error } = await supabaseAdmin
    .from("coupons")
    .update({
      code: String(formData.get("code") || "").trim().toUpperCase(),
      discount_type: String(formData.get("discount_type") || "percent"),
      discount_value: Number(formData.get("discount_value") || 0),
      min_order: Number(formData.get("min_order") || 0),
      max_uses: maxUsesRaw ? Number(maxUsesRaw) : null,
      expires_at: expiresRaw ? new Date(expiresRaw).toISOString() : null,
      active: formData.get("active") === "on",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");
  const { error } = await supabaseAdmin.from("coupons").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}
