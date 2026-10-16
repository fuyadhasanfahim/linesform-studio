# Linesform Studio — qualitative CRO audit

**Date:** 16 October 2026 · **Type:** qualitative conversion audit (no analytics data exists, so no
conversion rate, bounce rate or lead quality is claimed).

## Scope and limitations

| | |
| --- | --- |
| Live deployment | `https://linesformstudio.vercel.app` — Vercel production deployment of commit `cb1b9b2` (`main`). |
| Audited code | Branch `claude/gallant-carson-dzuvhz` at `cb1b9b2`, identical to production. |
| How the live site was inspected | Its HTML, headings and metadata were fetched through Vercel's API (HTTP 200). The sandbox's network policy refuses direct browser connections to `*.vercel.app`, so rendering, scrolling and interaction were measured on a local production build of the same commit at 390×844 and 1440×900. |
| Repository metadata | GitHub lists `https://linesform-studio.vercel.app` as the homepage. That hostname does not resolve; the project's real domain is `linesformstudio.vercel.app` (no hyphen). Fix it in the repository settings. |
| Not available | Analytics (no GTM container on the live site), real enquiries, user research, heat maps. Whether enquiry delivery is configured on Vercel could not be checked (environment variables are not readable with the available access), and no test enquiry was sent to production. |
| Competitor pages | Pages could not be opened directly from this environment; findings below rely on search-engine extracts of the cited pages. |

## First five seconds — answers

1. **What a visitor understands.** On desktop (1440×900) the first screen shows the label
   "Architecture & Interiors", the headline "Architecture drawn from light and material." and a
   "Practice" list (private houses, apartments & interiors, hospitality, cultural pavilions). The
   sentence that says what the studio does and the only CTA sit **below the fold** — the statement
   column is bottom-aligned to the hero image (`hero.tsx`, `justify-end`). On mobile the statement and
   "View selected work" are visible.
2. **Is it clear what the studio does?** Partly: the category is clear (architecture and interiors),
   the offer is not (for whom, what result, what to do next).
3. **A distinctive reason to remember it?** Weak. "Light and material" is a category convention.
   The studio's most distinctive ideas — designing *from the site inward*, renovation as
   *subtraction*, materials sampled on site and judged in their own light — are 4–6 screens down
   (`studio-intro.tsx`, `approach.tsx`) or inside project pages.
4. **Value or philosophy?** Philosophy. The headline describes how the work is made, not what the
   visitor gains.
5. **Primary CTA.** The hero's only action is "View selected work" (browse). The enquiry route above
   the fold is a plain "Contact" link in the desktop nav — styled identically to "Studio" and
   "Approach" — and on mobile it is hidden behind "Menu".
6. **A reason to start an enquiry?** Thin. The contact section says every project "starts with an
   open conversation", but nothing explains what that conversation gives the visitor or what to
   bring. The FAQ (added recently) helps but sits at the very end.
7. **Confidence without unsupported claims?** Honest by design (concept disclosures, legal pages,
   honest form status). Confidence comes only from tone and images; the process is described in
   four abstract steps without saying what the client receives at each.
8. **Project pages.** Better than galleries — each has facts, a concept paragraph, materials and
   spatial notes — but the narrative never states the question the design answers or the
   constraints it worked within, and decisions are not tied to how the place will be used.
9. **Friction.** The form itself is lean (5 fields, 4 required, accessible validation). The
   friction is distance: on mobile the first in-content link to the enquiry is **11.2 screens**
   down and the form is at **12.7 of 15** screens. Each project page offers one enquiry link, at
   ~6.4 screens, after the "Next project" block.
10. **Enough to decide fit?** Project types are visible on desktop and in the FAQ; scale (m²), sites
    and materials are on project pages. Missing: who the studio suits, and what working together
    looks like from enquiry onwards.

### Measured evidence (local production build of `cb1b9b2`)

| Page | Mobile length | First enquiry link | Enquiry links | Desktop above-fold actions |
| --- | --- | --- | --- | --- |
| Home | 15 screens | 11.2 screens | 1 | nav links only |
| /work | 4 screens | 2.7 screens | 1 | nav + project rows |
| Project pages (×4) | 7.5–7.8 screens | 6.3–6.5 screens | 1 each | "Selected work" back link |

