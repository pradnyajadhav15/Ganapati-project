"use client";

import { useState, useRef } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { sendContactMessage } from "@/app/contact/actions";

const field = "w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-sage-deep";

export default function ContactForm() {
  const { t } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());

  async function submit() {
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }
    const waText = "New enquiry from " + form.name + " (" + form.email + (form.phone ? ", " + form.phone : "") + "):\n" + form.message;
    window.open("https://wa.me/917020290393?text=" + encodeURIComponent(waText), "_blank");
    setStatus("sending");
    const res = await sendContactMessage({
      ...form,
      website: honeypotRef.current?.value || "",
      elapsedMs: Date.now() - startedAt.current,
    });
    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-xl rounded-xl2 border border-line bg-white p-7">
      <h3 className="text-lg">{t.sendMessage}</h3>
      <div className="mt-4 space-y-4">
        <input className={field} placeholder={t.fullName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={field} type="email" placeholder={t.emailPlaceholder} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className={field} type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <textarea className={field} rows={4} placeholder={t.yourMessage} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
        {status === "error" && <p className="text-sm text-red-600">{t.contactError}</p>}
        {status === "sent" && <p className="text-sm text-sage-deep">{t.contactSent}</p>}
        <button onClick={submit} disabled={status === "sending"} className="btn-primary w-full text-center disabled:opacity-60">{status === "sending" ? "..." : t.sendMessage}</button>
      </div>
    </div>
  );
}
