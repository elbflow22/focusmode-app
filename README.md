# Focus Mode One — Landing

Single-page conversion site served at **focusmode.one**. Static Astro, deployed to GitHub Pages, same hosting model as `focusmode-blog` and `focusmode-legal`.

Job: convert ad/social/organic traffic into App Store / Play Store clicks.

---

## Quick start

```bash
nvm use            # node 22
npm install
npm run dev        # local server
npm run build      # produces ./dist
npm run preview    # serve ./dist
```

## Structure

```
src/
├── consts.ts                   # SITE / ORG / AUTHOR / STORES / APP entities
├── lib/
│   ├── jsonld.ts               # Organization, Person, WebSite, MobileApplication
│   └── url.ts
├── components/
│   ├── BaseHead.astro          # meta, OG, Twitter, font preconnects, PostHog
│   ├── JsonLd.astro
│   ├── PostHog.astro           # analytics + A/B (env-gated, see below)
│   ├── Nav.astro
│   ├── DownloadButtons.astro   # App Store + Play (Play disabled until URL set)
│   └── Footer.astro
├── layouts/BaseLayout.astro
├── pages/
│   ├── index.astro             # the landing — nine sections
│   └── app/index.astro         # /app → / redirect (backwards-compat)
├── styles/global.css           # FM1 dark theme tokens (mirrors blog)
public/
├── robots.txt                  # explicit AI-crawler allow-list
├── CNAME                       # focusmode.one (apex)
├── favicon.svg
└── og/                         # publisher logo + OG default
```

## Editing the landing

Single file: [src/pages/index.astro](src/pages/index.astro). Nine sections, top to bottom:

1. **Hero** — headline, lede, primary CTAs, trust meta-row
2. **Problem** — three numbered pain points (01–03)
3. **Solution** — three dimensions (Quarter / Week / Today)
4. **Rule of Three** — four stat blocks (the constraint thesis)
5. **Features** — eight feature cards
6. **Founder** — narrative + photo
7. **Final CTA** — repeat download buttons + trial info

Section copy is scaffolded — replace with your real systeme copy. Each section is a natural A/B-test slot.

## Download CTAs

`STORES` in `src/consts.ts` drives every button on the page:

```ts
STORES.APP_STORE_URL          // hard-coded for now; replace with real ID
STORES.PLAY_STORE_URL         // null → renders disabled "Coming to Play" pill
STORES.ANDROID_WAITLIST_URL   // where the disabled Play button links
```

When Play launches, set `PLAY_STORE_URL` to the real Play URL. The disabled pill auto-converts to an enabled secondary button. Don't change the components.

## A/B testing + analytics (PostHog)

The PostHog snippet activates when `PUBLIC_POSTHOG_KEY` is set as an env var (locally) or a repo secret (in GitHub Actions).

**Setup:**

1. Create a PostHog project (eu.i.posthog.com recommended for GDPR — Pascal is based in Germany).
2. Copy the project API key.
3. Add it to the repo as an Actions secret: `PUBLIC_POSTHOG_KEY` (and optionally `PUBLIC_POSTHOG_HOST` if not eu).
4. Locally, create `.env`:

   ```
   PUBLIC_POSTHOG_KEY=phc_xxxx
   PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   ```

5. Verify pageviews appear in PostHog → Activity.

**Running an experiment:**

1. PostHog → Experiments → Create. Define variants (e.g. headline-a, headline-b).
2. In the visual editor, target the element to swap and define variant copy. PostHog handles the swap client-side. Expect a brief flash (<100ms on a static page).
3. Define a conversion event. CTA clicks are already tagged via `data-ph-capture-attribute-cta` — they appear in autocapture as `cta=hero-ios`, `cta=final-ios`, etc.
4. Ship. PostHog calculates significance.

CTA tagging map (already wired):

| Location | Property |
| --- | --- |
| Nav `Download` button | `cta=nav-ios` |
| Hero App Store button | `cta=hero-ios` |
| Hero Play button (when live) | `cta=hero-android` |
| Hero Play waitlist (when Play disabled) | `cta=hero-android-waitlist` |
| Final-section equivalents | `cta=final-*` |

## Deployment

Same model as the blog:

1. Push to `main` → GitHub Actions builds and deploys.
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. **DNS for apex** (`focusmode.one`): replace existing systeme.io records with four A records pointing at GitHub Pages:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
   
   Also add a `CNAME` record `www` → `<github-user>.github.io` so the `www.` form auto-redirects to apex.
4. The `CNAME` file in `public/` is already set to `focusmode.one`.
5. Enable HTTPS once the cert provisions (~minutes after DNS resolves).

## What's deliberately out of scope (v1)

- **Real copy.** Each section is scaffolded; paste in your real systeme copy.
- **Founder photo.** Drop `public/founder.jpg` (square, 480×480+ recommended). Image referenced by `<img src="/founder.jpg">` in the Founder section.
- **OG images.** Drop `og/fm1-logo.png` (publisher logo for Organization JSON-LD) and `og/default.png` (1200×630 OG fallback).
- **DE locale.** Current systeme page has DE/EN. v1 ships EN only; add `/de/` route if/when DE copy is needed.
- **Email capture.** No newsletter form on landing — apartheid from blog (which has RSS but no capture either). Add later if needed.
- **`sameAs` URLs** in `src/consts.ts` — fill in once App Store, LinkedIn, X, blog URLs exist publicly. Strengthens the entity graph linking landing ↔ blog ↔ legal.

## Maintenance

- **AI-crawler list in `robots.txt`** — review every few months.
- **Brand drift** — palette and type stack mirror `focusmode-blog/src/styles/global.css`. If one moves, move both.
- **MobileApplication schema** — when Play launches, update `APP.operatingSystem` in `src/consts.ts` from `'iOS'` to `'iOS, Android'`, and set `STORES.PLAY_STORE_URL`.