Enquiry CTA labels in use: "Contact", "Start an enquiry", "Go to the enquiry form", "Project
enquiry", "Start a project enquiry" — five names for one action.

## Reviewer concerns — verdict

| Concern | Verdict |
| --- | --- |
| No clear conversion strategy | **Largely correct.** The site is built for browsing; the enquiry is never the primary action and is far from every entry point. |
| No verifiable statistics or credibility indicators | **Correct, but by design.** The studio is fictional; statistics would be fabrication. The fix is specificity (scope, constraints, decisions) and process transparency, not numbers. |
| Opening hook not strong enough | **Partly correct.** Visually strong; verbally a philosophy statement, and on desktop the explanatory sentence is below the fold. |
| No memorable moment | **Partly correct.** Quality is high but every section repeats the same label → heading → paragraph → images rhythm. |
| No compelling reason to enquire | **Correct.** Nothing tells a visitor what they gain from making contact or how to prepare. |

## Scores (before)

Weights reflect a high-consideration service: what the studio offers, the path to enquire and
the persuasiveness of the work matter most; visual polish is already high and moves the total
least.

| Category | Weight | Score | What works | What is weak | Evidence | Highest-impact fix |
| --- | --- | --- | --- | --- | --- | --- |
| First-impression strength | 5% | 6 | Calm, confident, well-set type and image | Desktop fold has no explanation or action | Desktop fold screenshot; `hero.tsx` `justify-end` | Bring statement and CTAs into the first screen |
| Hero hook & value proposition | 15% | 4 | Clear category | Philosophy, not value; no audience | H1 "Architecture drawn from light and material." | Say what is designed, how, and the next step |
| Brand differentiation | 10% | 5 | Distinct voice, material focus | Generic headline; distinctive ideas buried | Studio/Approach copy 4–6 screens down | Lead with "from the site inward" |
| Visual design & art direction | 5% | 9 | Consistent system, strong imagery | Uniform section rhythm | 0 axe violations, CLS 0, Lighthouse desktop 100 | One composed moment that breaks the rhythm |
| Project storytelling | 15% | 6 | Facts, materials, spatial notes | No question/constraints/response | Headings: concept, "How it is made" | Case-study structure from existing content |
| Trust & credibility | 10% | 5 | Honest disclosures, legal pages | Process abstract; no "what you receive" | `approach.tsx` steps | Process with outputs; "what happens next" |
| Social proof | 5% | 2 | Illustrative quotes correctly labelled | No genuine proof exists | `testimonials.tsx` | Cannot be fixed honestly without real clients |
| CTA visibility & hierarchy | 10% | 3 | Clear ArrowLink style | Browse-first; 5 labels; enquiry far | CTA inventory above | One primary action, consistent label, placed after decisions |
| Enquiry-form usability | 5% | 8 | Lean, accessible, honest status | No guidance beside it; no context carried | `enquiry-form.tsx` | "What to include"; pre-select from project pages |
| Conversion journey | 10% | 4 | FAQ next to form | Long linear scroll, no bridges, project pages end in "Next project" | Mobile 11.2 screens to first enquiry link | Bridges after work, process and each project |
| Mobile conversion | 10% | 4 | Readable, fast | Enquiry hidden behind Menu; 12.7 screens to form | Mobile fold screenshot | Hero CTA above fold; CTA in menu |

**Weighted CRO readiness: 4.9 / 10** (sum of weight × score).

Separately: **visual quality 9/10**, **UX quality 8/10** (accessibility 0 violations, CLS 0,
honest and accessible form), **CRO readiness ~5/10**, **measured conversion performance: unknown**
— no analytics property is configured.

## Priority-ranked plan

1. **Hero:** value-led headline and statement, "Start a project" as the single primary action,
   "See the work" as secondary, and both visible in the first desktop and mobile screen.
2. **Consistent CTA system:** one label ("Start a project") for the enquiry everywhere; a
   distinct but restrained header CTA; a CTA in the mobile menu.
3. **Project pages as case studies:** *The question → Constraints → The response* from existing
   content; a contextual CTA ("Planning a private residence?") that pre-selects the project type.
4. **Journey bridges:** after the process (the moment of highest understanding) and after the
   work; move illustrative statements next to the decision point.
