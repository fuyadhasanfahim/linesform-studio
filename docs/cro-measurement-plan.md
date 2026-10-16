# Linesform Studio — CRO measurement plan

**Status (16 October 2026):** nothing has been measured. The live site has no GTM container
(`NEXT_PUBLIC_GTM_ID` is not set), so no analytics data exists, and whether enquiry delivery
(`ENQUIRY_WEBHOOK_URL`) is configured on production could not be checked. **No experiment has been
run.** Every test below is a proposal.

## 1. The funnel

```
page view ─▶ cta_click (start_project) ─▶ enquiry_form_view ─▶ enquiry_form_start
          ─▶ enquiry_submit ─▶ enquiry_sent  (the only conversion)
                             └▶ enquiry_not_sent (unavailable | error)
```

| Step | Event | Fires | Parameters |
| --- | --- | --- | --- |
| Arrival | `virtual_page_view` | Once per route | `page_path`, `page_location` |
| Intent | `cta_click` | Each click on a tagged link | `cta_id` (`start_project`, `see_work`, `read_project`), `cta_location` |
| Reached the form | `enquiry_form_view` | Once per page view, when ≥ 25 % of the form is on screen | `form` |
| Began | `enquiry_form_start` | Once per page view, first focus on a field | `form` |
| Submitted | `enquiry_submit` | Form passed client checks — **not** a conversion | `form` |
| Delivered | `enquiry_sent` | Server confirmed delivery — **the conversion** | `form` |
| Not delivered | `enquiry_not_sent` | Server did not deliver | `form`, `reason` |

`cta_location` values: `header`, `mobile_menu`, `hero`, `selected_work`, `light_study`,
`approach`, `faq`, `footer`, `assistant`, `work_index`, `project:<slug>`.

**Rules the implementation follows**
- Nothing is sent before the visitor allows analytics or marketing cookies (`track()` is a no-op
  until GTM is requested).
- No event carries a name, email address, message, budget or the chosen project type.
- Each event has one source: CTA clicks come only from the delegated listener in
  `tag-manager.tsx`; form events only from `enquiry-form.tsx`, guarded by refs so they cannot repeat
  within a page view.
- A conversion is counted only on `enquiry_sent`. Today, without a delivery integration, the form
  truthfully reports that nothing was sent and `enquiry_sent` never fires.

## 2. Metrics

| Metric | Definition | Answers |
| --- | --- | --- |
| CTA rate by location | `cta_click[start_project]` by `cta_location` ÷ page views of that page | Which placements earn the click |
| Form reach | sessions with `enquiry_form_view` ÷ sessions | Does the journey bring people to the form |
| Form start rate | `enquiry_form_start` ÷ `enquiry_form_view` | Does the form invite a start |
| Form completion | `enquiry_submit` ÷ `enquiry_form_start` | Friction inside the form |
| Delivery rate | `enquiry_sent` ÷ `enquiry_submit` | Reliability of the integration |
| Enquiry rate | `enquiry_sent` ÷ sessions | The outcome |
| Lead quality | Owner's rating of each enquiry (fit, scope, readiness) — kept outside analytics | Whether more enquiries are better enquiries |

Consent gating means every rate describes consenting visitors only; report the consent rate next to
any number, and do not extrapolate to all visitors.

## 3. What is possible now, and what needs more

| Now (in the code) | Needs the owner | Needs traffic |
| --- | --- | --- |
| All events above, consent-gated and free of personal data | A GTM container ID and GA4 property (setup in `analytics-and-seo.md`) | Any rate worth acting on |
| Static attributes (`data-cta-id`, `data-cta-location`) on every primary link | An enquiry delivery integration, so `enquiry_sent` can fire | A/B tests (see sample sizes below) |
| Project-type pre-selection from project pages | A decision on lead-quality scoring | Segmenting by device or entry page |
| | GTM's built-in scroll-depth trigger if scroll depth is wanted (no code needed) | |

Before traffic exists, the useful evidence is qualitative: five to eight moderated sessions in which
people who are planning a house or renovation are asked "What does this studio do?", "What would you
do next?" and "What would you send them?" on desktop and mobile.

## 4. Experiment backlog (proposals — none run)

**Sample-size reality.** With an *assumed* (not measured) 2 % hero CTA click rate, detecting a lift
to 3 % at 95 % confidence and 80 % power needs about **3,800 sessions per variant**. For an *assumed*
0.5 % enquiry rate, detecting 0.75 % needs about **15,600 per variant**. A small studio site may
never reach this, so most tests should use the upper-funnel metric and run only once the baseline is
known. Variants should be assigned on the server (e.g. Vercel feature flags) to avoid flicker, and an
`experiment_variant` parameter added to the events above.

| # | Hypothesis | Variant | Primary metric | Guardrail | Evidence needed before calling it |
| --- | --- | --- | --- | --- | --- |
| 1 | Naming the outcome for the client ("calm rooms") earns more starts than naming the method ("drawn from the site") | Headline B: "Calm houses and interiors, shaped by their site." | `cta_click` start_project, `hero` ÷ home sessions | `see_work` clicks from the hero; `enquiry_form_start` rate | Baseline from ≥ 4 weeks; ~3,800 home sessions per arm at the assumed baseline |
| 2 | A persistent header CTA helps visitors who decide mid-page, without cannibalising contextual CTAs | Header CTA hidden (control) vs shown (current) on desktop | `enquiry_form_view` ÷ sessions | `enquiry_form_start` ÷ view (do header arrivals start less often?) | Same as 1; desktop only |
| 3 | Pre-selecting the project type from a project page lowers friction | Plain `/#contact` link vs `/?type=…#contact` (current) | `enquiry_form_start` ÷ `enquiry_form_view` for `project:*` arrivals | `enquiry_submit` ÷ start; owner-reported mismatches between the type and the message | Enough project-page arrivals at the form — likely only after a campaign |
| 4 | The light study builds enough belief in the approach to move people on to the process | Light study removed vs present (current) | `cta_click` start_project at `approach` ÷ home sessions | Largest Contentful Paint and CLS on home; `read_project` clicks | Scroll-depth data to confirm exposure; ~3,800 sessions per arm |
| 5 | Saying what to include raises completion and the quality of what is sent | "Useful to include" list hidden vs shown (current) | `enquiry_submit` ÷ `enquiry_form_start` | Owner's lead-quality rating; `enquiry_form_start` rate | Low-volume metric — a long run, or treat as a qualitative check |
| 6 | The optional budget field deters starts more than it helps qualification | Budget field removed vs present (current) | `enquiry_submit` ÷ `enquiry_form_start` | Lead quality: share of enquiries the owner can assess without a follow-up | As 5 |

**Stop and decide rules.** Fix the sample size before starting; do not stop early on a good day; a
variant that improves the primary metric but worsens its guardrail is not a win. Report results as
"observed difference with interval", never as a claim the site "converts X % better" without that
interval.
