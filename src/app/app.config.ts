import type { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideThemeInitializer } from './theme';

export const appConfig: ApplicationConfig = {
	providers: [
		provideThemeInitializer(),
		provideRouter([{ path: '', loadComponent: () => import('./playground/playground') }]),
	],
};
