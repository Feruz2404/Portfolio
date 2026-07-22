"use client";

import { useLocale } from "next-intl";
import { useState } from "react";

const copy = {
  en: {
    name: "Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    message: "Message",
    failed: "Failed to send. Please try again.",
    success: "Message sent. We will reply within 24 hours.",
    sending: "Sending...",
    send: "Send message",
  },
  ru: {
    name: "Имя",
    email: "Email",
    company: "Компания",
    phone: "Телефон",
    message: "Сообщение",
    failed: "Не удалось отправить. Попробуйте ещё раз.",
    success: "Сообщение отправлено. Мы ответим в течение 24 часов.",
    sending: "Отправка...",
    send: "Отправить",
  },
  uz: {
    name: "Ism",
    email: "Email",
    company: "Kompaniya",
    phone: "Telefon",
    message: "Xabar",
    failed: "Yuborib bo'lmadi. Qayta urinib ko'ring.",
    success: "Xabar yuborildi. 24 soat ichida javob beramiz.",
    sending: "Yuborilmoqda...",
    send: "Xabar yuborish",
  },
} as const;

function getCopy(locale: string) {
  if (locale === "ru" || locale === "uz") return copy[locale];
  return copy.en;
}

export default function ContactForm() {
  const text = getCopy(useLocale());
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4 border border-white/10 bg-white/[0.025] p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setOk(false);
        setLoading(true);

        try {
          const form = event.currentTarget;
          const payload = Object.fromEntries(new FormData(form).entries());

          const res = await fetch("/api/contacts", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            setError(text.failed);
            return;
          }

          setOk(true);
          form.reset();
        } catch {
          setError(text.failed);
        } finally {
          setLoading(false);
        }
      }}
    >
      <Field label={text.name} htmlFor="cf-name">
        <input id="cf-name" name="name" required className="w-full border border-white/10 bg-surface-00 px-3 py-2.5 text-sm outline-none focus:border-teal-200/50" />
      </Field>
      <Field label={text.email} htmlFor="cf-email">
        <input id="cf-email" name="email" type="email" required className="w-full border border-white/10 bg-surface-00 px-3 py-2.5 text-sm outline-none focus:border-teal-200/50" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={text.company} htmlFor="cf-company">
          <input id="cf-company" name="company" className="w-full border border-white/10 bg-surface-00 px-3 py-2.5 text-sm outline-none focus:border-teal-200/50" />
        </Field>
        <Field label={text.phone} htmlFor="cf-phone">
          <input id="cf-phone" name="phone" className="w-full border border-white/10 bg-surface-00 px-3 py-2.5 text-sm outline-none focus:border-teal-200/50" />
        </Field>
      </div>
      <Field label={text.message} htmlFor="cf-message">
        <textarea id="cf-message" name="message" required rows={5} className="w-full border border-white/10 bg-surface-00 px-3 py-2.5 text-sm outline-none focus:border-teal-200/50" />
      </Field>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {error ? <p className="border border-red-300/20 bg-red-950/30 px-3 py-2 text-sm text-red-200">{error}</p> : null}
      {ok ? <p className="border border-teal-200/20 bg-teal-950/20 px-3 py-2 text-sm text-teal-100">{text.success}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? text.sending : text.send}
      </button>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm text-white/70">{label}</label>
      {children}
    </div>
  );
}
