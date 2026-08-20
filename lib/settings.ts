import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type OrderingStatus = { open: boolean; message: string | null };

export async function getOrderingStatus(): Promise<OrderingStatus> {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("ordering_open,order_cutoff,closed_message")
    .eq("id", 1)
    .maybeSingle();

  if (!data) return { open: true, message: null };

  let open = data.ordering_open !== false;
  if (open && data.order_cutoff) {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    if (today > String(data.order_cutoff)) open = false;
  }
  return { open, message: (data.closed_message as string) || null };
}

/**
 * Whether Cash on Delivery is offered. Stored in site_settings so the owner
 * can turn it on and off from the admin without a deploy.
 *
 * Defaults to true if the row or column is missing, so a settings read failure
 * cannot quietly disable a payment method the owner still wants.
 */
export async function getCodEnabled(): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("cod_enabled")
    .eq("id", 1)
    .maybeSingle();
  return data?.cod_enabled !== false;
}

/**
 * Days remaining until the season booking cutoff, in IST so it flips over at
 * midnight in Solapur rather than wherever the server happens to run.
 *
 * Returns null when no cutoff is set, when ordering is already closed, or once
 * the date has passed — the countdown simply does not appear rather than
 * showing a stale or negative number.
 */
export async function getSeasonCountdown(): Promise<{ days: number; cutoff: string } | null> {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("ordering_open,order_cutoff")
    .eq("id", 1)
    .maybeSingle();

  if (!data || data.ordering_open === false || !data.order_cutoff) return null;

  const cutoff = String(data.order_cutoff);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  if (today > cutoff) return null;

  const ms = Date.parse(cutoff + "T00:00:00+05:30") - Date.parse(today + "T00:00:00+05:30");
  const days = Math.round(ms / 86400000);
  if (!Number.isFinite(days) || days < 0) return null;
  return { days, cutoff };
}
