import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact";

/**
 * Discovery intake endpoint.
 * TODO: forward to CRM / n8n webhook (e.g. process.env.INTAKE_WEBHOOK_URL).
 */
export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  // Silently accept bot submissions caught by the honeypot.
  if (body.website) return NextResponse.json({ ok: true });

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const webhook = process.env.INTAKE_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, receivedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[contact] intake webhook failed", err);
      return NextResponse.json({ ok: false, error: "Could not submit right now. Please try again." }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
