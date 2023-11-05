import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, signal } from '@angular/core';
import { injectOutput } from '../di/output';
import { Highlight } from './highlight';

@Component({
	selector: 'app-playground-result',
	standalone: true,
	templateUrl: './result.html',
	host: { class: 'contents' },
	imports: [Highlight, ClipboardModule],
})
export class Result {
	protected output = injectOutput();
	protected input = signal('');

	protected scrollTop = signal(0);
	protected copyText = signal('Copy');

	protected onCopied(didCopy: boolean) {
		if (!didCopy) return;
		this.copyText.set('Copied!');
		setTimeout(() => {
			this.copyText.set('Copy');
		}, 1000);
	}
}
