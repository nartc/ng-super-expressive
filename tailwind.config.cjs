const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			sans: ['Inter', ...fontFamily.sans],
			mono: ['Geist Mono', ...fontFamily.mono],
		},
		extend: {
			colors: {
				primary: {
					DEFAULT: colors.yellow['700'],
					dark: colors.yellow['400'],
				},
				secondary: {
					DEFAULT: colors.purple['700'],
					dark: colors.purple['400'],
				},
				mark: {
					DEFAULT: colors.yellow['300'],
					dark: colors.purple['600'],
				},
				background: {
					DEFAULT: colors.gray['100'],
					dark: colors.gray['800'],
				},
			},
		},
	},
	plugins: [],
};
