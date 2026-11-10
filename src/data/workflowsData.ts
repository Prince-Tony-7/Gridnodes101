import type { Workflow } from "@/lib/types";

/**
 * Mock database of n8n automation samples.
 *
 * Treat this file as a read-only data source. UI code should never import it
 * directly — go through `src/lib/workflows.ts` so the backing store can be
 * replaced by a CMS/API without touching components.
 *
 * `n8nJson` is generated from plain objects via `toN8nJson` so that every
 * snippet is guaranteed to be valid, importable JSON.
 */

const toN8nJson = (workflow: object): string => JSON.stringify(workflow, null, 2);

/* -------------------------------------------------------------------------- */
/* 1. AI Lead Scoring & CRM Router                                            */
/* -------------------------------------------------------------------------- */

const aiLeadScoringJson = toN8nJson({
  name: "AI Lead Scoring & CRM Router",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "inbound-lead",
        responseMode: "responseNode",
        options: {},
      },
      id: "a1f0c1d2-0001-4b8e-9a01-lead00000001",
      name: "Inbound Lead Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [240, 300],
      webhookId: "inbound-lead",
    },
    {
      parameters: {
        url: "=https://company.clearbit.com/v2/companies/find?domain={{ $json.body.email.split('@')[1] }}",
        authentication: "genericCredentialType",
        genericAuthType: "httpHeaderAuth",
        options: { timeout: 8000 },
      },
      id: "a1f0c1d2-0002-4b8e-9a01-lead00000002",
      name: "Enrich Company (Clearbit)",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [460, 300],
      continueOnFail: true,
    },
    {
      parameters: {
        modelId: { __rl: true, value: "gpt-4o-mini", mode: "list" },
        messages: {
          values: [
            {
              role: "system",
              content:
                "You are a B2B lead qualification analyst. Score the lead 0-100 against the ICP: SaaS, 50-1000 employees, NA/EU. Respond ONLY with JSON: {\"score\": number, \"tier\": \"hot\"|\"warm\"|\"cold\", \"reasoning\": string}.",
            },
            {
              content:
                "=Lead: {{ JSON.stringify($('Inbound Lead Webhook').item.json.body) }}\nCompany: {{ JSON.stringify($json) }}",
            },
          ],
        },
        jsonOutput: true,
        options: { temperature: 0.1 },
      },
      id: "a1f0c1d2-0003-4b8e-9a01-lead00000003",
      name: "Score Lead (OpenAI)",
      type: "@n8n/n8n-nodes-langchain.openAi",
      typeVersion: 1.8,
      position: [680, 300],
    },
    {
      parameters: {
        rules: {
          values: [
            {
              conditions: {
                conditions: [
                  { leftValue: "={{ $json.message.content.tier }}", rightValue: "hot", operator: { type: "string", operation: "equals" } },
                ],
              },
              renameOutput: true,
              outputKey: "Hot",
            },
            {
              conditions: {
                conditions: [
                  { leftValue: "={{ $json.message.content.tier }}", rightValue: "warm", operator: { type: "string", operation: "equals" } },
                ],
              },
              renameOutput: true,
              outputKey: "Warm",
            },
          ],
        },
        options: { fallbackOutput: "extra", renameFallbackOutput: "Cold" },
      },
      id: "a1f0c1d2-0004-4b8e-9a01-lead00000004",
      name: "Route by Tier",
      type: "n8n-nodes-base.switch",
      typeVersion: 3.2,
      position: [900, 300],
    },
    {
      parameters: {
        resource: "contact",
        operation: "upsert",
        email: "={{ $('Inbound Lead Webhook').item.json.body.email }}",
        additionalFields: {
          lifecycleStage: "salesqualifiedlead",
          leadStatus: "OPEN",
          customPropertiesUi: {
            customPropertiesValues: [
              { property: "ai_lead_score", value: "={{ $json.message.content.score }}" },
              { property: "ai_score_reasoning", value: "={{ $json.message.content.reasoning }}" },
            ],
          },
        },
      },
      id: "a1f0c1d2-0005-4b8e-9a01-lead00000005",
      name: "Upsert HubSpot (SQL)",
      type: "n8n-nodes-base.hubspot",
      typeVersion: 2.1,
      position: [1120, 160],
    },
    {
      parameters: {
        select: "channel",
        channelId: { __rl: true, value: "#sales-hot-leads", mode: "name" },
        text: "=:fire: *Hot lead* — {{ $('Inbound Lead Webhook').item.json.body.name }} ({{ $('Inbound Lead Webhook').item.json.body.company }})\nScore: *{{ $('Score Lead (OpenAI)').item.json.message.content.score }}*",
        otherOptions: {},
      },
      id: "a1f0c1d2-0006-4b8e-9a01-lead00000006",
      name: "Alert #sales-hot-leads",
      type: "n8n-nodes-base.slack",
      typeVersion: 2.3,
      position: [1340, 160],
    },
    {
      parameters: {
        resource: "contact",
        operation: "upsert",
        email: "={{ $('Inbound Lead Webhook').item.json.body.email }}",
        additionalFields: { lifecycleStage: "marketingqualifiedlead" },
      },
      id: "a1f0c1d2-0007-4b8e-9a01-lead00000007",
      name: "Upsert HubSpot (MQL Nurture)",
      type: "n8n-nodes-base.hubspot",
      typeVersion: 2.1,
      position: [1120, 360],
    },
    {
      parameters: {
        respondWith: "json",
        responseBody: "={{ { received: true, tier: $('Score Lead (OpenAI)').item.json.message.content.tier } }}",
      },
      id: "a1f0c1d2-0008-4b8e-9a01-lead00000008",
      name: "Respond 200",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [1560, 300],
    },
  ],
  connections: {
    "Inbound Lead Webhook": { main: [[{ node: "Enrich Company (Clearbit)", type: "main", index: 0 }]] },
    "Enrich Company (Clearbit)": { main: [[{ node: "Score Lead (OpenAI)", type: "main", index: 0 }]] },
    "Score Lead (OpenAI)": { main: [[{ node: "Route by Tier", type: "main", index: 0 }]] },
    "Route by Tier": {
      main: [
        [{ node: "Upsert HubSpot (SQL)", type: "main", index: 0 }],
        [{ node: "Upsert HubSpot (MQL Nurture)", type: "main", index: 0 }],
        [{ node: "Respond 200", type: "main", index: 0 }],
      ],
    },
    "Upsert HubSpot (SQL)": { main: [[{ node: "Alert #sales-hot-leads", type: "main", index: 0 }]] },
    "Alert #sales-hot-leads": { main: [[{ node: "Respond 200", type: "main", index: 0 }]] },
    "Upsert HubSpot (MQL Nurture)": { main: [[{ node: "Respond 200", type: "main", index: 0 }]] },
  },
  settings: { executionOrder: "v1", saveManualExecutions: true, errorWorkflow: "gridnodes-global-error-handler" },
  tags: [{ name: "gridnodes" }, { name: "sales" }, { name: "ai" }],
});

