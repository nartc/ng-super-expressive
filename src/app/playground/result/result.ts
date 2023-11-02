import { Component, signal } from '@angular/core';
import { injectOutput } from '../output';
import { Highlight } from './highlight';

@Component({
	selector: 'app-playground-result',
	standalone: true,
	templateUrl: './result.html',
	host: { class: 'contents' },
	imports: [Highlight],
})
export class Result {
	protected output = injectOutput();
	protected input = signal('');
	protected scrollTop = signal(0);
}
