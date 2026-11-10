# GridNodes

Portfolio site showcasing production-ready **n8n** automation workflows for enterprise clients.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide React · Geist Sans + JetBrains Mono

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Optional: set `INTAKE_WEBHOOK_URL` (e.g. an n8n webhook) to forward discovery-form submissions.

## Structure

```
src/
├─ app/
│  ├─ page.tsx               Home: hero, metrics ribbon, featured workflows
│  ├─ showroom/page.tsx      Searchable / filterable gallery (deep links: ?workflow=<slug>)
│  ├─ contact/page.tsx       Enterprise discovery intake
│  ├─ api/contact/route.ts   Validates + optionally forwards intake submissions
│  └─ globals.css            Design tokens (@theme) — colours, fonts, radii, shadows
├─ components/
│  ├─ layout/                Navbar (sticky, glass, active-route pill), Footer
│  ├─ home/                  Hero, MetricsRibbon (count-up), ValueProps
│  ├─ showroom/              FilterBar, WorkflowCard, ShowroomGallery, WorkflowDetailModal,
│  │                         NodeExplainer, VisualMapPlaceholder, JsonCodePanel
│  ├─ contact/               ContactForm
│  └─ ui/                    Badge, ButtonLink, CodeBlock, Container, Logo, SectionHeading, Tabs
├─ data/workflowsData.ts     Mock database (3 workflows + global metrics)
├─ hooks/                    useWorkflowFilters, useCopyToClipboard
└─ lib/                      types, workflows (repository layer), filters, JSON highlighter, contact schema
```

## Swapping the data source

Components never import `workflowsData.ts` directly; they call the async functions in
`src/lib/workflows.ts` (`getAllWorkflows`, `getWorkflowBySlug`). To move to a CMS or API,
reimplement those functions against the `Workflow` type in `src/lib/types.ts`.
