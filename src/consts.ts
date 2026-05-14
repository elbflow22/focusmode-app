// Single source of truth for the landing's identity and external links.
// Mirrors the structure used in focusmode-blog so the entity graph
// (Organization @id, Person @id) is consistent across properties.

export const SITE = {
  url: 'https://focusmode.one',
  title: 'Focus Mode One — one app for your quarter, week, and today',
  description:
    'Focus Mode One wires your 90-day vision to today’s next 90 minutes — the only app where quarterly goals, weekly bridges, and daily tasks live in one connected view. iOS now, Android coming.',
  language: 'en',
  locale: 'en_US',
} as const;

export const ORG = {
  name: 'Focus Mode One',
  legalName: 'Riverland International GmbH',
  url: 'https://focusmode.one',
  logo: 'https://focusmode.one/og/fm1-logo.png',
  // Strengthens entity graph. Fill in once each presence exists.
  sameAs: [
    // 'https://apps.apple.com/app/focus-mode-one/...',
    // 'https://play.google.com/store/apps/details?id=...',
    // 'https://www.linkedin.com/company/focus-mode-one',
    // 'https://x.com/focusmodeone',
    // 'https://blog.focusmode.one',
  ] as string[],
} as const;

export const AUTHOR = {
  name: 'Pascal Weihrauch',
  jobTitle: 'Founder, Focus Mode One',
  email: 'pascal@riverland-int.com',
  url: SITE.url + '/#founder',
  sameAs: [
    // 'https://www.linkedin.com/in/pascal-weihrauch',
  ] as string[],
} as const;

// Download destinations. Replace placeholders when the real URLs exist.
// PLAY_STORE_URL: leave null until Android launches — the download component
// renders a "Coming to Google Play" pill in that case rather than a live link.
export const STORES = {
  APP_STORE_URL: 'https://apps.apple.com/app/focus-mode-one',
  PLAY_STORE_URL: null as string | null,
  ANDROID_WAITLIST_URL: SITE.url + '/#android-waitlist',
} as const;

// The app entity itself — used by MobileApplication / SoftwareApplication
// JSON-LD. Update operatingSystem to 'iOS, Android' once Play launches.
export const APP = {
  name: 'Focus Mode One',
  operatingSystem: 'iOS',
  applicationCategory: 'ProductivityApplication',
  // Pricing model is "freemium with trial" — Schema.org treats free as
  // price '0'. The 7-day trial is described in the offers field.
  price: '0',
  priceCurrency: 'EUR',
  description:
    'One app for your quarter, week, and today. Wires 90-day goals to the next 90 minutes — so your daily tasks always trace back to what actually matters.',
} as const;
