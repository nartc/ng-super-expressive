import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NGX_MONACO_EDITOR_CONFIG, type NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';
import { Editor } from './editor/editor';
import { Footer } from './footer/footer';
import { Nav } from './nav/nav';

const monacoEditorConfig: NgxMonacoEditorConfig = {
	onMonacoLoad: () => {
		fetch('https://raw.githubusercontent.com/francisrstokes/super-expressive/master/index.d.ts')
			.then((res) => res.text())
			.then((dts) => {
				dts = dts.replace('export = SuperExpressive;', '');
				const libUri = 'ts:filename/super-expressive.d.ts';
				window.monaco.languages.typescript.typescriptDefaults.addExtraLib(dts, libUri);
				window.monaco.editor.createModel(dts, 'typescript', window.monaco.Uri.parse(libUri));
			});
	},
};

@Component({
	standalone: true,
	templateUrl: './playground.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'playground contents' },
	providers: [
		{
			provide: NGX_MONACO_EDITOR_CONFIG,
			useValue: monacoEditorConfig,
		},
	],
	imports: [Nav, Footer, Editor],
})
export default class Playground {}
