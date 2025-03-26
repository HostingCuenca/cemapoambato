// // astro.config.mjs
// import { defineConfig } from 'astro/config';
// import tailwind from '@astrojs/tailwind';
// import vercel from '@astrojs/vercel/serverless';
//
// export default defineConfig({
//   integrations: [tailwind()],
//   output: 'server',
//   adapter: vercel()
// });


import { defineConfig } from 'astro/config';
// Import /serverless for a Serverless SSR site
import tailwind from '@astrojs/tailwind';
import vercelServerless from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: vercelServerless(),
});