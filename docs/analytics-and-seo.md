# Analytics, consent and SEO setup

This guide covers what the code already does, which values the site owner must supply, and the
steps that can only be done in Google Tag Manager, Google Analytics, Google Ads, Meta and Google
Search Console. **Nothing here is live until those dashboards are configured, published and
verified.** No IDs are included in the code.

## 1. Status at a glance

| Area | In the code | Still required from the site owner |
| --- | --- | --- |
| Canonical URLs, sitemap, robots | Done. Generated from `SITE_URL`. | Set `SITE_URL` to the real production origin. |
| Google Tag Manager | Done. Loaded only after consent; exactly once per page. | Create a container and set `NEXT_PUBLIC_GTM_ID`. |
| Consent banner and preferences | Done. Shown only when GTM is configured. | Configure consent settings on each tag (section 4). |
| Consent Mode v2 signals | Done. Defaults to denied, then the visitor's choice. | None in code. Enable "Consent overview" in GTM. |
| GA4 | Not in code — added as a GTM tag. | GA4 property and Measurement ID (`G-…`), GTM tags. |
| Google Ads conversions | Not in code — added as a GTM tag. | Conversion ID (`AW-…`) and label, GTM tag. |
| Meta Pixel | Not in code — added as a GTM tag. | Pixel ID, GTM tags. |
| Search Console | Optional meta tag via `GOOGLE_SITE_VERIFICATION`. | Verify the property and submit the sitemap. |

## 2. Environment variables

All are documented in [`.env.example`](../.env.example). The ones that matter here:

| Variable | Purpose | Required | Public or secret | Where it is set |
| --- | --- | --- | --- | --- |
| `SITE_URL` | Canonical origin for canonical tags, Open Graph, sitemap, robots, structured data | Yes, for production | Public | Hosting provider (build time) |
| `NEXT_PUBLIC_GTM_ID` | GTM container ID (`GTM-XXXXXXX`) | Only to enable tracking | Public (embedded in the page) | Hosting provider (build time) |
| `GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag token | Only for that verification method | Public | Hosting provider (build time) |

Both are read **at build time**: redeploy after changing them. Changing a local `.env.local`
does not change anything inside Google's or Meta's dashboards.

GA4 Measurement IDs, Google Ads conversion IDs/labels and the Meta Pixel ID are **not**
environment variables. They live inside the GTM container, so tags can be changed without a
deployment and no tracking platform is hard-coded in the application.

## 3. How the site talks to GTM

`src/lib/tracking/data-layer.ts` is the only code that writes to `window.dataLayer`, and only
after the visitor has allowed at least one optional category.

Order of operations when consent exists:

1. `gtag('consent', 'default', …)` — every optional type **denied**
   (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`,
   `functionality_storage`, `personalization_storage`); `security_storage` granted.
2. `gtag('consent', 'update', …)` — the visitor's choice:
   *Analytics* → `analytics_storage`; *Marketing* → `ad_storage`, `ad_user_data`, `ad_personalization`.
3. The GTM container script loads (`gtm.js` event). It is inserted once per page view; client-side
   navigation never inserts it again.
4. Events below are pushed as they happen.

Before a choice — or after "Reject optional" — GTM is **not loaded at all** (no request to
Google), so this is effectively *basic* Consent Mode. If a visitor later withdraws a category,
the site pushes a consent update, deletes the first-party tracking cookies (`_ga*`, `_gcl_*`,
`_fbp`, `_fbc`) and reloads the page so no optional tag keeps running.

### Events

| Event | When | Parameters |
| --- | --- | --- |
| `virtual_page_view` | Once per route, including the first page (hash changes are not page views) | `page_path`, `page_location` |
| `contact_click` | A `mailto:` link or a link to the enquiry form is clicked | `link_type`: `email` or `enquiry_form` |
| `enquiry_submit` | The enquiry form passed client-side checks and was submitted — **not** a conversion | `form`: `project_enquiry` |
| `enquiry_sent` | The server confirmed delivery to the enquiry service — the **only** conversion event | `form` |
| `enquiry_not_sent` | The server did not deliver (not configured, or failed) | `form`, `reason`: `unavailable` or `error` |
| `consent_update` | The visitor changed their choice while GTM was loaded | `analytics_consent`, `marketing_consent` |

No event carries names, email addresses, project details, budgets or message text. With the
current configuration (no `ENQUIRY_WEBHOOK_URL`), `enquiry_sent` never fires.

## 4. Configure the GTM container

Create a **Web** container at <https://tagmanager.google.com>, then in its workspace:

**Container settings**
- Admin → Container Settings → enable **Consent overview**.
- Do not add a Consent Management Platform template: the site sends the consent signals itself.

**Variables** (Variables → New → Data Layer Variable): `page_path`, `page_location`, `link_type`,
`form`, `reason`.

**Triggers** (Triggers → New → Custom Event):
- `CE – virtual_page_view` — event name `virtual_page_view`
- `CE – enquiry_sent` — event name `enquiry_sent`
- `CE – contact_click` — event name `contact_click` (optional)

### GA4

1. In Google Analytics create a GA4 property and a **Web data stream**; copy the Measurement ID (`G-…`).
2. In the data stream's **Enhanced measurement** settings, open *Page views* → *Advanced* and
   turn **off** "Page changes based on browser history events". The site sends its own page views;
   leaving this on would count client-side navigations twice.
