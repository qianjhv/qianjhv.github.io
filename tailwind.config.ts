import type { Config } from 'tailwindcss'
 
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx,md}',
    './src/styles/**/*.css',
    './src/styles/**/*.scss'
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config