# GridNodes

Website for GridNodes: **n8n** workflow automation for Irish small businesses, built by Prince Tony in Dublin.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide React · Inter Tight + DM Sans + JetBrains Mono

Personal details, the contact-form endpoint and feature switches all live in `src/lib/site.ts`.

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

GitHub Pages can't process forms, so the contact form posts to a **Google Apps Script web app**, set as `enquiryEndpoint` in `src/lib/site.ts`.

The form sends `name`, `email`, `message`, `source` and `_gotcha` (honeypot) as a JSON string with `Content-Type: text/plain;charset=utf-8`, which keeps it a simple CORS request that Apps Script accepts. The script must reply with JSON containing `"ok": true`; anything else shows an error with a pre-filled `mailto:` fallback. If `enquiryEndpoint` is empty, the form validates input and then offers the `mailto:` link instead of sending.

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
- **Case study figures:** fill in `caseStudyResultTime` in `src/data/caseStudyData.ts` with measured before/after times. The time panel only appears when both are set.
- **Case study diagrams:** `src/data/caseStudyData.ts` holds anonymised layouts of the three real workflows (positions and connections from the n8n exports, generic labels). Never paste raw exports in: they contain credentials, customer sites, prices and data fields.

## Security, privacy and running the site

What's in place:

- **Content Security Policy** (`src/app/layout.tsx`, moved to the top of every page by `scripts/hoist-csp.mjs` after each build). Only this site, the Apps Script endpoint (`script.google.com` → `script.googleusercontent.com`) and the three demo-video hosts are allowed. Add any new third-party service here or it will be blocked.
- **No cookies, analytics or third-party scripts**; fonts are self-hosted. A privacy notice lives at `/privacy` (retention period in `siteConfig.privacy`).
- **Contact form**: honeypot field, a minimum fill time (instant submissions are dropped), length limits, a 15-second timeout, and an email fallback if sending fails.
- **Deploy gate**: the GitHub Action runs lint, type-check and `npm audit` (high severity) before building, so a broken or vulnerable change can't go live. Dependabot (`.github/dependabot.yml`) opens a grouped update PR monthly.
- **SEO**: canonical URLs, `sitemap.xml`, structured data (ProfessionalService), Open Graph images, and `noindex` on `/demos` while it's switched off.
- **Accessibility**: checked against WCAG 2.1 AA with axe; works without JavaScript.

### Hardening the Apps Script

The site already filters bots, but anyone can call the script URL directly, so the script should validate too. Recommended `doPost`:

```js
const MAX = { name: 100, email: 254, message: 3000, source: 200 };

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data._gotcha) return json({ ok: true }); // bot: pretend success, store nothing

    // Trim, cap length, and stop spreadsheet formula injection (=, +, -, @).
    const clean = (k) => {
      const v = String(data[k] || "").trim().slice(0, MAX[k]);
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    };
    const name = clean("name"), email = clean("email"), message = clean("message"), source = clean("source");
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
      return json({ ok: false, error: "invalid" });
    }

    // Basic rate limit: at most 10 enquiries per 10 minutes.
    const cache = CacheService.getScriptCache();
    const count = Number(cache.get("recent") || 0);
    if (count >= 10) return json({ ok: false, error: "busy" });
    cache.put("recent", String(count + 1), 600);

    // ...append to your sheet and/or email yourself here (treat every field as plain text)...
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: "bad request" });
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
```

### GitHub Pages settings

- **Settings → Pages → Source: GitHub Actions.** While it's set to "Deploy from a branch", every push also triggers a README-only deploy that races the real one.
- Keep **Enforce HTTPS** on.
- `robots.txt` only takes effect at a domain root. With a custom domain, set `SITE_URL` (and drop `BASE_PATH`) in the deploy workflow; until then, submit `https://prince-tony-7.github.io/Gridnodes101/sitemap.xml` in Google Search Console.

## Structure

```
src/
├─ app/
│  ├─ page.tsx               Home: hero, tools, services, case study, examples, process, about
│  ├─ showroom/page.tsx      Example workflows, filterable (deep links: ?workflow=<slug>)
│  ├─ about/page.tsx         About Prince Tony
│  ├─ case-study/page.tsx    Case study with anonymised workflow canvases
│  ├─ privacy/page.tsx       Privacy notice
│  ├─ sitemap.ts, robots.ts, manifest.ts   SEO + app metadata
│  ├─ demos/page.tsx         Demo videos (behind features.demos)
│  ├─ contact/page.tsx       Contact form (Apps Script + mailto fallback)
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
