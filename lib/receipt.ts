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
  web: "rramesharts.com",
  gstin: "",
};

const BANK = {
  accountName: "R. Ramesh Arts Studio",
  bankName: "Punjab National Bank",
  accountNo: "3764001500042019",
  ifsc: "PUNB0376400",
};

export type ReceiptOrder = {
  id: string;
  invoice_no?: string | null;
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
  const deva = await pdf.embedFont(fs.readFileSync(devaPath), { subset: false });

  let logo: any = null;
  try { logo = await pdf.embedPng(fs.readFileSync(path.join(process.cwd(), "public", "images", "logo.png"))); } catch { logo = null; }

  let sign: any = null;
  try { sign = await pdf.embedPng(fs.readFileSync(path.join(process.cwd(), "public", "images", "signature.png"))); } catch { sign = null; }

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
  const drawCenterIn = (text: string, x0: number, x1: number, y: number, f: any, size: number, color: any) => {
    const wd = f.widthOfTextAtSize(text, size);
    page.drawText(text, { x: x0 + ((x1 - x0) - wd) / 2, y, font: f, size, color });
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
  const blockTop = y;
  const billX = left;
  const shipX = 230;

  drawRight(order.invoice_no || ("RA-" + String(order.id).slice(0, 8).toUpperCase()), right, blockTop, bold, 13, ink);
  drawRight(new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), right, blockTop - 16, font, 9.5, soft);
  if (order.razorpay_payment_id) drawRight("Paid online", right, blockTop - 30, bold, 8.5, green);

  page.drawText("BILL TO", { x: billX, y: blockTop, font: bold, size: 8.5, color: green });
  let billY = blockTop - 15;
  if (order.customer_name) { page.drawText(order.customer_name, { x: billX, y: billY, font: deva, size: 10.5, color: ink }); billY -= 13; }
  if (order.phone) { page.drawText("Phone: " + order.phone, { x: billX, y: billY, font, size: 9, color: soft }); billY -= 12; }
  if (order.email) { page.drawText("Email: " + order.email, { x: billX, y: billY, font, size: 9, color: soft }); billY -= 12; }

  page.drawText("SHIP TO", { x: shipX, y: blockTop, font: bold, size: 8.5, color: green });
  let shipY = blockTop - 15;
  if (order.customer_name) { page.drawText(order.customer_name, { x: shipX, y: shipY, font: deva, size: 10.5, color: ink }); shipY -= 13; }
  for (const ln of wrap(order.address ?? "", 30)) { page.drawText(ln, { x: shipX, y: shipY, font: deva, size: 9, color: soft }); shipY -= 11; }
  const locParts = [order.city, order.state].filter(Boolean).join(", ");
  const cityLine = order.pincode ? (locParts ? locParts + " - " + order.pincode : String(order.pincode)) : locParts;
  if (cityLine) { page.drawText(cityLine, { x: shipX, y: shipY, font: deva, size: 9, color: soft }); shipY -= 11; }

  let ty = Math.min(billY, shipY, blockTop - 30) - 10;
  const colSr = left + 6;
  const colProd = left + 30;
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
  const totalsBottom = tyy - 4;

  let wy = ty - 14;
  page.drawText("Amount in words:", { x: left, y: wy, font: bold, size: 8.5, color: soft });
  wy -= 13;
  for (const ln of wrap("Rupees " + numberToWords(order.total) + " Only", 40)) { page.drawText(ln, { x: left, y: wy, font, size: 9, color: ink }); wy -= 12; }

  let blockY = Math.min(totalsBottom, wy) - 38;
  if (blockY < 165) blockY = 165;

  const sigCx = 472;
  drawCenterIn("For " + STUDIO.name, 400, right, blockY, font, 8.5, soft);
  if (sign) {
    const ss = Math.min(120 / sign.width, 40 / sign.height);
    page.drawImage(sign, { x: sigCx - (sign.width * ss) / 2, y: blockY - 48, width: sign.width * ss, height: sign.height * ss });
  }
  page.drawLine({ start: { x: 405, y: blockY - 52 }, end: { x: 540, y: blockY - 52 }, color: lineCol, thickness: 0.6 });
  drawCenterIn("Authorised Signatory", 400, right, blockY - 64, font, 8, soft);

  const bTop = blockY + 8;
  const bBottom = blockY - 66;
  page.drawRectangle({ x: left, y: bBottom, width: 250, height: bTop - bBottom, borderColor: lineCol, borderWidth: 0.8, color: white });
  let bky = blockY - 6;
  page.drawText("Banking Details", { x: left + 8, y: bky, font: bold, size: 8.5, color: green }); bky -= 14;
  page.drawText("Account Name: " + BANK.accountName, { x: left + 8, y: bky, font, size: 8, color: ink }); bky -= 12;
  page.drawText("Bank: " + BANK.bankName, { x: left + 8, y: bky, font, size: 8, color: ink }); bky -= 12;
  page.drawText("A/C No: " + BANK.accountNo, { x: left + 8, y: bky, font, size: 8, color: ink }); bky -= 12;
  page.drawText("IFSC: " + BANK.ifsc, { x: left + 8, y: bky, font, size: 8, color: ink });

  page.drawLine({ start: { x: left, y: 70 }, end: { x: right, y: 70 }, color: lineCol, thickness: 0.5 });
  drawCenter(STUDIO.name + "   |   " + STUDIO.phone + "   |   " + STUDIO.web, 56, font, 8.5, soft);
  drawCenter("This is a computer-generated receipt.", 44, font, 8, soft);

  return await pdf.save();
}
