import { defineConfig } from 'astro/config';

import purgecss from "astro-purgecss";

// https://astro.build/config
export default defineConfig({
  integrations: [purgecss({
    content: [
      process.cwd() + '/src/**/*.{astro,svelte,vue,react}',
    ],
  })]
});