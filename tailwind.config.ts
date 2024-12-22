import type { Config } from 'tailwindcss'
 
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx,md}',
    './src/styles/**/*.css',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config