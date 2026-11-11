"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { buttonBase, buttonStyles } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/cn";
import { validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact";
import { siteConfig } from "@/lib/site";

/**
 * GitHub Pages can't process forms, so submissions go to Formspree.
 * Set siteConfig.formspreeId in src/lib/site.ts. Until then (or if Formspree
 * fails) visitors are offered a mailto link instead.
 */
const FORMSPREE_ID: string = siteConfig.formspreeId;
const FORMSPREE_READY = FORMSPREE_ID !== "" && FORMSPREE_ID !== "FORMSPREE_ID";
const EMAIL = siteConfig.owner.email;

const INITIAL: ContactPayload = { name: "", email: "", message: "", source: "", _gotcha: "" };

const inputClass =
  "w-full rounded-lg border bg-card px-3.5 py-3 text-base text-ink placeholder:text-ink-mute transition-[border-color,box-shadow] focus:border-coral focus:ring-4 focus:ring-coral/15 focus:outline-none";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-ink-mute">{hint}</p>
      ) : null}
    </div>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

function mailtoHref(values: ContactPayload) {
  const body = [values.message, "", `From: ${values.name} <${values.email}>`, values.source ? `Heard about GridNodes via: ${values.source}` : ""]
    .filter(Boolean)
    .join("\n");
  return `mailto:${EMAIL}?subject=${encodeURIComponent("GridNodes enquiry")}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(INITIAL);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const set = <K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const aria = (key: keyof ContactPayload) => ({
    "aria-invalid": Boolean(errors[key]) || undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  const borderFor = (key: keyof ContactPayload) => (errors[key] ? "border-danger" : "border-line-strong");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const found = validateContact(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    // Bots fill the hidden honeypot: pretend it worked and send nothing.
    if (values._gotcha) {
      setStatus("success");
      return;
    }

    if (!FORMSPREE_READY) {
      setServerError("The online form isn't switched on yet.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          source: values.source,
          _gotcha: values._gotcha,
          _subject: `GridNodes enquiry from ${values.name}`,
        }),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setStatus("success");
    } catch {
      setServerError("Sorry, that didn't send.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pop flex flex-col items-center rounded-card bg-card px-6 py-16 text-center"
          role="status"
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-mint-tint"
          >
            <CheckCircle2 className="h-7 w-7 text-mint-deep" aria-hidden />
          </motion.span>
          <h2 className="mt-5 text-2xl font-semibold text-ink">Thanks, {values.name.split(" ")[0]}. Message received.</h2>
          <p className="mt-3 max-w-md text-ink-soft">
            I&rsquo;ll reply to <span className="font-semibold text-ink">{values.email}</span> within 2 working days.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={onSubmit}
          exit={{ opacity: 0 }}
          className="pop space-y-6 rounded-card bg-card p-6 sm:p-8"
          aria-label="Contact form"
        >
          {/* Honeypot: hidden from people and assistive tech. */}
          <div className="hidden" aria-hidden>
            <label htmlFor="_gotcha">Leave this empty</label>
            <input id="_gotcha" name="_gotcha" tabIndex={-1} autoComplete="off" value={values._gotcha} onChange={(e) => set("_gotcha", e.target.value)} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Name" error={errors.name}>
              <input id="name" name="name" autoComplete="name" className={cn(inputClass, borderFor("name"))} value={values.name} onChange={(e) => set("name", e.target.value)} {...aria("name")} />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" inputMode="email" className={cn(inputClass, borderFor("email"))} value={values.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
            </Field>
          </div>

          <Field
            id="message"
            label="What takes up too much of your time?"
            error={errors.message}
            hint="For example: which spreadsheets, emails or tools are involved, and who does the work."
          >
            <textarea
              id="message"
              name="message"
              rows={6}
              className={cn(inputClass, "resize-y", borderFor("message"))}
              placeholder="e.g. Every month I export our client list from the accounts system and build a billing sheet for each client by hand…"
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              {...aria("message")}
            />
          </Field>

          <Field id="source" label="How did you hear about GridNodes? (optional)" error={errors.source}>
            <input id="source" name="source" className={cn(inputClass, borderFor("source"))} value={values.source} onChange={(e) => set("source", e.target.value)} {...aria("source")} />
          </Field>

          {serverError && (
            <div role="alert" className="rounded-lg border border-danger/30 bg-coral-tint px-4 py-3 text-sm text-coral-deep">
              <p className="font-medium">{serverError}</p>
              <p className="mt-1">
                You can email me directly instead:{" "}
                <a href={mailtoHref(values)} className="font-semibold underline underline-offset-2">
                  {EMAIL}
                </a>{" "}
                (your message will be copied into the email).
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-mute">
              I&rsquo;ll reply within 2 working days.
              <br />
              Prefer email?{" "}
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1 font-medium text-ink underline decoration-line-strong underline-offset-2 hover:decoration-ink">
                <Mail className="h-3.5 w-3.5" aria-hidden /> {EMAIL}
              </a>
            </p>
            <button type="submit" disabled={status === "submitting"} className={cn(buttonBase, buttonStyles.primary, "w-full py-3 sm:w-auto")}>
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
                </>
              ) : (
                <>
                  Send message <Send className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
