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
				'zimablue': '#5BC2E7',
				'kleinblue': {
					DEFAULT: '#002FA7',
					500: '#1E40AF',
				},
				'middark': '#181818',
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						ol: {
							ol: { margin: 0, }
						},
						ul: {
							ul: { margin: 0, },
							p: { margin: 0 }
						},
						li: {
							margin: 0,
						},

					}
				}
			})

		},
	},
}

