"use server";

import { notifyOwnerOfContact } from "@/lib/email";
import { isLikelySpam } from "@/lib/spam";

export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
  website?: string;
  elapsedMs?: number;
}) {
  if (isLikelySpam(input)) {
    // Silently pretend success so bots do not learn they were blocked.
    return { ok: true };
  }
  if (!input.name?.trim() || !input.email?.trim() || !input.message?.trim()) {
    return { ok: false };
  }
  return await notifyOwnerOfContact({
    name: input.name,
    email: input.email,
    message: input.message,
  });
}
