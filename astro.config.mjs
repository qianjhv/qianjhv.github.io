import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon()],
  markdown: {
    // gfm: false,
    shikiConfig: {
      themes: {
        dark: 'one-dark-pro',
        light: 'one-light',
      },
      defaultColor: 'false',
      cssVariablePrefix: '--_s-',
    }
  },
});