5. **Attention moment:** a restrained afternoon/dusk light study of the Reading Pavilion (an exact
   same-viewpoint pair already in the repository) — the studio's idea made visible.
6. **Credibility through transparency:** process steps state what the client receives; the
   contact section lists what to include and what happens next, without promising response
   times, fees or availability.
7. **Measurement:** CTA clicks, enquiry-form view and start events, consent-gated and free of
   personal data; an experiment backlog for when traffic exists.

Not recommended: a statistics strip (no truthful numbers exist; "4 concept studies" is not
credibility), counters, urgency devices, pop-ups, or a hero video (the static hero is the LCP
element and the light study conveys the same idea at a fraction of the weight).

## References

Used for patterns only (via search-engine extracts):

- Norm Architects, about page — positions the studio around "well-being and the human experience" rather than style: <https://normcph.com/about/>
- Gregory Phillips Architects, contact page — explains what happens after an enquiry (internal review, personal reply, initial conversation) and welcomes clients whose brief is not yet formed: <https://gregoryphillips.com/us/contact/>
- ABL3 Architects, advice for homeowners — site briefing on requirements, rough budget and timescale, then stages: <https://www.abl3architects.com/advice-for-homeowners/>
- Scenario Architecture, inside the residential architecture process — staged process framed around a clear early brief: <https://scenarioarchitecture.com/advice/inside-the-residential-architecture-process>
- Bower Architecture, The Corner (ArchDaily) — house case study with explicit brief and challenge sections: <https://www.archdaily.com/606766/the-corner-bower-architecture>
- Learn Architecture — case studies should show the brief, process and reasoning, not only renders: <https://learnarchitecture.net/?p=34456>

Relevant to Linesform: (1) lead with the experience the client gets, not a style; (2) make the
first step feel safe — explain what happens after an enquiry and accept unformed briefs;
(3) structure projects around the question and the reasoning. Not transferable: years in
practice, team size, publications and awards — Linesform has none, and must not imply any.

---

## After implementation

Everything in this section was measured on a local production build of this branch, with the
same scripts and viewports as the "before" evidence. **Nothing here is a conversion result**: the
site has no analytics data and no experiment has been run. Scores are a qualitative re-assessment by
the same reviewer who made the changes, so read them as a checklist of what was addressed rather
than as independent evidence.

### What changed and why

| Area | Change | Problem it answers | Where |
| --- | --- | --- | --- |
| Hero | Headline "Houses and interiors, drawn from the *site*."; a statement naming what is designed and how; "Start a project" (primary) and "See the work" (secondary) in the first row, so both are on the first screen at 390 and 1440 px | Philosophy instead of offer; desktop fold had no explanation or action | `components/home/hero.tsx`, `content/studio.ts` |
| CTA system | One enquiry label, "Start a project", everywhere (was five); one filled button style reserved for it; a compact outlined header button on desktop; a button in the mobile menu; every enquiry link points to the contact section | Browse-first hierarchy, inconsistent labels, enquiry hidden behind "Menu" on mobile | `content/site.ts`, `ui/arrow-link.tsx`, `layout/site-header.tsx`, `layout/mobile-nav.tsx`, `layout/site-footer.tsx`, `assistant/assistant-panel.tsx`, `app/work/page.tsx` |
| Journey bridges | "Have a site or a room in mind?" after the selected work; "The first step is a conversation about your site." with the CTA in the process section; FAQ link renamed | No bridges between sections; enquiry 11.2 mobile screens down | `home/selected-work.tsx`, `home/approach.tsx`, `home/faq-section.tsx` |
| Section order | Hero → Work → Studio → **Light study** → Approach → Client perspectives → Materials → FAQ → Contact | Illustrative statements interrupted the work → studio sequence; process now precedes them | `app/page.tsx` |
| Attention moment | Light study: the Reading Pavilion in afternoon light and at dusk (an exact same-viewpoint pair already in the repository), divided by a line the visitor drags or moves with a labelled slider. Nothing animates on its own | Uniform label → heading → paragraph rhythm; the studio's idea (light first) was only asserted | `home/light-study.tsx` |
| Process transparency | Each step states what is shared with the client ("A written brief and a record of the site", …) | Process was abstract; no "what you receive" | `home/approach.tsx`, `content/studio.ts` |
| Project pages | Case-study frame: *The question* → *Working within* (constraints) → *The response* → gallery → *How it is made* → *Design intent* → a contextual CTA ("Planning a house of your own?") that opens the form with the project type already chosen → next project | No question, constraints or reasoning; single CTA after "Next project" | `app/work/[slug]/page.tsx`, `content/projects.ts` |
| Contact | "Useful to include" list; the brief need not be finished; the concept note moves below the form on small screens so the form is reached sooner | Nothing told visitors how to prepare | `home/contact-section.tsx`, `content/studio.ts` |
| Form | Project type can be pre-selected by `?type=` (validated against the options; the visitor can change it). Delivery honesty unchanged: success is shown only after the server confirms delivery | Context from project pages was lost | `contact/select-field.tsx`, `contact/enquiry-form.tsx`, `lib/enquiry/schema.ts` |
| FAQ | Two objections added: "Do I need a finished brief or drawings first?" and "Is Linesform Studio a real practice?" | Readiness and legitimacy doubts were unanswered | `content/studio.ts` |
| Measurement | `cta_click` (id + location), `enquiry_form_view`, `enquiry_form_start`, all consent-gated and free of personal data; mailto remains `contact_click` | No way to see where intent appears or where the form loses people | `consent/tag-manager.tsx`, `contact/enquiry-form.tsx`, `lib/tracking/*`, [`cro-measurement-plan.md`](./cro-measurement-plan.md) |

