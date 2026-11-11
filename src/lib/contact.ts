/** Contact-form schema + validation. */

export const TEAM_SIZES = ["1–50", "51–200", "201–1,000", "1,000+"] as const;
export const TIMELINES = ["ASAP", "This quarter", "Next quarter", "Exploring"] as const;
export const BOTTLENECK_TOOLS = [
  "Spreadsheets",
  "Email inboxes",
  "CRM data entry",
  "Invoice / billing",
  "Reporting",
  "Ticketing",
  "Content publishing",
  "Other",
] as const;

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  role: string;
  teamSize: string;
  timeline: string;
  tools: string[];
  bottleneck: string;
  /** Honeypot — must stay empty. */
  website?: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|icloud|proton)\./i;

export function validateContact(p: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (str(p.name).length < 2) errors.name = "Please enter your full name.";
  const email = str(p.email);
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  else if (FREE_MAIL.test(email)) errors.email = "Please use your work email.";
  if (str(p.company).length < 2) errors.company = "Company is required.";
  if (!TEAM_SIZES.includes(str(p.teamSize) as (typeof TEAM_SIZES)[number])) errors.teamSize = "Select a team size.";
  if (!Array.isArray(p.tools) || p.tools.length === 0) errors.tools = "Select at least one area.";
  if (str(p.bottleneck).length < 20) errors.bottleneck = "Tell us a bit more (20+ characters).";
  if (str(p.bottleneck).length > 2000) errors.bottleneck = "Please keep this under 2,000 characters.";

  return errors;
}
