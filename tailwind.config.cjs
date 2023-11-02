const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	theme: {
		fontFamily: {
			sans: ['Inter', ...fontFamily.sans],
			mono: ['Geist Mono', ...fontFamily.mono],
		},
		extend: {
			colors: {
				primary: colors.yellow['400'],
				secondary: colors.purple['400'],
				background: colors.gray['800'],
			},
		},
	},
	plugins: [],
};
