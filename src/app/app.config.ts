import type { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideThemeInitializer } from './di/theme';

export const appConfig: ApplicationConfig = {
	providers: [
		provideThemeInitializer(),
		provideRouter([{ path: '', loadComponent: () => import('./playground/playground') }]),
	],
};
