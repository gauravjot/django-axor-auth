import {CUSTOMIZE} from "./config/app";

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,js,ejs}",
		"./pd-static/**/*.{html,js,ejs}",
		"./content/**/*.{md,mdx}",
		"./public/**/*.{html,js,ejs}",
	],
	darkMode: "selector",
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
};
