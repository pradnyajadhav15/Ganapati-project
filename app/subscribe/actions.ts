"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { isLikelySpam } from "@/lib/spam";

export async function subscribe(input: {
  name: string;
  email: string;
  phone: string;
  website?: string;
  elapsedMs?: number;
}): Promise<{ ok?: boolean; error?: string }> {
  if (isLikelySpam(input)) {
    // Silently pretend success so bots do not learn they were blocked.
    return { ok: true };
  }

  const email = input.email?.trim() || null;
  const phone = input.phone?.trim() || null;
  if (!email && !phone) return { error: "no-contact" };

  const { error } = await supabaseAdmin.from("subscribers").insert({
    name: input.name?.trim() || null,
    email,
    phone,
  });

  if (error) {
    // 23505 = unique violation -> already on the list, treat as success
    if (error.code === "23505") return { ok: true };
    return { error: error.message };
  }

  return { ok: true };
}
