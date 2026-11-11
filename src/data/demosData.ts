import type { DemoVideo } from "@/lib/types";

/**
 * Demo recordings shown on /demos and the home page.
 *
 * To publish a recording, set `source` on its entry:
 *   YouTube: { kind: "youtube", id: "dQw4w9WgXcQ" }   (the part after ?v=)
 *   Vimeo:   { kind: "vimeo",   id: "76979871" }
 *   Loom:    { kind: "loom",    id: "abc123..." }      (the part after /share/)
 *   File:    { kind: "file",    src: "/videos/lead-router.mp4" }  (put the file in public/videos/)
 * Optionally add `poster: "/videos/lead-router.jpg"` for a custom thumbnail.
 * Entries without a `source` show a "Recording coming soon" poster.
 */
export const demosData: DemoVideo[] = [
  {
    slug: "ai-lead-scoring-demo",
    title: "AI lead scoring and CRM routing",
    summary:
      "A form submission is enriched, scored by an LLM against the ICP and routed into HubSpot, with a Slack alert for hot leads, in under ten seconds.",
    department: "Sales",
    duration: "3:10",
    integrations: ["HubSpot", "OpenAI", "Clearbit", "Slack"],
    steps: [
      { label: "Webhook", kind: "trigger" },
      { label: "Enrich", kind: "action" },
      { label: "AI score", kind: "ai" },
      { label: "Route", kind: "logic" },
      { label: "HubSpot", kind: "output" },
    ],
    workflowSlug: "ai-lead-scoring-crm-router",
  },
  {
    slug: "stripe-reconciliation-demo",
    title: "Stripe payout reconciliation",
    summary:
      "Nightly matching of Stripe payouts against the ledger in Postgres. Exceptions land in Slack with everything finance needs to resolve them.",
    department: "Finance",
    duration: "2:45",
    integrations: ["Stripe", "Postgres", "Slack", "Google Sheets"],
    steps: [
      { label: "Schedule", kind: "trigger" },
      { label: "Stripe", kind: "action" },
      { label: "Match", kind: "logic" },
      { label: "Ledger", kind: "action" },
      { label: "Slack", kind: "output" },
    ],
    workflowSlug: "stripe-reconciliation-slack",
  },
  {
    slug: "content-repurposer-demo",
    title: "Multi-channel content repurposing",
    summary:
      "One long-form article in Notion becomes on-brand LinkedIn, X and newsletter drafts, queued for review in a single run.",
    department: "Marketing",
    duration: "2:20",
    integrations: ["Notion", "OpenAI", "LinkedIn", "Slack"],
    steps: [
      { label: "Notion", kind: "trigger" },
      { label: "Draft", kind: "ai" },
      { label: "Split", kind: "logic" },
      { label: "Review", kind: "action" },
      { label: "Publish", kind: "output" },
    ],
    workflowSlug: "multi-channel-content-repurposer",
  },
  {
    slug: "invoice-capture-demo",
    title: "Invoice capture to QuickBooks",
    summary:
      "Invoices arriving by email are read with AI, validated against purchase orders and posted to QuickBooks as draft bills.",
    department: "Finance",
    duration: "2:05",
    integrations: ["Gmail", "OpenAI", "QuickBooks"],
    steps: [
      { label: "Inbox", kind: "trigger" },
      { label: "Extract", kind: "ai" },
      { label: "Validate", kind: "logic" },
      { label: "QuickBooks", kind: "output" },
    ],
  },
  {
    slug: "support-triage-demo",
    title: "Support ticket triage",
    summary:
      "New tickets are classified by intent and urgency, tagged, assigned to the right queue and escalated to on-call when an SLA is at risk.",
    department: "Ops",
    duration: "1:55",
    integrations: ["Zendesk", "OpenAI", "Slack"],
    steps: [
      { label: "New ticket", kind: "trigger" },
      { label: "Classify", kind: "ai" },
      { label: "SLA check", kind: "logic" },
      { label: "Assign", kind: "action" },
      { label: "Escalate", kind: "output" },
    ],
  },
];
