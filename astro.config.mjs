import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: vercel(),
  image: {
    service: undefined, // ✅ Forma correcta de deshabilitar imágenes en Astro
  },
  
});