Every case-study sentence was written from facts each concept already stated (site, programme,
area, decisions). No client, budget, real location, date or outcome was added.

### Hero options considered

| Headline | Verdict |
| --- | --- |
| **Houses and interiors, drawn from the *site*.** | Chosen: says what is designed and how, in plain words; "site" carries the differentiator. |
| Calm houses and interiors, shaped by their site. | Kept as the A/B variant (outcome-led). |
| Architecture that starts with the site. | Method only — no offer. |
| Design for the way light moves through your home. | Excludes hospitality and public work. |
| Quiet, lasting houses and interiors. | Adjectives any studio could use; nothing to remember. |

| Primary CTA | Verdict |
| --- | --- |
| **Start a project** | Chosen: low commitment, in the visitor's own terms, matches the contact section's label. |
| Book a consultation | Promises a process that has not been confirmed. |
| Request a proposal | Implies a fee or proposal stage that has not been confirmed. |
| Get in touch | Generic; says nothing about what happens. |

Secondary: "See the work", because a first-time visitor who is not ready to enquire needs evidence
first, and browsing is the only other action worth offering above the fold.

### Video

A hero video is not recommended: the static hero is the Largest Contentful Paint element on every
viewport and a video would add weight without adding information. The light study now shows the
studio's idea interactively at no extra download beyond one lazy-loaded image. If the owner ever
has real footage, the best use would be a short, silent daylight time-lapse of one interior, placed
below the fold with a poster image, play/pause controls, no autoplay under reduced motion and no
audio. No video assets were created.

### Measured evidence (after)

| Page | Mobile length | First enquiry link (mobile) | Enquiry links (mobile) | Desktop above-fold |
| --- | --- | --- | --- | --- |
| Home | 17.2 screens (was 15) | **0.6 screens** (was 11.2) | 4 in content + menu + footer | Statement, "Start a project", "See the work", header CTA |
| /work | 4 screens | 2.7 screens | 1 + menu | Header CTA, project rows |
| Project pages (×4) | 8.4–8.6 screens (was 7.5–7.8) | 6.6–6.8 screens (was 6.3–6.5) | 1 + menu | Header CTA |

- Enquiry labels in use: **1** ("Start a project"), was 5. Every enquiry link is tagged for
  measurement.
- A project-page CTA opens the form with that project's type chosen — verified for all four.
- On mobile, the "Start a project" button in the menu reaches the contact section from any page in
  two taps.

### Quality checks (after)

