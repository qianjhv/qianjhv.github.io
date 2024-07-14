/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	plugins: [
		require('@tailwindcss/typography'),
	],
	// presets: [require('./tailwind.presets.js')],
	theme: {
		extend: {
			colors: {
				'zimablue': '#5bc2e7',
				'kleinblue': {
					DEFAULT: '#002FA7',
				}
			}
		},
	},
}

