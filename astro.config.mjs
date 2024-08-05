import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind"

import { defineConfig } from 'astro/config'

import icon from "astro-icon"

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    icon(),
    react()
  ],
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