import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, signal } from '@angular/core';
import { createInjectionToken } from 'ngxtension/create-injection-token';

const availableThemes = ['system', 'light', 'dark'] as const;
export type Theme = (typeof availableThemes)[number];

export const [injectTheme, , , provideThemeInitializer] = createInjectionToken(() => {
	const document = inject(DOCUMENT);
	const window = document.defaultView as typeof globalThis;

	const theme = signal<Theme>(
		(window.localStorage.getItem('ng_expressive_theme') ?? 'system') as Theme,
	);
	const callbacks: Array<(theme: Exclude<Theme, 'system'>) => void> = [];

	const toggleClass = (to: Exclude<Theme, 'system'>) => {
		const from = to === 'light' ? 'dark' : 'light';
		document.documentElement.classList.remove(from);
		document.documentElement.classList.add(to);

		callbacks.forEach((callback) => callback(to));
	};

	effect((onCleanup) => {
		const selectedTheme = theme();
		if (selectedTheme === 'system') {
			const listener = (event: MediaQueryListEvent) => {
				toggleClass(getCurrentPreferredScheme(event));
			};
			const matchMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

			toggleClass(getCurrentPreferredScheme(matchMediaQuery));

			matchMediaQuery.addEventListener('change', listener);
			onCleanup(() => matchMediaQuery.removeEventListener('change', listener));
		} else {
			toggleClass(selectedTheme);
		}

		window.localStorage.setItem('ng_expressive_theme', selectedTheme);
	});

	return {
		theme: theme.asReadonly(),
		computedTheme: computed(() => {
			const currentTheme = theme();
			if (currentTheme === 'system') {
				return getCurrentPreferredScheme();
			}
			return currentTheme;
		}),
		changeTheme: () => {
			// NOTE: just cycle through all available themes for now
			const currentThemeIndex = availableThemes.findIndex((available) => available === theme());
			const nextIndex = (currentThemeIndex + 1) % availableThemes.length;
			theme.set(availableThemes[nextIndex]);
		},
		registerOnChange: callbacks.push.bind(callbacks),
	};
});

function getCurrentPreferredScheme(mediaQuery?: MediaQueryList | MediaQueryListEvent) {
	return (mediaQuery || window.matchMedia('(prefers-color-scheme: dark)')).matches
		? 'dark'
		: 'light';
}
