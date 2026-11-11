/** Contact-form schema and validation. */

export interface ContactPayload {
  name: string;
  email: string;
  /** "What takes up too much of your time?" */
  message: string;
  /** Optional: "How did you hear about GridNodes?" */
  source: string;
  /** Formspree honeypot: must stay empty (bots fill it in). */
  _gotcha: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(p: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (str(p.name).length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(str(p.email))) errors.email = "Please enter a valid email address.";
  const message = str(p.message);
  if (message.length < 10) errors.message = "Please tell me a little about it (at least a sentence).";
  else if (message.length > 3000) errors.message = "Please keep this under 3,000 characters.";
  if (str(p.source).length > 200) errors.source = "Please keep this short.";

  return errors;
}