/* -------------------------------------------------------------------------- */
/* 2. Automated Stripe Reconciliation to Slack                                */
/* -------------------------------------------------------------------------- */

const stripeReconJson = toN8nJson({
  name: "Automated Stripe Reconciliation to Slack",
  nodes: [
    {
      parameters: { rule: { interval: [{ field: "cronExpression", expression: "0 6 * * 1-5" }] } },
      id: "b2e1d2c3-0001-4c9f-8b02-recon0000001",
      name: "Weekdays 06:00 UTC",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [240, 300],
    },
    {
      parameters: {
        url: "https://api.stripe.com/v1/balance_transactions",
        authentication: "predefinedCredentialType",
        nodeCredentialType: "stripeApi",
        sendQuery: true,
        queryParameters: {
          parameters: [
            { name: "created[gte]", value: "={{ Math.floor($now.minus({ days: 1 }).startOf('day').toSeconds()) }}" },
            { name: "created[lt]", value: "={{ Math.floor($now.startOf('day').toSeconds()) }}" },
            { name: "limit", value: "100" },
          ],
        },
        options: {
          pagination: {
            pagination: {
              parameters: { parameters: [{ name: "starting_after", value: "={{ $response.body.data.at(-1).id }}" }] },
              paginationCompleteWhen: "other",
              completeExpression: "={{ !$response.body.has_more }}",
            },
          },
        },
      },
      id: "b2e1d2c3-0002-4c9f-8b02-recon0000002",
      name: "Fetch Stripe Balance Txns",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [460, 220],
    },
    {
      parameters: {
        operation: "executeQuery",
        query:
          "SELECT invoice_id, stripe_charge_id, amount_cents, currency, status\nFROM ledger.invoices\nWHERE paid_at >= CURRENT_DATE - INTERVAL '1 day'\n  AND paid_at < CURRENT_DATE;",
        options: {},
      },
      id: "b2e1d2c3-0003-4c9f-8b02-recon0000003",
      name: "Fetch Ledger Invoices",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [460, 400],
    },
    {
      parameters: {
        mode: "runOnceForAllItems",
        jsCode:
          "const stripe = $('Fetch Stripe Balance Txns').all().flatMap(i => i.json.data ?? []);\nconst ledger = $('Fetch Ledger Invoices').all().map(i => i.json);\nconst byCharge = new Map(ledger.map(r => [r.stripe_charge_id, r]));\n\nconst matched = [], mismatched = [], missingInLedger = [];\nfor (const tx of stripe.filter(t => t.type === 'charge')) {\n  const row = byCharge.get(tx.source);\n  if (!row) { missingInLedger.push(tx); continue; }\n  byCharge.delete(tx.source);\n  (row.amount_cents === tx.amount ? matched : mismatched).push({ tx, row, delta: tx.amount - row.amount_cents });\n}\nconst missingInStripe = [...byCharge.values()];\nconst fees = stripe.reduce((s, t) => s + (t.fee ?? 0), 0);\n\nreturn [{ json: {\n  date: $now.minus({ days: 1 }).toISODate(),\n  matched: matched.length,\n  mismatched, missingInLedger, missingInStripe,\n  grossCents: stripe.reduce((s, t) => s + t.amount, 0),\n  feeCents: fees,\n  clean: !mismatched.length && !missingInLedger.length && !missingInStripe.length,\n} }];",
      },
      id: "b2e1d2c3-0004-4c9f-8b02-recon0000004",
      name: "Reconcile (Code)",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [700, 300],
    },
    {
      parameters: {
        conditions: {
          conditions: [{ leftValue: "={{ $json.clean }}", rightValue: true, operator: { type: "boolean", operation: "true" } }],
        },
      },
      id: "b2e1d2c3-0005-4c9f-8b02-recon0000005",
      name: "All Matched?",
      type: "n8n-nodes-base.if",
      typeVersion: 2.2,
      position: [920, 300],
    },
    {
      parameters: {
        select: "channel",
        channelId: { __rl: true, value: "#finance-ops", mode: "name" },
        text: "=:white_check_mark: Stripe recon {{ $json.date }} — {{ $json.matched }} charges matched. Gross ${{ ($json.grossCents / 100).toFixed(2) }}, fees ${{ ($json.feeCents / 100).toFixed(2) }}.",
        otherOptions: {},
      },
      id: "b2e1d2c3-0006-4c9f-8b02-recon0000006",
      name: "Post Clean Summary",
      type: "n8n-nodes-base.slack",
      typeVersion: 2.3,
      position: [1140, 200],
    },
    {
      parameters: {
        operation: "append",
        documentId: { __rl: true, value: "RECON_EXCEPTIONS_SHEET_ID", mode: "id" },
        sheetName: { __rl: true, value: "Exceptions", mode: "name" },
        columns: {
          mappingMode: "defineBelow",
          value: {
            date: "={{ $json.date }}",
            mismatched: "={{ $json.mismatched.length }}",
            missing_in_ledger: "={{ $json.missingInLedger.length }}",
            missing_in_stripe: "={{ $json.missingInStripe.length }}",
            payload: "={{ JSON.stringify($json) }}",
          },
        },
        options: {},
      },
      id: "b2e1d2c3-0007-4c9f-8b02-recon0000007",
      name: "Log Exceptions (Sheets)",
      type: "n8n-nodes-base.googleSheets",
      typeVersion: 4.5,
      position: [1140, 400],
    },
    {
      parameters: {
        select: "channel",
        channelId: { __rl: true, value: "#finance-ops", mode: "name" },
        text: "=:rotating_light: Stripe recon {{ $('Reconcile (Code)').item.json.date }} needs review: {{ $('Reconcile (Code)').item.json.mismatched.length }} amount mismatches, {{ $('Reconcile (Code)').item.json.missingInLedger.length }} missing in ledger, {{ $('Reconcile (Code)').item.json.missingInStripe.length }} missing in Stripe.",
        otherOptions: {},
      },
      id: "b2e1d2c3-0008-4c9f-8b02-recon0000008",
      name: "Alert Exceptions",
      type: "n8n-nodes-base.slack",
      typeVersion: 2.3,
      position: [1360, 400],
    },
  ],
  connections: {
    "Weekdays 06:00 UTC": {
      main: [
        [
          { node: "Fetch Stripe Balance Txns", type: "main", index: 0 },
          { node: "Fetch Ledger Invoices", type: "main", index: 0 },
        ],
      ],
    },
    "Fetch Stripe Balance Txns": { main: [[{ node: "Reconcile (Code)", type: "main", index: 0 }]] },
    "Fetch Ledger Invoices": { main: [[{ node: "Reconcile (Code)", type: "main", index: 0 }]] },
    "Reconcile (Code)": { main: [[{ node: "All Matched?", type: "main", index: 0 }]] },
    "All Matched?": {
      main: [
        [{ node: "Post Clean Summary", type: "main", index: 0 }],
        [{ node: "Log Exceptions (Sheets)", type: "main", index: 0 }],
      ],
    },
    "Log Exceptions (Sheets)": { main: [[{ node: "Alert Exceptions", type: "main", index: 0 }]] },
  },
  settings: { executionOrder: "v1", timezone: "UTC", errorWorkflow: "gridnodes-global-error-handler" },
  tags: [{ name: "gridnodes" }, { name: "finance" }],
});

