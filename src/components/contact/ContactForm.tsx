"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { buttonBase, buttonStyles } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/cn";
import {
  BOTTLENECK_TOOLS,
  TEAM_SIZES,
  TIMELINES,
  validateContact,
  type ContactErrors,
  type ContactPayload,
} from "@/lib/contact";

/**
 * The site is a static export (GitHub Pages), so the form posts straight to an
 * n8n Webhook node. Set NEXT_PUBLIC_INTAKE_WEBHOOK_URL at build time and allow
 * the site's origin in the webhook's CORS settings.
 */
const INTAKE_WEBHOOK_URL = process.env.NEXT_PUBLIC_INTAKE_WEBHOOK_URL;

const INITIAL: ContactPayload = {
  name: "",
  email: "",
  company: "",
  role: "",
  teamSize: "",
  timeline: TIMELINES[1],
  tools: [],
  bottleneck: "",
  website: "",
};

const inputClass =
  "w-full rounded-lg border bg-card px-3.5 py-2.5 text-base text-ink placeholder:text-ink-mute transition-[border-color,box-shadow] focus:border-violet focus:ring-4 focus:ring-violet/10 focus:outline-none";

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

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(INITIAL);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const set = <K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleTool = (tool: string) =>
    set("tools", values.tools.includes(tool) ? values.tools.filter((t) => t !== tool) : [...values.tools, tool]);

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
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(first === "tools" ? "tools-group" : (first ?? ""))?.focus();
      return;
    }

    // Bots fill the hidden honeypot field: accept silently, send nothing.
    if (values.website) {
      setStatus("success");
      return;
    }

    if (!INTAKE_WEBHOOK_URL) {
      setServerError("Online booking isn't connected yet. Please reach out to us directly in the meantime.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const payload: Omit<ContactPayload, "website"> = { ...values };
      delete (payload as Partial<ContactPayload>).website;
      const res = await fetch(INTAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString(), page: window.location.href }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      setStatus("success");
    } catch {
      setServerError("We couldn't send that just now. Please try again in a moment.");
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
          <h2 className="mt-5 text-2xl font-semibold text-ink">Thank you, we’ve received your request</h2>
          <p className="mt-3 max-w-md text-ink-soft">
            {values.name.split(" ")[0]}, a solutions engineer will review your bottleneck and reply to{" "}
            <span className="font-semibold text-ink">{values.email}</span> within one business day with suggested discovery slots.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={onSubmit}
          exit={{ opacity: 0 }}
          className="pop space-y-6 rounded-card bg-card p-6 sm:p-8"
        >
          {/* Honeypot — hidden from humans and assistive tech. */}
          <div className="hidden" aria-hidden>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Full name" error={errors.name}>
              <input id="name" autoComplete="name" className={cn(inputClass, borderFor("name"))} value={values.name} onChange={(e) => set("name", e.target.value)} {...aria("name")} />
            </Field>
            <Field id="email" label="Work email" error={errors.email}>
              <input id="email" type="email" autoComplete="email" className={cn(inputClass, borderFor("email"))} value={values.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
            </Field>
            <Field id="company" label="Company" error={errors.company}>
              <input id="company" autoComplete="organization" className={cn(inputClass, borderFor("company"))} value={values.company} onChange={(e) => set("company", e.target.value)} {...aria("company")} />
            </Field>
            <Field id="role" label="Role" hint="Optional">
              <input id="role" autoComplete="organization-title" className={cn(inputClass, "border-line-strong")} value={values.role} onChange={(e) => set("role", e.target.value)} />
            </Field>
            <Field id="teamSize" label="Company size" error={errors.teamSize}>
              <select id="teamSize" className={cn(inputClass, borderFor("teamSize"))} value={values.teamSize} onChange={(e) => set("teamSize", e.target.value)} {...aria("teamSize")}>
                <option value="" disabled>
                  Select…
                </option>
                {TEAM_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s} employees
                  </option>
                ))}
              </select>
            </Field>
            <Field id="timeline" label="Timeline">
              <select id="timeline" className={cn(inputClass, "border-line-strong")} value={values.timeline} onChange={(e) => set("timeline", e.target.value)}>
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <fieldset
            id="tools-group"
            tabIndex={-1}
            aria-describedby={errors.tools ? "tools-error" : undefined}
            className="space-y-3 focus:outline-none"
          >
            <legend className="text-sm font-medium text-ink">Where does manual work pile up today?</legend>
            <div className="flex flex-wrap gap-2">
              {BOTTLENECK_TOOLS.map((tool) => {
                const checked = values.tools.includes(tool);
                return (
                  <label
                    key={tool}
                    className={cn(
                      "cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-violet",
                      checked ? "border-violet bg-violet-tint text-violet-deep" : "border-line-strong bg-card text-ink-soft hover:border-ink-mute hover:text-ink",
                    )}
                  >
                    <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleTool(tool)} />
                    {tool}
                  </label>
                );
              })}
            </div>
            {errors.tools && (
              <p id="tools-error" className="text-sm font-medium text-danger">
                {errors.tools}
              </p>
            )}
          </fieldset>

          <Field
            id="bottleneck"
            label="Describe your biggest manual bottleneck"
            error={errors.bottleneck}
            hint="Which tools are involved, who does the work, and roughly how many hours per week?"
          >
            <textarea
              id="bottleneck"
              rows={5}
              className={cn(inputClass, "resize-y", borderFor("bottleneck"))}
              placeholder="e.g. Our finance team exports Stripe payouts to Excel every Monday and matches them against QuickBooks by hand — ~6 hrs/week…"
              value={values.bottleneck}
              onChange={(e) => set("bottleneck", e.target.value)}
              {...aria("bottleneck")}
            />
          </Field>

          {serverError && (
            <p role="alert" className="rounded-lg border border-danger/30 bg-coral-tint px-4 py-2.5 text-sm font-medium text-coral-deep">
              {serverError}
            </p>
          )}

          <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-mute">We reply within one business day.</p>
            <button
              type="submit"
              disabled={status === "submitting"}
              className={cn(buttonBase, buttonStyles.primary, "w-full sm:w-auto")}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
                </>
              ) : (
                <>
                  Request Discovery Call <Send className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
