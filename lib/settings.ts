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
