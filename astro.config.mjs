import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// site URL is duplicated in src/consts.ts. Keep both in sync.
export default defineConfig({
  site: 'https://focusmode.one',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
