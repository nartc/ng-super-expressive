import { signal } from '@angular/core';
import { createInjectionToken } from 'ngxtension/create-injection-token';

export const [injectOutput, provideOutput] = createInjectionToken(
	() => signal<RegExp | null>(null),
	{ isRoot: false },
);
