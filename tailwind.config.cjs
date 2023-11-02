const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	theme: {
		fontFamily: {
			sans: ['Inter', ...fontFamily.sans],
			mono: ['Geist Mono', ...fontFamily.mono],
		},
	},
	plugins: [],
};
