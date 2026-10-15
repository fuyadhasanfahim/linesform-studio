# Linesform Studio

Website for **Linesform Studio**, a fictional architecture and interior design practice created by Midline Seven as a portfolio concept. All projects, sites and images are conceptual.

Built with Next.js 16 (App Router, Cache Components, React Compiler), React 19, Tailwind CSS 4 and Motion (Framer Motion).

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in what you need
pnpm dev                     # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm typecheck` | Route type generation + `tsc --noEmit` (includes the scripts) |
| `pnpm lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `pnpm assets:plan` | Lists every planned image with its estimated cost. No API calls. |
| `pnpm assets:verify` | Free metadata call confirming `IMAGE_GEN_MODEL_NAME` exists |
| `pnpm assets:generate --ids a,b --confirm` | **Paid.** Generates exactly the listed images |
| `pnpm video:plan` | Prints the optional hero-video plan. No API calls. |

## Structure

```
src/
  app/                  Routes: / · /work · /work/[slug] · /privacy · sitemap, robots, OG images
  proxy.ts              Returns a real 404 for unknown /work/<slug> URLs before rendering
  components/
    home/               Homepage sections (hero, selected work, studio, approach, materials, contact)
    work/ project/      Project cards, index with hover preview, gallery, next-project link
    layout/             Header (hide on scroll), native-<dialog> mobile menu, footer
    motion/             Reveal, ImageReveal, Parallax and the LazyMotion provider
    media/              AssetImage: next/image from the manifest, labelled placeholder until generated
  content/              Typed content: site config, projects, studio copy, asset manifest
  lib/enquiry/          Shared validation, server action, webhook delivery
  lib/ai/               Server-side Gemini provider layer (used only by scripts/)
scripts/                Approval-gated image and video generation CLIs
assets/fonts/           OFL-licensed TTFs used to render Open Graph images at build time
```

## Design system

Tokens live in `src/app/globals.css` as Tailwind `@theme` variables. Tailwind's default palette is removed, so only the approved colours exist as utilities.

| Token | Value | Use |
| --- | --- | --- |
| `limestone` | `#F3F0E9` | Primary background |
| `charcoal` | `#252722` | Text, dark sections, footer (13.3:1 on limestone) |
| `stone` | `#B7A58B` | Dividers and surfaces on light; secondary text on charcoal (6.3:1) |
| `olive` | `#747969` | Large text, borders, decorative (3.9:1 — not for small text on limestone) |
| `olive-ink` | `#5C6154` | Olive Grey deepened for small text on light surfaces (5.6:1) |
| `limestone-deep` | `#E9E4DA` | Tonal section background derived from limestone and stone |

Typography: Cormorant Garamond (display) and Manrope (text) through `next/font`, self-hosted. Type scale utilities: `t-display`, `t-h1`–`t-h3`, `t-quote`, `t-lead`, `t-body`, `t-small`, `t-label`. Layout: `shell` (max width + margins) and `grid-page` (12 columns with a fluid gutter).

Motion principles: transform and opacity only; reveals run once; the hero entrance is CSS so it needs no JavaScript; parallax and the cursor-following preview run only on large screens with a fine pointer; `prefers-reduced-motion` removes movement; `<noscript>` CSS keeps all content visible without JavaScript. Project images morph between the index and detail pages with React `<ViewTransition>`.

## Enquiry form

The form validates on the client for fast feedback and again in a server action. It works without JavaScript.

**Delivery is off until you configure it.** Without configuration the form tells visitors their enquiry has *not* been sent; it never shows a success message unless delivery actually succeeded.

To connect it, set in the deployment environment:

- `ENQUIRY_WEBHOOK_URL` — an `https` endpoint that accepts a JSON `POST`. Any 2xx response counts as delivered; anything else (or a 10 s timeout) is reported to the visitor as a failure.
- `ENQUIRY_WEBHOOK_SECRET` *(optional)* — sent as `Authorization: Bearer <secret>`.

Payload:

```json
{ "type": "project-enquiry", "source": "linesformstudio.com", "submittedAt": "ISO-8601",
  "name": "…", "email": "…", "projectType": "…", "budget": "…", "message": "…" }
```

Suitable receivers include a small serverless function that sends email through a provider such as Resend or Postmark, or an automation webhook (Zapier, Make, n8n). Message contents are never written to server logs. Spam protection is a honeypot field; add rate limiting at the edge or in the receiver before launch.

## Image generation (Google Gemini — Nano Banana)

`src/content/asset-manifest.json` is the source of truth for every image: file path, section, purpose, alt text, aspect ratio, size, prompt, batch, status and cost estimate. After generation it also records the model, date, exact prompt sent, pixel size, token usage and estimated cost.

- Model: `gemini-nano-banana-2.1` (verified on 2026-10-15 with `models.get`: "Nano Banana 2.1", supports `generateContent`).
- Endpoint: `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` with `responseModalities: ["IMAGE"]` and `imageConfig: { aspectRatio, imageSize }`.
- The key is sent in the `x-goog-api-key` header and is read only by the Node scripts. There is **no generation endpoint on the website**, so visitors cannot trigger paid requests.
- Safeguards: paid runs need `--confirm` and an explicit `--ids`/`--batch`; generated images are skipped unless `--force`; at most 20 per run; a lock file prevents concurrent runs; no automatic retries; failures are recorded and the run continues.
- Output: optimised JPEG in `public/images/…` plus a blur placeholder. Originals are kept locally in `.generated-originals/` (git-ignored) so they can be re-processed without regenerating.

Until an image is generated, `AssetImage` renders a clearly labelled placeholder at the final aspect ratio, so the layout never shifts. After generating, review each image and adjust its `alt` text in the manifest to match what was actually produced.

## Optional hero video (Gemini Omni)

The plan is stored under `video` in the manifest and is **not recommended for launch**: the static hero is the LCP element and a video adds weight for a modest gain. If approved, `pnpm video:start --confirm` starts one background job via the Interactions API and records its id; `pnpm video:poll` resumes it (it never starts a second job). This path follows the official `@google/genai` SDK types but has not yet been exercised against the live API.

## Secrets

- `.env*` files are git-ignored (except `.env.example`, which holds names only).
- Never use `NEXT_PUBLIC_` for keys. Store production values in the hosting provider's environment settings.
- If a key has ever been pasted into a chat, log or commit, rotate it.

## SEO

Per-page metadata and canonical URLs, Open Graph and Twitter cards (generated at build time with brand typography; they use the hero photograph once it exists), `sitemap.xml`, `robots.txt`, `WebSite` and `BreadcrumbList` JSON-LD. `SITE_URL` sets the production origin (defaults to `https://linesformstudio.com`). No organisation, review or award markup is emitted, because the practice is fictional.
