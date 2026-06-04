import { supabaseAdmin } from "@/lib/supabase-admin";

export type CouponResult =
  | { valid: true; discount: number; code: string; couponId: string; message: string }
  | { valid: false; discount: 0; message: string };

export async function validateCoupon(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { valid: false, discount: 0, message: "Enter a code." };

  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .ilike("code", code)
    .limit(1)
    .maybeSingle();

  if (error || !data) return { valid: false, discount: 0, message: "Invalid code." };
  if (!data.active) return { valid: false, discount: 0, message: "This code is no longer active." };
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now())
    return { valid: false, discount: 0, message: "This code has expired." };
  if (data.max_uses != null && data.used_count >= data.max_uses)
    return { valid: false, discount: 0, message: "This code has reached its usage limit." };
  if (subtotal < Number(data.min_order || 0))
    return { valid: false, discount: 0, message: `Minimum order of ${formatRs(Number(data.min_order))} for this code.` };

  let discount = 0;
  if (data.discount_type === "flat") {
    discount = Number(data.discount_value);
  } else {
    discount = Math.round((subtotal * Number(data.discount_value)) / 100);
  }
  discount = Math.max(0, Math.min(discount, subtotal));

  if (discount <= 0) return { valid: false, discount: 0, message: "This code gives no discount on this order." };

  return {
    valid: true,
    discount,
    code: data.code,
    couponId: data.id,
    message:
      data.discount_type === "flat"
        ? `${formatRs(discount)} off applied.`
        : `${data.discount_value}% off applied (${formatRs(discount)}).`,
  };
}

function formatRs(n: number): string {
  return "\u20B9" + n.toLocaleString("en-IN");
}
