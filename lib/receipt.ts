import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type ReceiptOrder = {
  id: string;
  customer_name: string | null;
  phone: string | null;
  address: string | null;
  subtotal?: number | null;
  discount?: number | null;
  coupon_code?: string | null;
  total: number;
  razorpay_payment_id: string | null;
  created_at: string;
};

export type ReceiptItem = {
  name: string;
  price: number;
  qty: number;
};

function wrap(text: string, max = 70): string[] {
  if (!text) return [];
  const out: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    let s = line;
    while (s.length > max) {
      let cut = s.lastIndexOf(" ", max);
      if (cut < 30) cut = max;
      out.push(s.slice(0, cut).trim());
      s = s.slice(cut).trim();
    }
    if (s.length) out.push(s);
  }
  return out;
}

export async function generateReceiptPdf(
  order: ReceiptOrder,
  items: ReceiptItem[]
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const left = 50;
  const right = 545;
  const ink = rgb(0.2, 0.16, 0.12);
  const soft = rgb(0.5, 0.45, 0.4);
  const sage = rgb(0.49, 0.59, 0.46);
  const line = rgb(0.85, 0.8, 0.72);

  let y = 800;

  page.drawText("R. Ramesh Arts Studio", { x: left, y, font: bold, size: 22, color: ink });
  y -= 18;
  page.drawText("Eco-Friendly Ganpati Idols", { x: left, y, font, size: 10, color: soft });

  page.drawText("RECEIPT", { x: right - 80, y: 800, font: bold, size: 18, color: sage });
  page.drawText("PAID", { x: right - 38, y: 778, font: bold, size: 10, color: sage });

  y -= 35;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, color: line, thickness: 1 });
  y -= 25;

  const meta = (label: string, value: string) => {
    page.drawText(label, { x: left, y, font: bold, size: 9, color: soft });
    page.drawText(value, { x: left + 85, y, font, size: 10, color: ink });
    y -= 16;
  };
  meta("Order #", String(order.id).slice(0, 8).toUpperCase());
  meta("Date", new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));
  if (order.razorpay_payment_id) meta("Payment ID", order.razorpay_payment_id);

  y -= 10;
  page.drawText("Billed to", { x: left, y, font: bold, size: 11, color: ink });
  y -= 16;
  if (order.customer_name) {
    page.drawText(order.customer_name, { x: left, y, font, size: 10, color: ink });
    y -= 14;
  }
  if (order.phone) {
    page.drawText(`Phone: ${order.phone}`, { x: left, y, font, size: 10, color: ink });
    y -= 14;
  }
  for (const addrLine of wrap(order.address ?? "", 70)) {
    page.drawText(addrLine, { x: left, y, font, size: 10, color: ink });
    y -= 14;
  }

  y -= 16;
  page.drawLine({ start: { x: left, y: y + 12 }, end: { x: right, y: y + 12 }, color: line, thickness: 0.5 });
  page.drawText("Item", { x: left, y, font: bold, size: 10, color: soft });
  page.drawText("Qty", { x: 360, y, font: bold, size: 10, color: soft });
  page.drawText("Price", { x: 420, y, font: bold, size: 10, color: soft });
  page.drawText("Amount", { x: 490, y, font: bold, size: 10, color: soft });
  y -= 6;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, color: line, thickness: 0.5 });
  y -= 16;

  for (const it of items) {
    const lines = wrap(it.name, 50);
    const firstLine = lines.shift() ?? it.name;
    page.drawText(firstLine, { x: left, y, font, size: 10, color: ink });
    page.drawText(String(it.qty), { x: 360, y, font, size: 10, color: ink });
    page.drawText(`Rs ${it.price.toLocaleString("en-IN")}`, { x: 420, y, font, size: 10, color: ink });
    page.drawText(`Rs ${(it.price * it.qty).toLocaleString("en-IN")}`, { x: 490, y, font, size: 10, color: ink });
    y -= 14;
    for (const cont of lines) {
      page.drawText(cont, { x: left, y, font, size: 10, color: ink });
      y -= 14;
    }
    y -= 4;
  }

  y -= 6;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, color: line, thickness: 0.5 });
  y -= 20;

  const discount = Number(order.discount ?? 0);
  if (discount > 0) {
    const subtotal = Number(order.subtotal ?? order.total + discount);
    page.drawText("Subtotal", { x: 420, y, font, size: 10, color: soft });
    page.drawText(`Rs ${subtotal.toLocaleString("en-IN")}`, { x: 490, y, font, size: 10, color: ink });
    y -= 16;
    const dLabel = order.coupon_code ? `Discount (${order.coupon_code})` : "Discount";
    page.drawText(dLabel, { x: 300, y, font, size: 10, color: sage });
    page.drawText(`- Rs ${discount.toLocaleString("en-IN")}`, { x: 490, y, font, size: 10, color: sage });
    y -= 18;
  }

  page.drawText("Total", { x: 420, y, font: bold, size: 13, color: ink });
  page.drawText(`Rs ${order.total.toLocaleString("en-IN")}`, { x: 490, y, font: bold, size: 13, color: ink });

  page.drawText("Thank you for choosing eco-friendly. Vighnaharta bless you.", {
    x: left, y: 60, font, size: 9, color: soft,
  });
  page.drawText("trimurtistudio  @R.RameshArts", {
    x: left, y: 46, font, size: 9, color: soft,
  });

  return pdf.save();
}