3. GTM → Tags → New → **Google tag**: Tag ID = `G-…`; configuration parameter
   `send_page_view` = `false`; trigger **Initialization – All Pages**.
   Consent settings: built-in consent checks (`analytics_storage`) — no additional consent needed.
4. GTM → Tags → New → **Google Analytics: GA4 Event**: Measurement ID `G-…`, event name `page_view`,
   parameters `page_location` = `{{page_location}}`, `page_path` = `{{page_path}}`;
   trigger `CE – virtual_page_view`.
5. (Optional) GA4 Event `generate_lead` on trigger `CE – enquiry_sent`, parameter `form` = `{{form}}`;
   mark `generate_lead` as a key event in GA4.

### Google Ads (only if campaigns run)

1. In Google Ads create a **Website** conversion action ("Submit lead form"); note the Conversion
   ID (`AW-…`) and Conversion label.
2. GTM → Tags → **Conversion Linker**, trigger *Initialization – All Pages*.
3. GTM → Tags → **Google Ads Conversion Tracking**: ID and label from step 1; trigger `CE – enquiry_sent`.
   Built-in consent checks (`ad_storage`, `ad_user_data`) apply.

### Meta Pixel

Add it **only** through GTM — never as a separate script in the code — so PageView is not
duplicated.

1. In Meta Events Manager create a Pixel (Data sources → Add → Web) and copy the Pixel ID.
2. GTM → Templates → Search Gallery → add a maintained Meta Pixel template, or use a
   Custom HTML tag with Meta's base code **without** its own `fbq('track', 'PageView')` call.
3. Tag A — Pixel base + `PageView`: trigger `CE – virtual_page_view` (not "All Pages", so the
   first page is counted once and client-side navigations are counted too).
4. Tag B — `Lead` event: trigger `CE – enquiry_sent`.
5. On both tags: Advanced settings → Consent settings → **Require additional consent** → `ad_storage`.
   Meta Pixel does not read Consent Mode on its own; this setting is what stops it without consent.
6. Leave *Automatic advanced matching* **off**: the site deliberately sends no personal data.

Domain verification for Meta (Business settings → Brand safety → Domains) is separate from the
Pixel. Its DNS TXT record or meta tag is not handled by GTM; a meta-tag method would need a code
change similar to `GOOGLE_SITE_VERIFICATION`.

### Test and publish

1. GTM → **Preview** (Tag Assistant) on the deployed site. Accept cookies and check: consent
   default then update, `gtm.js`, one `virtual_page_view` per navigation, tags firing only with
   the matching consent.
2. Reject cookies in a fresh window and confirm no request goes to `googletagmanager.com`.
3. GTM → **Submit** → Publish. Then confirm in GA4 *Realtime*, Google Ads *Tag diagnostics* and
   Meta *Test events*. Tracking is live only after this step.

## 5. Sitemap, robots and canonical URLs

- `/sitemap.xml` lists every public route that exists: `/`, `/work`, the four project pages and
  the five legal/information pages. Studio, Approach, Contact and Questions are sections of the
  homepage (`/#studio` etc.); search engines ignore URL fragments, so they are covered by `/`.
- `/robots.txt` allows everything (including CSS, JS and images) and points to the sitemap.
- The 404 page is `noindex`. No other page sets `noindex`.
- A production build **without** `SITE_URL` (outside Vercel) publishes an empty sitemap, no
  `Sitemap:` line and no canonical tags, and logs a warning — it never publishes `localhost`.
- On Vercel, the project's production domain (`VERCEL_PROJECT_PRODUCTION_URL`) is used when
  `SITE_URL` is not set.

Check after deploying:

```bash
curl -s https://YOUR-DOMAIN/robots.txt
curl -s https://YOUR-DOMAIN/sitemap.xml | grep -o '<loc>[^<]*</loc>'
curl -s https://YOUR-DOMAIN/work | grep -o '<link rel="canonical"[^>]*>'
```

## 6. Google Search Console

Search Console verification tokens and GTM container IDs are different things; one cannot
stand in for the other.

1. Go to <https://search.google.com/search-console> → **Add property**.
2. Choose a method:
   - **Domain property (recommended)** — covers `www`, the bare domain and http/https. Verify
     with the DNS **TXT record** Google shows, at your DNS provider. No code change.
   - **URL-prefix property** — verify with the **HTML tag** method: copy only the `content`
     value of the `<meta name="google-site-verification" …>` tag into `GOOGLE_SITE_VERIFICATION`
     and redeploy. (Verification through a published GTM container is also offered, but only
     works while GTM loads — which on this site is only after consent — so it is not recommended.)
3. Click **Verify**. Keep the TXT record or meta tag in place afterwards.
4. **Sitemaps** → enter `sitemap.xml` → Submit. The status should become *Success* and show 11
   discovered URLs.
5. **URL Inspection** → paste a page URL → *Test live URL* to see how Google renders it, then
   *Request indexing* for important pages. **Pages** (Indexing → Pages) shows what is indexed
   and why other URLs are not.

None of these steps has been carried out for this concept: the site has not been verified,
submitted or indexed.
