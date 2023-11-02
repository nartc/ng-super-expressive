import { Component, Input, signal } from '@angular/core';
import type { editor } from 'monaco-editor';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
	selector: 'app-playground-editor',
	standalone: true,
	templateUrl: './editor.html',
	host: { class: 'contents' },
	styles: `
        .super-expressive-editor,
        .super-expressive-editor ::ng-deep .editor-container {
            @apply h-full;
        }
    `,
	imports: [MonacoEditorModule],
})
export class Editor {
	@Input({ required: true }) onInit!: (editor: editor.IStandaloneCodeEditor) => void;

	protected editorOptions = {
		theme: 'vs-dark',
		language: 'typescript',
		fontSize: 16,
	};
	protected isInit = signal(false);

	protected onMonacoEditorInit(editor: editor.IStandaloneCodeEditor) {
		this.isInit.set(true);
		this.onInit(editor);
	}
}
