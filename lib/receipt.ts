import "regenerator-runtime/runtime";
import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

const STUDIO = {
  name: "R. Ramesh Arts Studio",
  tagline: "Handcrafted Ganpati Idols - Solapur",
  addr1: "34/A1/26, Marikanti Vada, Geeta Nagar, New Paccha Peth",
  addr2: "Solapur, Maharashtra - 413006",
  phone: "+91 70202 90393",
  email: "rrameshartsstudio@gmail.com",
  web: "rrameshartsstudio.in",
  gstin: "",
};

export type ReceiptOrder = {
  id: string;
  customer_name: string | null;
  phone: string | null;
  address: string | null;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  subtotal?: number | null;
  discount?: number | null;
  coupon_code?: string | null;
  shipping?: number | null;
  total: number;
  razorpay_payment_id: string | null;
  created_at: string;
};

export type ReceiptItem = { name: string; price: number; qty: number };

function wrap(text: string, max: number): string[] {
  if (!text) return [];
  const out: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    let s = line.trim();
    while (s.length > max) {
      let cut = s.lastIndexOf(" ", max);
      if (cut < Math.floor(max / 2)) cut = max;
      out.push(s.slice(0, cut).trim());
      s = s.slice(cut).trim();
    }
    if (s.length) out.push(s);
  }
  return out;
}

function rupees(n: number): string {
  return "Rs " + Math.round(n).toLocaleString("en-IN");
}

function numberToWords(value: number): string {
  let num = Math.round(value);
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (n: number): string => (n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : ""));
  const three = (n: number): string => {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return (h ? ones[h] + " Hundred" + (r ? " " : "") : "") + (r ? two(r) : "");
  };
  let w = "";
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh = Math.floor(num / 100000); num %= 100000;
  const thousand = Math.floor(num / 1000); num %= 1000;
  if (crore) w += three(crore) + " Crore ";
  if (lakh) w += two(lakh) + " Lakh ";
  if (thousand) w += two(thousand) + " Thousand ";
  if (num) w += three(num);
  return w.trim();
}