| Check | Result |
| --- | --- |
| Typecheck, lint, production build | Pass; home page still fully static |
| axe-core, 12 routes × 2 viewports | 0 violations |
| axe-core, interactive states (consent, FAQ, select, assistant, form errors) | 0 violations |
| Clipping / horizontal overflow, 320–1440 px, 12 routes | 0 issues |
| Interaction suite (consent + GTM, select, FAQ, assistant, tracking) | 128 checks pass |
| CRO feature suite (type preset ×4 projects, light study mouse/keyboard/touch, CTA labels and tagging, mobile menu CTA) | All pass |
| Logo navigation | 30/30 |
| Lighthouse mobile, home | Performance 91 (90–93 before), LCP 3.4 s simulated, CLS 0.001, Accessibility/BP/SEO 100 |
| Lighthouse desktop, home and project pages | 100 / 100 / 100 / 100 |

The touch test found and fixed two real defects before release: a mouse drag on the light study
started the browser's native image drag (cancelling the gesture), and a vertical scroll that began
on the image nudged the line. A touch now moves the line only once it is clearly sideways.

### Scores (after)

| Category | Weight | Before | After | Why it moved (or did not) |
| --- | --- | --- | --- | --- |
| First impression | 5% | 6 | 8 | Offer, method and action on the first screen at both sizes |
| Hero hook & value proposition | 15% | 4 | 7 | Says what and how; still no outcome evidence a real studio could add |
| Differentiation | 10% | 5 | 6 | "From the site" leads and the light study shows it; the idea is not unique in the category |
| Visual design | 5% | 9 | 9 | Unchanged system; one composed moment added |
| Project storytelling | 15% | 6 | 8 | Question → constraints → response → intent; no process drawings or real outcomes exist |
| Trust & credibility | 10% | 5 | 6 | What the client receives at each step; preparation guidance; legitimacy answered openly |
| Social proof | 5% | 2 | 2 | Cannot be improved honestly without real clients |
| CTA hierarchy | 10% | 3 | 8 | One label, one primary style, placed at decision points |
| Enquiry-form usability | 5% | 8 | 9 | Guidance beside the form; type carried from project pages |
| Conversion journey | 10% | 4 | 7 | Bridges after work, process and every project; mobile project pages still end-loaded |
| Mobile conversion | 10% | 4 | 7 | CTA at 0.6 screens and in the menu; home is 15 % longer |

**Weighted CRO readiness: 4.9 → 7.1 / 10** (7.05 before rounding). Visual quality 9/10 and UX
quality 8/10 are unchanged in kind; **measured conversion performance remains unknown**.

### Remaining issues

1. **Mobile project pages** reach their in-content enquiry link only at ~6.7 screens; the menu
   offers it throughout. A sticky mobile CTA was not added (intrusive, unproven) — test it only
   once traffic exists.
2. **Home page length** grew on mobile (15 → 17.2 screens) from the light study, bridges and
   guidance. Each addition answers a finding above, but it is a trade-off to watch with scroll
   depth.
3. **Two identical CTAs above the fold on desktop** (header and hero). They are the same action, not
   competing ones; the header button's value is a candidate test (plan, test 2).
4. **Social proof** stays at 2/10 by design: the statements are illustrative and labelled.
5. **Production delivery** of enquiries is still unverified, and **no analytics** are configured.
6. The **live site is unchanged** until this branch is merged and deployed; the GitHub homepage
   field still points to the non-resolving `linesform-studio.vercel.app`.
7. axe "needs review" items are pre-existing: contrast cannot be computed over the gradient
   underline of nav links, and the closed custom select references its listbox.

### What the owner needs to provide

- **Truthful metrics only if they exist:** completed projects, years in practice, team size,
  publications or awards. Without them, no statistics strip should be added.
- **Real testimonials** with written permission, attributed by first name or role and project type;
  until then the illustrative statements stay labelled as such.
- **Delivery and contact:** an enquiry delivery integration (`ENQUIRY_WEBHOOK_URL`) and, if wanted, a
  public contact email (`CONTACT_EMAIL`).
- **Process facts:** whether a first conversation is free, how long a reply usually takes, fee
  basis and service area — the site states none of these until they are confirmed.
- **Analytics:** a GTM container and GA4 property (see `analytics-and-seo.md`).

### Assets that would strengthen the case studies

- Process material per project: a site photograph "before", sketches, a plan, a model photograph.
- A real daylight study (same view, morning / noon / dusk) of a built interior.
- If the studio becomes real: portraits of the people a client would meet.
- Optional: a 10–15 s silent time-lapse of light moving across one room (see "Video").
