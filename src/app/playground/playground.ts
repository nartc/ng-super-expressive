import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Editor } from './editor/editor';
import { Footer } from './footer/footer';
import { Nav } from './nav/nav';
import { injectPlaygroundService, providePlaygroundService } from './playground-service';
import { Result } from './result/result';

@Component({
	standalone: true,
	templateUrl: './playground.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'playground contents' },
	providers: [providePlaygroundService()],
	imports: [Nav, Footer, Editor, Result],
})
export default class Playground {
	private service = injectPlaygroundService();

	@ViewChild('vimStatusBar', { static: true }) set vimStatusBarDiv({
		nativeElement,
	}: ElementRef<HTMLDivElement>) {
		this.service.setVimStatusBarDiv(nativeElement);
	}

	protected onEditorInit = this.service.onEditorInit.bind(this.service);
}
