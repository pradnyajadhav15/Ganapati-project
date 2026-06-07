"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function addTeamMember(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const role = String(formData.get("role") ?? "").trim() || null;
  const sortRaw = String(formData.get("sort_order") ?? "").trim();
  const sort_order = sortRaw ? Number(sortRaw) : 0;
  await supabaseAdmin.from("team_members").insert({ name, role, sort_order });
  revalidatePath("/admin/team");
  revalidatePath("/about");
}

export async function updateTeamMember(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const role = String(formData.get("role") ?? "").trim() || null;
  const sortRaw = String(formData.get("sort_order") ?? "").trim();
  const sort_order = sortRaw ? Number(sortRaw) : 0;
  await supabaseAdmin.from("team_members").update({ name, role, sort_order }).eq("id", id);
  revalidatePath("/admin/team");
  revalidatePath("/about");
}

export async function deleteTeamMember(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabaseAdmin.from("team_members").delete().eq("id", id);
  revalidatePath("/admin/team");
  revalidatePath("/about");
}
