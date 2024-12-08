import {CUSTOMIZE} from "./src/config/app";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    extend: {
      ...CUSTOMIZE,
			screens: {
				"3xl": "1800px",
				"4xl": "1940px",
			},
    },
	},
	plugins: [require("@tailwindcss/container-queries")],
}
