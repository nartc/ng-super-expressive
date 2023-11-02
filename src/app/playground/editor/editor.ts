import { Component } from '@angular/core';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
	selector: 'app-playground-editor',
	standalone: true,
	templateUrl: './editor.html',
	host: { class: 'contents' },
	imports: [MonacoEditorModule],
})
export class Editor {
	editorOptions = {
		theme: 'vs-dark',
		language: 'typescript',
		fontSize: 16,
	};

	constructor() {}
}
