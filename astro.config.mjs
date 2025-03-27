import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
  site: 'https://cemapoedu.ec',
  integrations: [tailwind()],
  output: 'static',
  adapter: vercel({

  }),
});