"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/utils";
import { submitContact } from "@/app/[locale]/(public)/contact/actions";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact");
  const v = useTranslations("contact.validation");
  const [status, setStatus] = useState<Status>("idle");

  const schema = z.object({
    name: z.string().min(2, v("nameMin")),
    email: z.string().email(v("emailInvalid")),
    company: z.string().optional(),
    phone: z.string().optional(),
    budget: z.string().optional(),
    projectType: z.string().optional(),
    message: z.string().min(10, v("messageMin")),
    website: z.string().optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus("submitting");
    const result = await submitContact(values);
    if (result.ok) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-accent/30 bg-accent/5 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent" aria-hidden>
          ✓
        </div>
        <h3 className="mt-4 text-xl font-semibold text-bone">{t("successTitle")}</h3>
        <p className="mt-2 text-sm text-bone-muted">{t("successBody")}</p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-md border border-line bg-ink-900 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-faint focus-visible:border-accent focus-visible:outline-none";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-line bg-ink-850/60 p-6 md:p-8"
    >
      <h2 className="text-lg font-semibold text-bone">{t("formTitle")}</h2>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("labels.name")} id="cf-name" error={errors.name?.message}>
            <input id="cf-name" autoComplete="name" placeholder={t("placeholders.name")} className={inputClass} aria-invalid={!!errors.name} {...register("name")} />
          </Field>
          <Field label={t("labels.email")} id="cf-email" error={errors.email?.message}>
            <input id="cf-email" type="email" autoComplete="email" placeholder={t("placeholders.email")} className={inputClass} aria-invalid={!!errors.email} {...register("email")} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("labels.company")} id="cf-company" optional={t("optional")}>
            <input id="cf-company" autoComplete="organization" placeholder={t("placeholders.company")} className={inputClass} {...register("company")} />
          </Field>
          <Field label={t("labels.phone")} id="cf-phone" optional={t("optional")}>
            <input id="cf-phone" type="tel" autoComplete="tel" placeholder={t("placeholders.phone")} className={inputClass} {...register("phone")} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("labels.budget")} id="cf-budget" optional={t("optional")}>
            <select id="cf-budget" className={inputClass} defaultValue="" {...register("budget")}>
              <option value="">{t("budgetOptions.unset")}</option>
              <option value="under5k">{t("budgetOptions.under5k")}</option>
              <option value="from5k">{t("budgetOptions.from5k")}</option>
              <option value="from20k">{t("budgetOptions.from20k")}</option>
              <option value="over100k">{t("budgetOptions.over100k")}</option>
              <option value="undecided">{t("budgetOptions.undecided")}</option>
            </select>
          </Field>
          <Field label={t("labels.projectType")} id="cf-type" optional={t("optional")}>
            <select id="cf-type" className={inputClass} defaultValue="" {...register("projectType")}>
              <option value="">{t("projectTypeOptions.unset")}</option>
              <option value="web">{t("projectTypeOptions.web")}</option>
              <option value="interactive">{t("projectTypeOptions.interactive")}</option>
              <option value="mobile">{t("projectTypeOptions.mobile")}</option>
              <option value="systems">{t("projectTypeOptions.systems")}</option>
              <option value="design">{t("projectTypeOptions.design")}</option>
              <option value="other">{t("projectTypeOptions.other")}</option>
            </select>
          </Field>
        </div>

        <Field label={t("labels.message")} id="cf-message" error={errors.message?.message}>
          <textarea id="cf-message" rows={5} placeholder={t("placeholders.message")} className={inputClass} aria-invalid={!!errors.message} {...register("message")} />
        </Field>

        {/* Honeypot — visually hidden, off the tab order */}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-5 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {t("errorBody")}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-4">
        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? t("sending") : t("submit")}
        </Button>
        <p className="text-xs leading-relaxed text-bone-faint">{t("consent")}</p>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  optional,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm text-bone-muted">
        {label}
        {optional ? <span className="text-2xs text-bone-faint">({optional})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className={cn("text-xs text-danger")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
