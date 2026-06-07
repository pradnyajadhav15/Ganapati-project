"use server";

import { notifyOwnerOfContact } from "@/lib/email";
import { isLikelySpam } from "@/lib/spam";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function sendContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  website?: string;
  elapsedMs?: number;
}) {
  if (isLikelySpam(input)) {
    return { ok: true };
  }
  if (!input.name?.trim() || !input.email?.trim() || !input.message?.trim()) {
    return { ok: false };
  }
  try {
    await supabaseAdmin.from("contact_messages").insert({
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || null,
      message: input.message.trim(),
    });
  } catch (e) {
    console.error("contact_messages insert failed ->", e);
  }
  try {
    await notifyOwnerOfContact({ name: input.name, email: input.email, message: input.message });
  } catch {}
  return { ok: true };
}
