import type { Workflow } from "@/lib/types";

/**
 * Example workflows shown in the showroom.
 *
 * These are templates that show how I approach common small-business admin.
 * They are NOT client deployments, and no results are claimed for them.
 *
 * Treat this file as a read-only data source. UI code goes through
 * `src/lib/workflows.ts` so it can later be replaced by a CMS.
 *
 * `n8nJson` is generated from plain objects so every snippet is valid,
 * importable n8n JSON. Credentials are placeholders; connect your own after import.
 */

interface N8nNodeSpec {
  name: string;
  type: string;
  typeVersion: number;
  parameters: Record<string, unknown>;
}

/** Builds an importable n8n workflow, laying nodes out left to right. */
function buildN8nJson(
  name: string,
  nodes: N8nNodeSpec[],
  connections: Array<[from: string, to: string, output?: number]>,
  tags: string[],
): string {
  const conn: Record<string, { main: Array<Array<{ node: string; type: "main"; index: number }>> }> = {};
  for (const [from, to, output = 0] of connections) {
    const entry = (conn[from] ??= { main: [] });
    while (entry.main.length <= output) entry.main.push([]);
    entry.main[output]!.push({ node: to, type: "main", index: 0 });
  }
  return JSON.stringify(
    {
      name,
      nodes: nodes.map((n, i) => ({
        ...n,
        id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i + 1}`,
        position: [240 + i * 220, 300],
      })),
      connections: conn,
      settings: { executionOrder: "v1", errorWorkflow: "error-alert" },
      tags: tags.map((t) => ({ name: t })),
    },
    null,
    2,
  );
}

/* -------------------------------------------------------------------------- */
/* 1. New client intake                                                       */
/* -------------------------------------------------------------------------- */

const clientIntakeJson = buildN8nJson(
  "Example: New client intake",
  [
    {
      name: "Website enquiry",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      parameters: { httpMethod: "POST", path: "new-enquiry", responseMode: "responseNode" },
    },
    {
      name: "Tidy up details",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      parameters: {
        jsCode: [
          "// Normalise the form fields so every row in the sheet looks the same.",
          "return $input.all().map(({ json }) => ({",
          "  json: {",
          "    name: (json.name || '').trim(),",
          "    email: (json.email || '').trim().toLowerCase(),",
          "    phone: (json.phone || '').replace(/\\s+/g, ''),",
          "    service: json.service || 'Not specified',",
          "    message: (json.message || '').trim(),",
          "    received: new Date().toISOString(),",
          "  },",
          "}));",
        ].join("\n"),
      },
    },
    {
      name: "Already a contact?",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 4.5,
      parameters: {
        operation: "read",
        documentId: { __rl: true, mode: "list", value: "" },
        sheetName: { __rl: true, mode: "list", value: "Clients" },
        filtersUI: { values: [{ lookupColumn: "email", lookupValue: "={{ $json.email }}" }] },
      },
    },
    {
      name: "New client?",
      type: "n8n-nodes-base.if",
      typeVersion: 2,
      parameters: {
        conditions: {
          conditions: [{ leftValue: "={{ $json.email }}", operator: { type: "string", operation: "empty" } }],
        },
      },
    },
    {
      name: "Add to client list",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 4.5,
      parameters: {
        operation: "append",
        documentId: { __rl: true, mode: "list", value: "" },
        sheetName: { __rl: true, mode: "list", value: "Clients" },
        columns: { mappingMode: "autoMapInputData" },
      },
    },
    {
      name: "Send welcome email",
      type: "n8n-nodes-base.gmail",
      typeVersion: 2.1,
      parameters: {
        sendTo: "={{ $('Tidy up details').item.json.email }}",
        subject: "Thanks for getting in touch",
        message:
          "Hi {{ $('Tidy up details').item.json.name }},\n\nThanks for your enquiry. To get started, please send over the documents on the attached checklist and we'll be in touch to arrange a call.",
      },
    },
    {
      name: "Let the owner know",
      type: "n8n-nodes-base.gmail",
      typeVersion: 2.1,
      parameters: {
        sendTo: "you@yourpractice.ie",
        subject: "=New enquiry: {{ $('Tidy up details').item.json.name }}",
        message: "={{ JSON.stringify($('Tidy up details').item.json, null, 2) }}",
      },
    },
    {
      name: "Reply to website",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      parameters: { respondWith: "json", responseBody: '={ "ok": true }' },
    },
  ],
  [
    ["Website enquiry", "Tidy up details"],
    ["Tidy up details", "Already a contact?"],
    ["Already a contact?", "New client?"],
    ["New client?", "Add to client list", 0],
    ["New client?", "Let the owner know", 1],
    ["Add to client list", "Send welcome email"],
    ["Send welcome email", "Let the owner know"],
    ["Let the owner know", "Reply to website"],
  ],
  ["example", "client-intake"],
);

/* -------------------------------------------------------------------------- */
/* 2. Daily exception report from a spreadsheet export                        */
/* -------------------------------------------------------------------------- */

const exceptionReportJson = buildN8nJson(
  "Example: Daily exception report",
  [
    {
      name: "Export arrives by email",
      type: "n8n-nodes-base.gmailTrigger",
      typeVersion: 1.2,
      parameters: {
        pollTimes: { item: [{ mode: "everyHour" }] },
        filters: { q: "has:attachment subject:(daily export)" },
        options: { downloadAttachments: true },
      },
    },
    {
      name: "Read the spreadsheet",
      type: "n8n-nodes-base.extractFromFile",
      typeVersion: 1,
      parameters: { operation: "xlsx", binaryPropertyName: "attachment_0" },
    },
    {
      name: "Check each row",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      parameters: {
        jsCode: [
          "// Example rules: edit these to match what 'wrong' looks like in your data.",
          "const exceptions = [];",
          "for (const { json: row } of $input.all()) {",
          "  const problems = [];",
          "  if (!row.Reference) problems.push('Missing reference');",
          "  if (Number(row.Quantity) < 0) problems.push('Negative quantity');",
          "  if (row.Status === 'On hold') problems.push('On hold');",
          "  if (problems.length) exceptions.push({ ...row, Problems: problems.join(', ') });",
          "}",
          "return exceptions.length ? exceptions.map((json) => ({ json })) : [{ json: { none: true } }];",
        ].join("\n"),
      },
    },
    {
      name: "Anything to report?",
      type: "n8n-nodes-base.if",
      typeVersion: 2,
      parameters: {
        conditions: {
          conditions: [{ leftValue: "={{ $json.none }}", operator: { type: "boolean", operation: "notTrue" } }],
        },
      },
    },
    {
      name: "Log exceptions",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 4.5,
      parameters: {
        operation: "append",
        documentId: { __rl: true, mode: "list", value: "" },
        sheetName: { __rl: true, mode: "list", value: "Exceptions" },
        columns: { mappingMode: "autoMapInputData" },
      },
    },
    {
      name: "Email the summary",
      type: "n8n-nodes-base.gmail",
      typeVersion: 2.1,
      parameters: {
        sendTo: "team@yourcompany.ie",
        subject: "=Daily exceptions: {{ $input.all().length }} rows need a look",
        message: "=The rows below need attention. Full list in the Exceptions sheet.",
      },
    },
  ],
  [
    ["Export arrives by email", "Read the spreadsheet"],
    ["Read the spreadsheet", "Check each row"],
    ["Check each row", "Anything to report?"],
    ["Anything to report?", "Log exceptions", 0],
    ["Log exceptions", "Email the summary"],
  ],
  ["example", "reporting"],
);

/* -------------------------------------------------------------------------- */
/* 3. Overdue invoice reminders                                               */
/* -------------------------------------------------------------------------- */

const invoiceRemindersJson = buildN8nJson(
  "Example: Overdue invoice reminders",
  [
    {
      name: "Weekday mornings",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      parameters: { rule: { interval: [{ field: "cronExpression", expression: "0 9 * * 1-5" }] } },
    },
    {
      name: "Read invoice list",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 4.5,
      parameters: {
        operation: "read",
        documentId: { __rl: true, mode: "list", value: "" },
        sheetName: { __rl: true, mode: "list", value: "Invoices" },
      },
    },
    {
      name: "Find overdue",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      parameters: {
        jsCode: [
          "// Overdue, unpaid and not reminded in the last 7 days.",
          "const today = new Date();",
          "const weekAgo = new Date(today.getTime() - 7 * 864e5);",
          "return $input.all().filter(({ json }) => {",
          "  const due = new Date(json['Due date']);",
          "  const last = json['Last reminder'] ? new Date(json['Last reminder']) : null;",
          "  return json.Status !== 'Paid' && due < today && (!last || last < weekAgo);",
          "});",
        ].join("\n"),
      },
    },
    {
      name: "Send polite reminder",
      type: "n8n-nodes-base.gmail",
      typeVersion: 2.1,
      parameters: {
        sendTo: "={{ $json['Client email'] }}",
        subject: "=Friendly reminder: invoice {{ $json['Invoice no'] }}",
        message:
          "=Hi {{ $json['Client name'] }},\n\nJust a reminder that invoice {{ $json['Invoice no'] }} for €{{ $json.Amount }} was due on {{ $json['Due date'] }}. If it's already been paid, please ignore this email.\n\nThanks!",
      },
    },
    {
      name: "Record reminder date",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 4.5,
      parameters: {
        operation: "update",
        documentId: { __rl: true, mode: "list", value: "" },
        sheetName: { __rl: true, mode: "list", value: "Invoices" },
        columns: {
          mappingMode: "defineBelow",
          matchingColumns: ["Invoice no"],
          value: { "Invoice no": "={{ $json['Invoice no'] }}", "Last reminder": "={{ $today.toISODate() }}" },
        },
      },
    },
    {
      name: "Daily summary to owner",
      type: "n8n-nodes-base.gmail",
      typeVersion: 2.1,
      parameters: {
        sendTo: "you@yourpractice.ie",
        subject: "=Invoice reminders sent today: {{ $input.all().length }}",
        message: "=Reminders went out for the invoices listed in the Invoices sheet (see 'Last reminder').",
      },
    },
  ],
  [
    ["Weekday mornings", "Read invoice list"],
    ["Read invoice list", "Find overdue"],
    ["Find overdue", "Send polite reminder"],
    ["Send polite reminder", "Record reminder date"],
    ["Record reminder date", "Daily summary to owner"],
  ],
  ["example", "billing"],
);

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */

export const workflowsData: Workflow[] = [
  {
    slug: "new-client-intake",
    title: "New client intake",
    tagline: "Every website enquiry logged, welcomed and passed to you, without anyone retyping it.",
    description:
      "When someone fills in the enquiry form on your website, their details are tidied up, checked against your existing client list and added to a Google Sheet. New clients get a welcome email with your onboarding checklist, and you get a notification with everything they sent.",
    department: "Admin",
    complexity: "Basic",
    integrations: ["Gmail", "Google Sheets"],
    tags: ["Client onboarding", "Enquiries", "No double entry"],
    nodes: [
      {
        id: "n1",
        name: "Website enquiry",
        type: "n8n-nodes-base.webhook",
        kind: "trigger",
        summary: "Your website form sends each new enquiry straight to the workflow.",
      },
      {
        id: "n2",
        name: "Tidy up details",
        type: "n8n-nodes-base.code",
        kind: "logic",
        summary: "Trims spaces, lower-cases email addresses and adds a timestamp so every row looks the same.",
        detail: "A short JavaScript Function node. Easy to extend with extra fields from your form.",
      },
      {
        id: "n3",
        name: "Already a contact?",
        type: "n8n-nodes-base.googleSheets",
        kind: "action",
        summary: "Looks the email address up in your client list so repeat enquiries aren't added twice.",
      },
      {
        id: "n4",
        name: "New client?",
        type: "n8n-nodes-base.if",
        kind: "logic",
        summary: "New contacts go through onboarding; existing ones skip straight to the notification.",
      },
      {
        id: "n5",
        name: "Add to client list",
        type: "n8n-nodes-base.googleSheets",
        kind: "action",
        summary: "Adds a new row to the Clients sheet with all the details from the form.",
      },
      {
        id: "n6",
        name: "Send welcome email",
        type: "n8n-nodes-base.gmail",
        kind: "output",
        summary: "Sends the client a welcome email from your own Gmail address with your onboarding checklist.",
      },
      {
        id: "n7",
        name: "Let the owner know",
        type: "n8n-nodes-base.gmail",
        kind: "output",
        summary: "Emails you a summary of the enquiry so you can follow up personally.",
      },
    ],
    value: {
      headline: "No more copying enquiries from your inbox into a spreadsheet.",
      points: [
        "Every enquiry lands in one list, in the same format, with nothing retyped.",
        "New clients get a consistent welcome straight away, even out of hours.",
        "Duplicate contacts are caught before they're added.",
        "You still get a personal heads-up for every enquiry.",
      ],
    },
    specs: {
      trigger: "Webhook from your website form",
      errorHandling: "Error alert by email if any step fails, so nothing goes missing silently",
      hosting: "Self-hosted n8n (Docker) or n8n Cloud",
      credentials: ["Gmail (OAuth)", "Google Sheets (OAuth)"],
      n8nVersion: "1.x",
    },
    n8nJson: clientIntakeJson,
  },
  {
    slug: "daily-exception-report",
    title: "Daily exception report from a spreadsheet",
    tagline: "The rows that need attention, pulled out of a messy export and emailed to you every morning.",
    description:
      "Many systems can only give you an Excel export. This workflow picks up the export when it arrives by email, reads every row, applies your rules for what counts as a problem, logs the exceptions to a Google Sheet and emails a short summary, so nobody has to scan the whole file by hand.",
    department: "Operations",
    complexity: "Advanced",
    integrations: ["Gmail", "Excel", "Google Sheets"],
    tags: ["Reporting", "Excel exports", "Exceptions"],
    nodes: [
      {
        id: "n1",
        name: "Export arrives by email",
        type: "n8n-nodes-base.gmailTrigger",
        kind: "trigger",
        summary: "Watches your inbox for the daily export email and downloads the attachment.",
      },
      {
        id: "n2",
        name: "Read the spreadsheet",
        type: "n8n-nodes-base.extractFromFile",
        kind: "action",
        summary: "Opens the Excel file and turns each row into data the workflow can check.",
      },
      {
        id: "n3",
        name: "Check each row",
        type: "n8n-nodes-base.code",
        kind: "logic",
        summary: "Applies your rules (missing references, negative quantities, items on hold and so on) to every row.",
        detail: "The rules live in one short JavaScript Function node, so they're easy to read and change.",
      },
      {
        id: "n4",
        name: "Anything to report?",
        type: "n8n-nodes-base.if",
        kind: "logic",
        summary: "If every row is fine, the workflow stops quietly.",
      },
      {
        id: "n5",
        name: "Log exceptions",
        type: "n8n-nodes-base.googleSheets",
        kind: "action",
        summary: "Adds each problem row, with the reason it was flagged, to an Exceptions sheet.",
      },
      {
        id: "n6",
        name: "Email the summary",
        type: "n8n-nodes-base.gmail",
        kind: "output",
        summary: "Sends the team a short email listing what needs a look today.",
      },
    ],
    value: {
      headline: "Spend your morning fixing problems, not hunting for them in a spreadsheet.",
      points: [
        "Problem rows are found the same way every day, using rules you agree on.",
        "A running log of exceptions builds up in Google Sheets automatically.",
        "Quiet days stay quiet: you only hear about it when something needs attention.",
        "Rules are written in plain, commented code you can change later.",
      ],
    },
    specs: {
      trigger: "Gmail: new email with the export attached",
      errorHandling: "Error alert by email if the file can't be read or a step fails",
      hosting: "Self-hosted n8n (Docker) or n8n Cloud",
      credentials: ["Gmail (OAuth)", "Google Sheets (OAuth)"],
      n8nVersion: "1.x",
    },
    n8nJson: exceptionReportJson,
  },
  {
    slug: "overdue-invoice-reminders",
    title: "Overdue invoice reminders",
    tagline: "Polite payment reminders sent on time, from your own email, without you having to remember.",
    description:
      "Each weekday morning the workflow reads your invoice list in Google Sheets, finds invoices that are overdue and haven't had a reminder in the last week, sends each client a polite reminder from your Gmail and records the date, then sends you a short summary.",
    department: "Finance",
    complexity: "Basic",
    integrations: ["Google Sheets", "Gmail"],
    tags: ["Billing admin", "Cash flow", "Scheduled"],
    nodes: [
      {
        id: "n1",
        name: "Weekday mornings",
        type: "n8n-nodes-base.scheduleTrigger",
        kind: "trigger",
        summary: "Runs automatically at 9am, Monday to Friday.",
      },
      {
        id: "n2",
        name: "Read invoice list",
        type: "n8n-nodes-base.googleSheets",
        kind: "action",
        summary: "Reads your invoice tracker: client, amount, due date, status and last reminder.",
      },
      {
        id: "n3",
        name: "Find overdue",
        type: "n8n-nodes-base.code",
        kind: "logic",
        summary: "Keeps only unpaid invoices past their due date that haven't been chased in the last 7 days.",
      },
      {
        id: "n4",
        name: "Send polite reminder",
        type: "n8n-nodes-base.gmail",
        kind: "output",
        summary: "Sends each client a friendly reminder from your own email address, using your wording.",
      },
      {
        id: "n5",
        name: "Record reminder date",
        type: "n8n-nodes-base.googleSheets",
        kind: "action",
        summary: "Writes today's date into the sheet so nobody gets chased twice in a week.",
      },
      {
        id: "n6",
        name: "Daily summary to owner",
        type: "n8n-nodes-base.gmail",
        kind: "output",
        summary: "Lets you know which reminders went out.",
      },
    ],
    value: {
      headline: "Chasing payments happens on schedule instead of when someone remembers.",
      points: [
        "Reminders go out consistently, in your tone, from your own email address.",
        "Clients aren't chased more than once a week.",
        "Your invoice sheet stays the single place to see what's outstanding.",
        "You stay in control: change the wording or timing any time.",
      ],
    },
    specs: {
      trigger: "Schedule: 9am, Monday to Friday",
      errorHandling: "Error alert by email if a reminder can't be sent",
      hosting: "Self-hosted n8n (Docker) or n8n Cloud",
      credentials: ["Gmail (OAuth)", "Google Sheets (OAuth)"],
      n8nVersion: "1.x",
    },
    n8nJson: invoiceRemindersJson,
  },
];
