import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon()],
  markdown: {
    // gfm: false,
    shikiConfig: {
      theme: 'one-dark-pro',
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro'
      },
    }
  },
});