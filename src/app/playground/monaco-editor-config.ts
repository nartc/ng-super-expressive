import { NGX_MONACO_EDITOR_CONFIG, type NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';

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

export function provideNgxMonacoEditorConfig() {
	return { provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoEditorConfig };
}
