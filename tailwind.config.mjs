/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	plugins: [
		require('@tailwindcss/typography'),
	],
	// presets: [require('./tailwind.presets.js')],
	theme: {
		extend: {
			colors: {
				'zimablue': '#5BC2E7',
				'kleinblue': {
					DEFAULT: '#002FA7',
					500: '#1E40AF',
				}
			}
		},
	},
}

