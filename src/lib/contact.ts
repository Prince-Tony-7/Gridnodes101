/** Contact-form schema and validation. */

export interface ContactPayload {
  name: string;
  email: string;
  /** "What takes up too much of your time?" */
  message: string;
  /** Optional: "How did you hear about GridNodes?" */
  source: string;
  /** Honeypot: must stay empty (bots fill it in). */
  _gotcha: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Maximum lengths, enforced both in the inputs and in validation. */
export const CONTACT_LIMITS = { name: 100, email: 254, message: 3000, source: 200 } as const;

export function validateContact(p: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(p.name);
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > CONTACT_LIMITS.name) errors.name = "Please keep your name under 100 characters.";
  const email = str(p.email);
  if (!EMAIL_RE.test(email) || email.length > CONTACT_LIMITS.email) errors.email = "Please enter a valid email address.";
  const message = str(p.message);
  if (message.length < 10) errors.message = "Please tell me a little about it (at least a sentence).";
  else if (message.length > CONTACT_LIMITS.message) errors.message = "Please keep this under 3,000 characters.";
  if (str(p.source).length > CONTACT_LIMITS.source) errors.source = "Please keep this short.";

  return errors;
}
