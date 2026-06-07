import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function cell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return '"' + s.replace(/"/g, '""') + '"';
}

export async function GET() {
  if (cookies().get("admin_session")?.value !== "ok") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const headers = [
    "Invoice No", "Order ID", "Date", "Customer", "Phone", "Email", "Address", "City", "State",
    "Pincode", "Delivery area", "Payment method", "Payment status", "Progress status",
    "Coupon", "Subtotal", "Discount", "Shipping", "Total", "Razorpay payment ID", "Archived",
  ];

  const rows = (orders ?? []).map((o) => [
    o.invoice_no ?? "",
    String(o.id).slice(0, 8).toUpperCase(),
    new Date(o.created_at as string).toLocaleString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    o.customer_name ?? "",
    o.phone ?? "",
    o.email ?? "",
    o.address ?? "",
    o.city ?? "",
    o.state ?? "",
    o.pincode ?? "",
    o.delivery_area === "outside" ? "Outside Solapur" : "Within Solapur",
    o.payment_method ?? "",
    o.payment_status ?? "",
    o.progress_status ?? "",
    o.coupon_code ?? "",
    o.subtotal ?? 0,
    o.discount ?? 0,
    o.shipping ?? 0,
    o.total ?? 0,
    o.razorpay_payment_id ?? "",
    o.archived ? "Yes" : "No",
  ]);

  const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rramesh-orders-${today}.csv"`,
    },
  });
}
