import { Directive, ElementRef, Input, effect, inject, signal } from '@angular/core';
import { injectOutput } from '../output';

@Directive({ selector: 'div[appPlaygroundHighlight]', standalone: true })
export class Highlight {
	private testString = signal('');
	@Input({ required: true }) set appPlaygroundHighlight(testString: string) {
		this.testString.set(testString);
	}

	private output = injectOutput();

	constructor() {
		const { nativeElement } = inject(ElementRef) as ElementRef<HTMLDivElement>;
		effect(() => {
			const [testString, output] = [this.testString(), this.output()];
			if (!testString || !output) {
				nativeElement.innerHTML = '';
				return;
			}

			let _temp = testString.replace(/\n$/g, '\n\n');
			nativeElement.innerHTML = _temp.replace(
				output,
				'<mark class="bg-secondary text-gray-100">$&</mark>',
			);
		});
	}
}