export async function generateReceiptPdf(order: ReceiptOrder, items: ReceiptItem[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const devaPath = path.join(process.cwd(), "public", "fonts", "NotoSansDevanagari-Regular.ttf");
  const deva = await pdf.embedFont(fs.readFileSync(devaPath), { subset: true });

  let logo: any = null;
  try {
    logo = await pdf.embedPng(fs.readFileSync(path.join(process.cwd(), "public", "images", "logo.png")));
  } catch {
    logo = null;
  }

  const left = 50;
  const right = 545;
  const W = 595;
  const ink = rgb(0.16, 0.14, 0.11);
  const soft = rgb(0.46, 0.43, 0.39);
  const green = rgb(0.30, 0.43, 0.28);
  const lineCol = rgb(0.83, 0.79, 0.72);
  const white = rgb(1, 1, 1);

  const drawRight = (text: string, xRight: number, y: number, f: any, size: number, color: any) => {
    page.drawText(text, { x: xRight - f.widthOfTextAtSize(text, size), y, font: f, size, color });
  };
  const drawCenter = (text: string, y: number, f: any, size: number, color: any) => {
    page.drawText(text, { x: (W - f.widthOfTextAtSize(text, size)) / 2, y, font: f, size, color });
  };

  if (logo) {
    const s = 54 / Math.max(logo.width, logo.height);
    page.drawImage(logo, { x: left, y: 812 - logo.height * s, width: logo.width * s, height: logo.height * s });
  }
  const tx = left + 66;
  page.drawText(STUDIO.name, { x: tx, y: 800, font: bold, size: 17, color: ink });
  page.drawText(STUDIO.tagline, { x: tx, y: 786, font, size: 8.5, color: soft });
  page.drawText(STUDIO.addr1, { x: tx, y: 773, font, size: 8, color: soft });
  page.drawText(STUDIO.addr2, { x: tx, y: 763, font, size: 8, color: soft });
  page.drawText("Phone: " + STUDIO.phone + "   |   " + STUDIO.web, { x: tx, y: 753, font, size: 8, color: soft });
  let hline = 743;
  if (STUDIO.email) { page.drawText("Email: " + STUDIO.email, { x: tx, y: hline, font, size: 8, color: soft }); hline -= 10; }
  if (STUDIO.gstin) { page.drawText("GSTIN: " + STUDIO.gstin, { x: tx, y: hline, font, size: 8, color: soft }); }

  let y = 728;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, color: green, thickness: 1.4 });
  y -= 17;
  drawCenter("RECEIPT", y, bold, 15, green);
  y -= 8;
  page.drawLine({ start: { x: left, y }, end: { x: right, y }, color: green, thickness: 1.4 });

  y -= 22;
  const billTop = y;
  page.drawText("BILL TO", { x: left, y, font: bold, size: 8.5, color: green });
  let by = y - 15;
  if (order.customer_name) { page.drawText(order.customer_name, { x: left, y: by, font: deva, size: 11, color: ink }); by -= 14; }
  for (const ln of wrap(order.address ?? "", 48)) { page.drawText(ln, { x: left, y: by, font: deva, size: 9.5, color: soft }); by -= 12; }
  const locParts = [order.city, order.state].filter(Boolean).join(", ");
  const cityLine = order.pincode ? (locParts ? locParts + " - " + order.pincode : String(order.pincode)) : locParts;
  if (cityLine) { page.drawText(cityLine, { x: left, y: by, font: deva, size: 9.5, color: soft }); by -= 12; }
  if (order.phone) { page.drawText("Phone: " + order.phone, { x: left, y: by, font, size: 9, color: soft }); by -= 12; }
  if (order.email) { page.drawText("Email: " + order.email, { x: left, y: by, font, size: 9, color: soft }); by -= 12; }

  drawRight("RA-" + String(order.id).slice(0, 8).toUpperCase(), right, billTop, bold, 13, ink);
  drawRight(new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), right, billTop - 16, font, 9.5, soft);
  if (order.razorpay_payment_id) drawRight("Paid online", right, billTop - 30, bold, 8.5, green);

  let ty = Math.min(by, billTop - 46) - 6;
  const colSr = left + 6;
  const colProd = left + 32;
  const colQty = 400;
  const colRate = 470;
  const colAmt = right - 5;

  page.drawRectangle({ x: left, y: ty - 17, width: right - left, height: 17, color: green });
  const hy = ty - 12;
  page.drawText("Sr", { x: colSr, y: hy, font: bold, size: 9, color: white });
  page.drawText("Product", { x: colProd, y: hy, font: bold, size: 9, color: white });
  drawRight("Qty", colQty, hy, bold, 9, white);
  drawRight("Rate", colRate, hy, bold, 9, white);
  drawRight("Amount", colAmt, hy, bold, 9, white);
  ty -= 17;

  let sr = 1;
  for (const it of items) {
    const lines = wrap(it.name, 46);
    if (lines.length === 0) lines.push(it.name);
    const firstY = ty - 14;
    page.drawText(String(sr), { x: colSr, y: firstY, font, size: 9, color: ink });
    let ly = firstY;
    for (const ln of lines) { page.drawText(ln, { x: colProd, y: ly, font: deva, size: 9.5, color: ink }); ly -= 12; }
    drawRight(String(it.qty), colQty, firstY, font, 9.5, ink);
    drawRight(rupees(it.price), colRate, firstY, font, 9.5, ink);
    drawRight(rupees(it.price * it.qty), colAmt, firstY, font, 9.5, ink);
    ty -= 6 + lines.length * 12;
    page.drawLine({ start: { x: left, y: ty }, end: { x: right, y: ty }, color: lineCol, thickness: 0.5 });
    sr++;
  }

  const subtotal = order.subtotal ?? items.reduce((s, it) => s + it.price * it.qty, 0);
  const discount = order.discount ?? 0;
  const shipping = order.shipping ?? Math.max(0, order.total - subtotal + discount);

  let tyy = ty - 14;
  const labelX = 360;
  const totalRow = (label: string, value: string) => {
    page.drawText(label, { x: labelX, y: tyy, font, size: 9.5, color: soft });
    drawRight(value, colAmt, tyy, font, 9.5, ink);
    tyy -= 16;
  };
  totalRow("Subtotal", rupees(subtotal));
  if (discount > 0) totalRow("Discount" + (order.coupon_code ? " (" + order.coupon_code + ")" : ""), "- " + rupees(discount));
  totalRow("Shipping", shipping > 0 ? rupees(shipping) : "Free");
  tyy -= 2;
  page.drawRectangle({ x: labelX - 8, y: tyy - 4, width: colAmt - (labelX - 8) + 5, height: 22, color: green });
  page.drawText("Grand Total", { x: labelX, y: tyy + 4, font: bold, size: 11, color: white });
  drawRight(rupees(order.total), colAmt, tyy + 4, bold, 11, white);

  let wy = ty - 14;
  page.drawText("Amount in words:", { x: left, y: wy, font: bold, size: 8.5, color: soft });
  wy -= 13;
  for (const ln of wrap("Rupees " + numberToWords(order.total) + " Only", 40)) { page.drawText(ln, { x: left, y: wy, font, size: 9, color: ink }); wy -= 12; }

  let ny = Math.min(tyy - 24, wy - 16);
  page.drawLine({ start: { x: left, y: ny + 12 }, end: { x: right, y: ny + 12 }, color: lineCol, thickness: 0.5 });
  page.drawText("Please note", { x: left, y: ny, font: bold, size: 9, color: ink }); ny -= 14;
  page.drawText("1. Payment received with thanks.", { x: left, y: ny, font, size: 9, color: soft }); ny -= 13;
  page.drawText("2. Thank you for choosing R. Ramesh Arts Studio.", { x: left, y: ny, font, size: 9, color: soft });

  page.drawLine({ start: { x: left, y: 70 }, end: { x: right, y: 70 }, color: lineCol, thickness: 0.5 });
  drawCenter(STUDIO.name + "   |   " + STUDIO.phone + "   |   " + STUDIO.web, 56, font, 8.5, soft);
  drawCenter("This is a computer-generated receipt.", 44, font, 8, soft);

  return await pdf.save();
}