/* -------------------------------------------------------------------------- */
/* 3. Multi-Channel Content Repurposer                                        */
/* -------------------------------------------------------------------------- */

const contentRepurposerJson = toN8nJson({
  name: "Multi-Channel Content Repurposer",
  nodes: [
    {
      parameters: {
        pollTimes: { item: [{ mode: "everyX", value: 15, unit: "minutes" }] },
        databaseId: { __rl: true, value: "CONTENT_CALENDAR_DB_ID", mode: "id" },
        event: "pagedUpdatedInDatabase",
        simple: true,
        filters: { conditions: [{ key: "Status|status", condition: "equals", statusValue: "Ready to Repurpose" }] },
      },
      id: "c3d2e3f4-0001-4dae-9c03-content00001",
      name: "Notion: Ready to Repurpose",
      type: "n8n-nodes-base.notionTrigger",
      typeVersion: 1,
      position: [240, 300],
    },
    {
      parameters: { url: "={{ $json.property_source_url }}", options: { response: { response: { responseFormat: "text" } } } },
      id: "c3d2e3f4-0002-4dae-9c03-content00002",
      name: "Fetch Source Article",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [460, 300],
    },
    {
      parameters: { html: "={{ $json.data }}", options: { ignore: "nav,footer,aside,script,style" } },
      id: "c3d2e3f4-0003-4dae-9c03-content00003",
      name: "HTML to Markdown",
      type: "n8n-nodes-base.markdown",
      typeVersion: 1,
      position: [680, 300],
    },
    {
      parameters: {
        modelId: { __rl: true, value: "gpt-4o", mode: "list" },
        messages: {
          values: [
            {
              role: "system",
              content:
                "You are a senior B2B content strategist. Using the brand voice guide (confident, concrete, no hype), repurpose the article. Return JSON: {\"linkedin\": string (<=1300 chars, hook first line), \"x_thread\": string[] (5-7 posts, <=270 chars each), \"newsletter\": {\"subject\": string, \"preview\": string, \"body_md\": string}}.",
            },
            { content: "=Article (markdown):\n\n{{ $json.markdown }}" },
          ],
        },
        jsonOutput: true,
        options: { temperature: 0.6, maxTokens: 3000 },
      },
      id: "c3d2e3f4-0004-4dae-9c03-content00004",
      name: "Generate Variants (OpenAI)",
      type: "@n8n/n8n-nodes-langchain.openAi",
      typeVersion: 1.8,
      position: [900, 300],
    },
    {
      parameters: {
        mode: "runOnceForEachItem",
        jsCode:
          "const out = $json.message.content;\nconst issues = [];\nif (out.linkedin.length > 1300) issues.push('LinkedIn post exceeds 1300 chars');\nout.x_thread.forEach((p, i) => { if (p.length > 270) issues.push(`X post ${i + 1} exceeds 270 chars`); });\nconst banned = ['revolutionary', 'game-changer', 'synergy'];\nconst blob = JSON.stringify(out).toLowerCase();\nbanned.forEach(w => blob.includes(w) && issues.push(`Banned word: ${w}`));\nreturn { json: { ...out, issues, passed: issues.length === 0 } };",
      },
      id: "c3d2e3f4-0005-4dae-9c03-content00005",
      name: "Brand & Length Guardrails",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1120, 300],
    },
    {
      parameters: {
        resource: "databasePage",
        operation: "update",
        pageId: { __rl: true, value: "={{ $('Notion: Ready to Repurpose').item.json.id }}", mode: "id" },
        propertiesUi: {
          propertyValues: [
            { key: "Status|status", statusValue: "={{ $json.passed ? 'In Review' : 'Needs Edit' }}" },
            { key: "LinkedIn Draft|rich_text", textContent: "={{ $json.linkedin }}" },
            { key: "X Thread Draft|rich_text", textContent: "={{ $json.x_thread.join('\\n\\n---\\n\\n') }}" },
            { key: "Newsletter Subject|rich_text", textContent: "={{ $json.newsletter.subject }}" },
            { key: "Guardrail Issues|rich_text", textContent: "={{ $json.issues.join('; ') || 'None' }}" },
          ],
        },
      },
      id: "c3d2e3f4-0006-4dae-9c03-content00006",
      name: "Write Drafts to Notion",
      type: "n8n-nodes-base.notion",
      typeVersion: 2.2,
      position: [1340, 300],
    },
    {
      parameters: {
        select: "channel",
        channelId: { __rl: true, value: "#content-review", mode: "name" },
        text: "=:memo: Drafts ready for *{{ $('Notion: Ready to Repurpose').item.json.name }}* — status: {{ $('Brand & Length Guardrails').item.json.passed ? 'In Review' : 'Needs Edit' }}\n{{ $('Notion: Ready to Repurpose').item.json.url }}",
        otherOptions: {},
      },
      id: "c3d2e3f4-0007-4dae-9c03-content00007",
      name: "Notify #content-review",
      type: "n8n-nodes-base.slack",
      typeVersion: 2.3,
      position: [1560, 300],
    },
  ],
  connections: {
    "Notion: Ready to Repurpose": { main: [[{ node: "Fetch Source Article", type: "main", index: 0 }]] },
    "Fetch Source Article": { main: [[{ node: "HTML to Markdown", type: "main", index: 0 }]] },
    "HTML to Markdown": { main: [[{ node: "Generate Variants (OpenAI)", type: "main", index: 0 }]] },
    "Generate Variants (OpenAI)": { main: [[{ node: "Brand & Length Guardrails", type: "main", index: 0 }]] },
    "Brand & Length Guardrails": { main: [[{ node: "Write Drafts to Notion", type: "main", index: 0 }]] },
    "Write Drafts to Notion": { main: [[{ node: "Notify #content-review", type: "main", index: 0 }]] },
  },
  settings: { executionOrder: "v1", errorWorkflow: "gridnodes-global-error-handler" },
  tags: [{ name: "gridnodes" }, { name: "marketing" }, { name: "ai" }],
});

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */

