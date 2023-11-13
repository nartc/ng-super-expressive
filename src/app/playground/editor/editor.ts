import { Component, Input, signal } from '@angular/core';
import type { editor } from 'monaco-editor';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { injectTheme } from '../../di/theme';

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

	private theme = injectTheme();

	protected editorOptions: editor.IStandaloneEditorConstructionOptions = {
		theme: `vs-${this.theme.computedTheme()}`,
		language: 'typescript',
		fontFamily: 'Geist Mono',
		fontSize: 16,
		formatOnType: true,
		formatOnPaste: true,
		autoDetectHighContrast: true,
		minimap: {
			enabled: false,
		},
	};
	protected isInit = signal(false);

	protected onMonacoEditorInit(editor: editor.IStandaloneCodeEditor) {
		this.isInit.set(true);
		this.onInit(editor);
		this.theme.registerOnChange((to) => {
			editor.updateOptions({
				theme: `vs-${to}`,
			});
		});
	}
}
