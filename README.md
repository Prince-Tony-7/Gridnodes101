# GridNodes

Portfolio site showcasing production-ready **n8n** automation workflows for enterprise clients.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide React · Bricolage Grotesque + DM Sans + JetBrains Mono

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run preview    # serve ./out locally
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Deploying to GitHub Pages

The site is a fully static export (`output: "export"`), deployed by
`.github/workflows/deploy-pages.yml` on every push to the repository's default branch.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The site is then published at `https://<owner>.github.io/<repo>/`.

## Contact form

GitHub Pages can't run server code, so the discovery form posts directly to an
**n8n Webhook node**. Add a repository variable (**Settings → Secrets and variables →
Actions → Variables**) named `INTAKE_WEBHOOK_URL` with your webhook's production URL,
and allow the site's origin in the Webhook node's CORS ("Allowed Origins") option.
Without it, the form shows a "not connected yet" message instead of submitting.
For local dev, set `NEXT_PUBLIC_INTAKE_WEBHOOK_URL` in `.env.local`.

## Structure

```
src/
├─ app/
│  ├─ page.tsx               Home: hero, metrics ribbon, featured workflows
│  ├─ showroom/page.tsx      Searchable / filterable gallery (deep links: ?workflow=<slug>)
│  ├─ contact/page.tsx       Enterprise discovery intake
│  └─ globals.css            Design tokens (@theme): paper/ink surfaces, node palette, pop shadows
├─ components/
│  ├─ layout/                Navbar (sticky, glass, active-route pill), Footer
│  ├─ home/                  Hero, HeroGraph (live node graph), IntegrationsMarquee, MetricsRibbon, ValueProps
│  ├─ showroom/              FilterBar, WorkflowCard, ShowroomGallery, WorkflowDetailModal,
│  │                         NodeExplainer, VisualMapPlaceholder, JsonCodePanel
│  ├─ contact/               ContactForm
│  └─ ui/                    Badge, ButtonLink, CodeBlock, Container, Logo, SectionHeading, Tabs
├─ data/workflowsData.ts     Mock database (3 workflows + global metrics)
├─ hooks/                    useWorkflowFilters, useCopyToClipboard
└─ lib/                      types, palette (department/node colours), workflows (repository layer), filters, JSON highlighter, contact schema
```

## Swapping the data source

Components never import `workflowsData.ts` directly; they call the async functions in
`src/lib/workflows.ts` (`getAllWorkflows`, `getWorkflowBySlug`). To move to a CMS or API,
reimplement those functions against the `Workflow` type in `src/lib/types.ts`.
