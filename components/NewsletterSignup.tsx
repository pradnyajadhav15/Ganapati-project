"use client";

import { useState, useRef } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { subscribe } from "@/app/subscribe/actions";

const field = "w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/60 outline-none focus:border-white";

export default function NewsletterSignup() {
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());

  async function submit() {
    if (!email.trim() && !phone.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const res = await subscribe({
      name,
      email,
      phone,
      website: honeypotRef.current?.value || "",
      elapsedMs: Date.now() - startedAt.current,
    });
    if (res.ok) {
      setStatus("sent");
      setName("");
      setEmail("");
      setPhone("");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="mb-12 rounded-xl2 bg-white/5 p-6">
      <h4 className="font-display text-xl text-white">{t.newsletterTitle}</h4>
      <p className="mt-1 max-w-xl text-sm opacity-85">{t.newsletterIntro}</p>

      {status === "sent" ? (
        <p className="mt-4 text-sm font-medium text-white">{t.newsletterThanks}</p>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input className={field} placeholder={t.fullName} value={name} onChange={(e) => setName(e.target.value)} />
            <input className={field} placeholder={t.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={field} placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <button
              onClick={submit}
              disabled={status === "sending"}
              className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-sage-deep transition hover:bg-cream disabled:opacity-60"
            >
              {status === "sending" ? t.processing : t.subscribeBtn}
            </button>
          </div>
          {status === "error" && <p className="mt-2 text-sm text-rose-200">{t.newsletterError}</p>}
        </>
      )}
    </div>
  );
}