export const workflowsData: Workflow[] = [
  {
    slug: "ai-lead-scoring-crm-router",
    title: "AI Lead Scoring & CRM Router",
    tagline: "Qualify every inbound lead in under 10 seconds — and route it to the right rep.",
    description:
      "Captures inbound form submissions, enriches them with firmographic data, scores fit against your ICP with an LLM, and routes leads into HubSpot lifecycle stages. Hot leads trigger an instant Slack alert so reps respond while intent is highest.",
    department: "Sales",
    complexity: "Advanced",
    integrations: ["HubSpot", "OpenAI", "Slack", "Clearbit"],
    tags: ["Lead Qualification", "AI Scoring", "CRM Hygiene", "Speed-to-Lead"],
    nodes: [
      {
        id: "n1",
        name: "Inbound Lead Webhook",
        type: "n8n-nodes-base.webhook",
        kind: "trigger",
        summary: "Receives form submissions from your website, landing pages or ad platforms via a secured POST endpoint.",
        detail: "Uses responseMode=responseNode so the caller gets a deterministic acknowledgement only after routing completes.",
      },
      {
        id: "n2",
        name: "Enrich Company (Clearbit)",
        type: "n8n-nodes-base.httpRequest",
        kind: "action",
        summary: "Looks up company size, industry, funding and geography from the lead's email domain.",
        detail: "continueOnFail is enabled so a missing enrichment record degrades gracefully instead of dropping the lead.",
      },
      {
        id: "n3",
        name: "Score Lead (OpenAI)",
        type: "@n8n/n8n-nodes-langchain.openAi",
        kind: "ai",
        summary: "An LLM scores the lead 0–100 against your ideal customer profile and explains its reasoning.",
        detail: "Strict JSON output at temperature 0.1 for reproducible scores; reasoning is persisted to HubSpot for rep context.",
      },
      {
        id: "n4",
        name: "Route by Tier",
        type: "n8n-nodes-base.switch",
        kind: "logic",
        summary: "Splits leads into Hot, Warm and Cold paths based on the AI-assigned tier.",
      },
      {
        id: "n5",
        name: "Upsert HubSpot (SQL / MQL)",
        type: "n8n-nodes-base.hubspot",
        kind: "action",
        summary: "Creates or updates the contact with the correct lifecycle stage, score and reasoning — no duplicates.",
      },
      {
        id: "n6",
        name: "Alert #sales-hot-leads",
        type: "n8n-nodes-base.slack",
        kind: "output",
        summary: "Pings the sales channel with the lead's name, company and score the moment a hot lead lands.",
      },
      {
        id: "n7",
        name: "Respond 200",
        type: "n8n-nodes-base.respondToWebhook",
        kind: "output",
        summary: "Returns a structured acknowledgement (including tier) to the calling form or system.",
      },
    ],
    roi: {
      headline: "Speed-to-lead cut from 4 hours to 9 seconds",
      metrics: [
        { label: "Rep hours saved", value: "62 hrs", context: "per month" },
        { label: "Speed-to-lead", value: "9 sec", context: "down from ~4 hrs" },
        { label: "SQL conversion lift", value: "+31%", context: "first 90 days" },
        { label: "Run cost per lead", value: "$0.004", context: "LLM + enrichment" },
      ],
      narrative:
        "SDRs previously triaged a shared inbox twice daily, so high-intent leads waited hours. Automated scoring and routing means reps only touch qualified opportunities, and every lead is handled consistently against the same ICP rubric.",
    },
    specs: {
      trigger: "Webhook (POST, header-auth)",
      avgExecutionTime: "6–9 s",
      throughput: "~1,200 leads/hour per worker",
      errorHandling: "Global error workflow + continueOnFail on enrichment; failed runs retried 3× with backoff",
      hosting: "n8n self-hosted (queue mode, Redis + Postgres)",
      credentials: ["HubSpot Private App", "OpenAI API", "Slack Bot OAuth", "Clearbit API (Header Auth)"],
      n8nVersion: "≥ 1.60",
    },
    n8nJson: aiLeadScoringJson,
  },
  {
    slug: "stripe-reconciliation-slack",
    title: "Automated Stripe Reconciliation to Slack",
    tagline: "Daily ledger-to-Stripe matching with exceptions surfaced before finance logs on.",
    description:
      "Every weekday morning, pulls the previous day's Stripe balance transactions and your internal invoice ledger in parallel, reconciles them charge-by-charge, and posts a clean summary — or a precise exception report — to Slack, with discrepancies logged to Google Sheets for audit.",
    department: "Finance",
    complexity: "Advanced",
    integrations: ["Stripe", "Postgres", "Slack", "Google Sheets"],
    tags: ["Reconciliation", "Month-End Close", "Audit Trail", "Scheduled"],
    nodes: [
      {
        id: "n1",
        name: "Weekdays 06:00 UTC",
        type: "n8n-nodes-base.scheduleTrigger",
        kind: "trigger",
        summary: "Runs automatically every weekday morning before the finance team starts work.",
      },
      {
        id: "n2",
        name: "Fetch Stripe Balance Txns",
        type: "n8n-nodes-base.httpRequest",
        kind: "action",
        summary: "Pulls all of yesterday's Stripe balance transactions, following pagination until complete.",
        detail: "Cursor-based pagination via starting_after; stops when has_more is false.",
      },
      {
        id: "n3",
        name: "Fetch Ledger Invoices",
        type: "n8n-nodes-base.postgres",
        kind: "action",
        summary: "Queries the internal ledger for invoices marked paid in the same window — in parallel with Stripe.",
      },
      {
        id: "n4",
        name: "Reconcile (Code)",
        type: "n8n-nodes-base.code",
        kind: "logic",
        summary: "Matches each Stripe charge to its ledger row and flags amount mismatches and missing records on either side.",
        detail: "O(n) hash-map join on stripe_charge_id; also totals gross volume and processing fees.",
      },
      {
        id: "n5",
        name: "All Matched?",
        type: "n8n-nodes-base.if",
        kind: "logic",
        summary: "Branches on whether the day reconciled cleanly.",
      },
      {
        id: "n6",
        name: "Log Exceptions (Sheets)",
        type: "n8n-nodes-base.googleSheets",
        kind: "action",
        summary: "Appends every discrepancy with its full payload to an audit sheet for review and sign-off.",
      },
      {
        id: "n7",
        name: "Slack Summary / Alert",
        type: "n8n-nodes-base.slack",
        kind: "output",
        summary: "Posts a green summary on clean days, or an itemised alert with counts by exception type.",
      },
    ],
    roi: {
      headline: "Daily close reconciliation went from 2 hours to zero-touch",
      metrics: [
        { label: "Analyst hours saved", value: "40 hrs", context: "per month" },
        { label: "Detection lag", value: "< 24 hrs", context: "down from month-end" },
        { label: "Transactions matched", value: "180k+", context: "per month" },
        { label: "Close cycle", value: "−3 days", context: "faster month-end" },
      ],
      narrative:
        "Discrepancies used to surface at month-end, when they were costly to trace. Daily automated matching catches failed webhooks, partial refunds and duplicate charges within a day, giving finance a continuous audit trail and a faster, calmer close.",
    },
    specs: {
      trigger: "Schedule (cron 0 6 * * 1-5, UTC)",
      avgExecutionTime: "20–45 s (volume dependent)",
      throughput: "Tested to 25k transactions/run",
      errorHandling: "Global error workflow pages on-call; HTTP node retries 3× on 429/5xx",
      hosting: "n8n Cloud or self-hosted",
      credentials: ["Stripe API (restricted, read-only)", "Postgres (read replica)", "Slack Bot OAuth", "Google Sheets OAuth2"],
      n8nVersion: "≥ 1.50",
    },
    n8nJson: stripeReconJson,
  },
  {
    slug: "multi-channel-content-repurposer",
    title: "Multi-Channel Content Repurposer",
    tagline: "Turn one long-form article into on-brand LinkedIn, X and newsletter drafts.",
    description:
      "Watches your Notion content calendar for articles marked ready, extracts clean text from the source URL, and uses an LLM to produce channel-native variants. Built-in guardrails enforce length limits and banned vocabulary before drafts are written back to Notion for human review.",
    department: "Marketing",
    complexity: "Basic",
    integrations: ["Notion", "OpenAI", "Slack", "LinkedIn"],
    tags: ["Content Ops", "Generative AI", "Human-in-the-Loop", "Brand Guardrails"],
    nodes: [
      {
        id: "n1",
        name: "Notion: Ready to Repurpose",
        type: "n8n-nodes-base.notionTrigger",
        kind: "trigger",
        summary: "Polls the content calendar every 15 minutes for items moved to 'Ready to Repurpose'.",
      },
      {
        id: "n2",
        name: "Fetch Source Article",
        type: "n8n-nodes-base.httpRequest",
        kind: "action",
        summary: "Downloads the published article from its canonical URL.",
      },
      {
        id: "n3",
        name: "HTML to Markdown",
        type: "n8n-nodes-base.markdown",
        kind: "action",
        summary: "Strips navigation, scripts and chrome, leaving clean Markdown for the model.",
      },
      {
        id: "n4",
        name: "Generate Variants (OpenAI)",
        type: "@n8n/n8n-nodes-langchain.openAi",
        kind: "ai",
        summary: "Produces a LinkedIn post, an X thread and a newsletter section in one structured call.",
        detail: "System prompt embeds the brand voice guide; JSON mode guarantees a parseable response.",
      },
      {
        id: "n5",
        name: "Brand & Length Guardrails",
        type: "n8n-nodes-base.code",
        kind: "logic",
        summary: "Validates platform character limits and blocks banned buzzwords before anything reaches a human.",
      },
      {
        id: "n6",
        name: "Write Drafts to Notion",
        type: "n8n-nodes-base.notion",
        kind: "action",
        summary: "Writes every draft back to the calendar entry and sets status to 'In Review' or 'Needs Edit'.",
      },
      {
        id: "n7",
        name: "Notify #content-review",
        type: "n8n-nodes-base.slack",
        kind: "output",
        summary: "Lets the editor know drafts are ready, with a direct link to the Notion page.",
      },
    ],
    roi: {
      headline: "4× more distribution from every piece of content",
      metrics: [
        { label: "Writer hours saved", value: "28 hrs", context: "per month" },
        { label: "Assets per article", value: "9", context: "up from 2" },
        { label: "Draft turnaround", value: "< 2 min", context: "down from 1–2 days" },
        { label: "Edit rate", value: "18%", context: "drafts needing rewrite" },
      ],
      narrative:
        "Long-form content was published once and rarely redistributed. Automated, guardrailed drafts let the team ship consistent multi-channel campaigns for every article, while keeping a human editor firmly in the loop.",
    },
    specs: {
      trigger: "Notion database poll (15 min)",
      avgExecutionTime: "25–40 s",
      throughput: "~90 articles/hour (LLM rate-limited)",
      errorHandling: "Guardrail failures route to 'Needs Edit' rather than erroring; global error workflow for API faults",
      hosting: "n8n Cloud or self-hosted",
      credentials: ["Notion Integration Token", "OpenAI API", "Slack Bot OAuth"],
      n8nVersion: "≥ 1.60",
    },
    n8nJson: contentRepurposerJson,
  },
];

/** Portfolio-wide metrics shown in the hero ribbon. */
export const globalMetrics = [
  { label: "Hours Saved / Month", value: 4200, suffix: "+" },
  { label: "Data Rows Processed", value: 38, suffix: "M+" },
  { label: "Workflows in Production", value: 120, suffix: "+" },
  { label: "Avg. Uptime", value: 99.9, suffix: "%", decimals: 1 },
] as const;
