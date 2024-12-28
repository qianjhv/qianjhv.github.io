import type { Config } from 'tailwindcss'

import { nextui } from "@nextui-org/react";
 
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx,md}',
    './src/styles/**/*.css',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
    }
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/typography')({
    // className: "pink",
    }), 
    nextui({
      themes: {
        light: {
          colors: {
            background: "#fafafa",
          },
        },
        dark: {
          colors: {
            background: "#464545",
          },
        },
      }
    }),
  ],
} satisfies Config