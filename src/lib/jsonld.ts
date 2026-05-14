// JSON-LD builders. Mirrors focusmode-blog's structure so Organization
// and Person @ids match across properties — that's what lets AI engines
// merge "the app", "the blog", and "the founder" into one knowledge graph.
//
// Each builder runs through a Zod schema before emit; an invalid URL or
// empty required field fails the build.

import { z } from 'astro/zod';
import { SITE, ORG, AUTHOR, APP, STORES } from '~/consts';

const urlSchema = z.string().url();
const nonEmpty = z.string().min(1);

// ---------- Organization ----------

const orgSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('Organization'),
  '@id': urlSchema,
  name: nonEmpty,
  legalName: nonEmpty,
  url: urlSchema,
  logo: urlSchema,
  founder: z.object({ '@id': urlSchema }),
  sameAs: z.array(urlSchema).optional(),
});

export function organizationJsonLd() {
  const obj = {
    '@context': 'https://schema.org' as const,
    '@type': 'Organization' as const,
    '@id': ORG.url + '#organization',
    name: ORG.name,
    legalName: ORG.legalName,
    url: ORG.url,
    logo: ORG.logo,
    founder: { '@id': SITE.url + '/#founder' },
    ...(ORG.sameAs.length ? { sameAs: [...ORG.sameAs] } : {}),
  };
  return orgSchema.parse(obj);
}

// ---------- Person ----------

const personSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('Person'),
  '@id': urlSchema,
  name: nonEmpty,
  jobTitle: nonEmpty,
  url: urlSchema,
  worksFor: z.object({ '@id': urlSchema }),
  sameAs: z.array(urlSchema).optional(),
});

export function personJsonLd() {
  const obj = {
    '@context': 'https://schema.org' as const,
    '@type': 'Person' as const,
    '@id': SITE.url + '/#founder',
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    url: AUTHOR.url,
    worksFor: { '@id': ORG.url + '#organization' },
    ...(AUTHOR.sameAs.length ? { sameAs: [...AUTHOR.sameAs] } : {}),
  };
  return personSchema.parse(obj);
}

// ---------- WebSite ----------

const websiteSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('WebSite'),
  '@id': urlSchema,
  url: urlSchema,
  name: nonEmpty,
  description: nonEmpty,
  publisher: z.object({ '@id': urlSchema }),
  inLanguage: nonEmpty,
});

export function websiteJsonLd() {
  const obj = {
    '@context': 'https://schema.org' as const,
    '@type': 'WebSite' as const,
    '@id': SITE.url + '#website',
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    publisher: { '@id': ORG.url + '#organization' },
    inLanguage: SITE.language,
  };
  return websiteSchema.parse(obj);
}

// ---------- MobileApplication ----------
// Google rich result type for app downloads. Drives the App / store
// rich card. The download link must point at the real store URL once it
// exists — placeholder in STORES.APP_STORE_URL until then.

const appSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('MobileApplication'),
  '@id': urlSchema,
  name: nonEmpty,
  description: nonEmpty,
  url: urlSchema,
  applicationCategory: nonEmpty,
  operatingSystem: nonEmpty,
  downloadUrl: urlSchema,
  installUrl: urlSchema,
  author: z.object({ '@id': urlSchema }),
  publisher: z.object({ '@id': urlSchema }),
  offers: z.object({
    '@type': z.literal('Offer'),
    price: nonEmpty,
    priceCurrency: nonEmpty,
  }),
});

export function mobileAppJsonLd() {
  const obj = {
    '@context': 'https://schema.org' as const,
    '@type': 'MobileApplication' as const,
    '@id': SITE.url + '/#mobileapp',
    name: APP.name,
    description: APP.description,
    url: SITE.url,
    applicationCategory: APP.applicationCategory,
    operatingSystem: APP.operatingSystem,
    downloadUrl: STORES.APP_STORE_URL,
    installUrl: STORES.APP_STORE_URL,
    author: { '@id': SITE.url + '/#founder' },
    publisher: { '@id': ORG.url + '#organization' },
    offers: {
      '@type': 'Offer' as const,
      price: APP.price,
      priceCurrency: APP.priceCurrency,
    },
  };
  return appSchema.parse(obj);
}
