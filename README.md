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

## Brand

Brand assets live in `public/brand/` (light/dark logo and icon, plus the avatar tile used as the favicon). The palette is defined in `src/app/globals.css`:

| Name | Hex | Token | Used for |
| --- | --- | --- | --- |
| Bog Green | `#0B3D2E` | `ink` | Headings, buttons, logo |
| Deep Green | `#082A20` | `deep` | Dark sections, footer, code panels |
| Ink | `#14201B` | `text` | Body copy |
| Chalk | `#F6F4EE` | `paper` | Page background |
| Signal Orange | `#F26B1D` | `coral` | Lead accent |

`src/app/icon.svg`, `apple-icon.png` and `opengraph-image.png` / `twitter-image.png` are picked up automatically as the favicon, home-screen icon and link-preview image.

## Demo videos

Demo recordings live in `src/data/demosData.ts` and appear on `/demos` and the home page. To publish one, set `source` on its entry:

| Host | `source` value |
| --- | --- |
| YouTube | `{ kind: "youtube", id: "VIDEO_ID" }` (the part after `?v=`) |
| Vimeo | `{ kind: "vimeo", id: "123456789" }` |
| Loom | `{ kind: "loom", id: "SHARE_ID" }` (the part after `/share/`) |
| Video file | `{ kind: "file", src: "/videos/my-demo.mp4" }`, with the file in `public/videos/` |

Add `poster: "/videos/my-demo.jpg"` for a custom thumbnail. Entries without a `source` show a "Recording coming soon" poster. Players load only when a visitor presses play. Prefer YouTube, Vimeo or Loom for anything over a few MB: GitHub limits file sizes and Pages is not built for video streaming.

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
