import type { DemoVideo } from "@/lib/types";

/**
 * Demo recordings shown on /demos and the home page.
 * The Demos feature is switched off in src/lib/site.ts (features.demos) until
 * recordings exist.
 *
 * To publish a recording, set `source` on its entry:
 *   YouTube: { kind: "youtube", id: "dQw4w9WgXcQ" }   (the part after ?v=)
 *   Vimeo:   { kind: "vimeo",   id: "76979871" }
 *   Loom:    { kind: "loom",    id: "abc123..." }      (the part after /share/)
 *   File:    { kind: "file",    src: "/videos/client-intake.mp4" }  (put the file in public/videos/)
 * Optionally add `poster: "/videos/client-intake.jpg"` for a custom thumbnail.
 * Entries without a `source` show a "Recording coming soon" poster.
 */
export const demosData: DemoVideo[] = [
  {
    slug: "new-client-intake-demo",
    title: "New client intake",
    summary:
      "A website enquiry is tidied up, checked against the client list, added to Google Sheets and answered with a welcome email.",
    department: "Admin",
    integrations: ["Gmail", "Google Sheets"],
    steps: [
      { label: "Enquiry", kind: "trigger" },
      { label: "Tidy up", kind: "logic" },
      { label: "Sheets", kind: "action" },
      { label: "Welcome", kind: "output" },
    ],
    workflowSlug: "new-client-intake",
  },
  {
    slug: "daily-exception-report-demo",
    title: "Daily exception report from a spreadsheet",
    summary:
      "An Excel export arrives by email, every row is checked against agreed rules and only the problem rows are logged and emailed.",
    department: "Operations",
    integrations: ["Gmail", "Excel", "Google Sheets"],
    steps: [
      { label: "Export", kind: "trigger" },
      { label: "Read", kind: "action" },
      { label: "Check", kind: "logic" },
      { label: "Log", kind: "action" },
      { label: "Email", kind: "output" },
    ],
    workflowSlug: "daily-exception-report",
  },
  {
    slug: "overdue-invoice-reminders-demo",
    title: "Overdue invoice reminders",
    summary:
      "Each weekday morning, overdue invoices are found in a Google Sheet and polite reminders go out from Gmail.",
    department: "Finance",
    integrations: ["Google Sheets", "Gmail"],
    steps: [
      { label: "Schedule", kind: "trigger" },
      { label: "Invoices", kind: "action" },
      { label: "Overdue?", kind: "logic" },
      { label: "Remind", kind: "output" },
    ],
    workflowSlug: "overdue-invoice-reminders",
  },
];
