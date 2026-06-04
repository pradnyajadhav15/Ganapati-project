"use client";

import { useState } from "react";

type Sub = { name: string | null; email: string | null; phone: string | null; created_at: string };

export default function SubscriberExport({ subscribers }: { subscribers: Sub[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const emails = subscribers.map((s) => s.email).filter(Boolean).join(", ");
  const phones = subscribers
    .map((s) => s.phone)
    .filter(Boolean)
    .map((p) => (p as string).replace(/\D/g, "").slice(-10))
    .filter(Boolean)
    .join(", ");

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied("error");
      setTimeout(() => setCopied(null), 1500);
    }
  }

  function downloadCsv() {
    const esc = (v: string | null) => '"' + (v ?? "").replace(/"/g, '""') + '"';
    const header = "Name,Email,Phone,Date\n";
    const rows = subscribers
      .map((s) =>
        [esc(s.name), esc(s.email), esc(s.phone), esc(new Date(s.created_at).toLocaleDateString("en-IN"))].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const btn = "rounded-full border border-line px-4 py-2 text-sm font-semibold text-sage-deep transition hover:bg-cream-deep disabled:opacity-50";

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={() => copy(emails, "emails")} disabled={!emails} className={btn}>
        {copied === "emails" ? "Copied!" : "Copy all emails"}
      </button>
      <button onClick={() => copy(phones, "phones")} disabled={!phones} className={btn}>
        {copied === "phones" ? "Copied!" : "Copy all WhatsApp numbers"}
      </button>
      <button onClick={downloadCsv} disabled={!subscribers.length} className={btn}>
        Download CSV
      </button>
    </div>
  );
}
