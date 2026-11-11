# GridNodes

Website for GridNodes: **n8n** workflow automation for Irish small businesses, built by Prince Tony in Dublin.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide React · Inter Tight + DM Sans + JetBrains Mono

Personal details, the Formspree ID and feature switches all live in `src/lib/site.ts`.

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

GitHub Pages can't process forms, so the contact form posts to **Formspree**.

1. Create a free form at [formspree.io](https://formspree.io) using the email address you want enquiries sent to.
2. Copy the form ID (the part after `https://formspree.io/f/`).
3. Replace `FORMSPREE_ID` with it in `src/lib/site.ts` (`formspreeId`).

Until then, the form validates input and then offers a pre-filled `mailto:` link instead of sending.

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

The Demos page and home-page demos section are **switched off** until recordings exist. To switch them on, set `features.demos: true` in `src/lib/site.ts`. That adds "Demos" to the navigation and footer, shows the home-page section, and publishes `/demos`.

Demo recordings live in `src/data/demosData.ts`. To publish one, set `source` on its entry:

| Host | `source` value |
| --- | --- |
| YouTube | `{ kind: "youtube", id: "VIDEO_ID" }` (the part after `?v=`) |
| Vimeo | `{ kind: "vimeo", id: "123456789" }` |
| Loom | `{ kind: "loom", id: "SHARE_ID" }` (the part after `/share/`) |
| Video file | `{ kind: "file", src: "/videos/my-demo.mp4" }`, with the file in `public/videos/` |

Add `poster: "/videos/my-demo.jpg"` for a custom thumbnail. Entries without a `source` show a "Recording coming soon" poster. Players load only when a visitor presses play. Prefer YouTube, Vimeo or Loom for anything over a few MB: GitHub limits file sizes and Pages is not built for video streaming.

## Headshot and case study

- **Headshot:** add your photo as `public/images/prince.jpg`. A neutral placeholder shows until the file exists.
- **Case study figures:** fill in `RESULT_TIME` in `src/components/home/CaseStudy.tsx` with measured before/after times. The time panel only appears when both are set.

## Structure

```
src/
├─ app/
│  ├─ page.tsx               Home: hero, tools, services, case study, examples, process, about
│  ├─ showroom/page.tsx      Example workflows, filterable (deep links: ?workflow=<slug>)
│  ├─ about/page.tsx         About Prince Tony
│  ├─ demos/page.tsx         Demo videos (behind features.demos)
│  ├─ contact/page.tsx       Contact form (Formspree + mailto fallback)
│  └─ globals.css            Design tokens (@theme): paper/ink surfaces, node palette, pop shadows
├─ components/
│  ├─ layout/                Navbar (sticky, glass, active-route pill), Footer
│  ├─ home/                  Hero, HeroGraph (illustration), IntegrationsMarquee (tools strip), Services,
│  │                         CaseStudy, ProcessTimeline, ValueProps, AboutTeaser
│  ├─ about/                 Headshot, ContactLinks
│  ├─ demos/                 DemoTheater, VideoPlayer, DemoPoster
│  ├─ showroom/              FilterBar, WorkflowCard, ShowroomGallery, WorkflowDetailModal,
│  │                         NodeExplainer, VisualMapPlaceholder, JsonCodePanel
│  ├─ contact/               ContactForm
│  └─ ui/                    Badge, ButtonLink, CodeBlock, Container, Logo, SectionHeading, Tabs
├─ data/workflowsData.ts     3 example workflows (templates, not client work)
├─ data/demosData.ts        Demo video entries
├─ hooks/                    useWorkflowFilters, useCopyToClipboard
└─ lib/                      types, palette (department/node colours), workflows (repository layer), filters, JSON highlighter, contact schema
```

## Swapping the data source

Components never import `workflowsData.ts` directly; they call the async functions in
`src/lib/workflows.ts` (`getAllWorkflows`, `getWorkflowBySlug`). To move to a CMS or API,
reimplement those functions against the `Workflow` type in `src/lib/types.ts`.
