import { DOCUMENT } from '@angular/common';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';

const monacoEditorConfig = (document: Document) => ({
	onMonacoLoad: () => {
		fetch('https://raw.githubusercontent.com/francisrstokes/super-expressive/master/index.d.ts')
			.then((res) => res.text())
			.then((dts) => {
				const { monaco } = document.defaultView!;
				dts = dts.replace('export = SuperExpressive;', '');
				const libUri = 'ts:filename/super-expressive.d.ts';
				monaco.languages.typescript.typescriptDefaults.addExtraLib(dts, libUri);
				monaco.editor.createModel(dts, 'typescript', monaco.Uri.parse(libUri));
			});
	},
});

export function provideNgxMonacoEditorConfig() {
	return {
		provide: NGX_MONACO_EDITOR_CONFIG,
		useFactory: monacoEditorConfig,
		deps: [DOCUMENT],
	};
}
