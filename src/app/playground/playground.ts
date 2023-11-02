import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import type { editor } from 'monaco-editor';
import { Editor } from './editor/editor';
import { Footer } from './footer/footer';
import { provideNgxMonacoEditorConfig } from './monaco-editor-config';
import { Nav } from './nav/nav';
import { injectOutput, provideOutput } from './output';
import { Result } from './result/result';

@Component({
	standalone: true,
	templateUrl: './playground.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'playground contents' },
	providers: [provideNgxMonacoEditorConfig(), provideOutput()],
	imports: [Nav, Footer, Editor, Result],
})
export default class Playground {
	private destroyRef = inject(DestroyRef);
	private window = inject(DOCUMENT).defaultView!;
	private regexOutput = injectOutput();

	protected onEditorInit = (editor: editor.IStandaloneCodeEditor) => {
		const { monaco } = this.window;

		const initialValue = 'SuperExpressive()';
		editor.setValue(initialValue);
		editor.focus();
		editor.setPosition({ lineNumber: 1, column: initialValue.length + 1 });

		const action = editor.addAction({
			id: 'execute',
			label: 'Execute',
			keybindings: [
				monaco.KeyMod.WinCtrl | monaco.KeyCode.Enter,
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
			],
			contextMenuGroupId: '1_modification',
			contextMenuOrder: 1,
			run: (editor) => {
				this.onExecute(editor.getValue());
			},
		});

		this.destroyRef.onDestroy(action.dispose.bind(action));
	};

	private onExecute(rawValue: string) {
		// NOTE: trim comments
		const value = rawValue
			.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')
			.replace(/\n/g, '')
			.trim();

		if (!value.startsWith('SuperExpressive()')) {
			alert('Snippet must start with SuperExpressive()');
			return;
		}

		if (!value.endsWith('toRegex()') && !value.endsWith('toRegexString()')) {
			alert('Please call toRegex() or toRegexString()');
			return;
		}

		const regexFn = new Function(`return ${value}`);

		try {
			const output = regexFn();
			console.log('[Debug Editor Value] -->', { value, output });
			if (output instanceof RegExp) {
				this.regexOutput.set(output);
			} else {
				this.regexOutput.set(parseRegex(output));
			}
		} catch (e) {
			console.log('there is an error', e);
		}
	}
}

/**
 * From https://github.com/IonicaBizau/regex-parser.js/blob/master/lib/index.js
 * @param regexOutput {string}
 */
function parseRegex(regexOutput: string): RegExp {
	if (typeof regexOutput !== 'string') {
		throw new Error('Invalid input. Input must be a string');
	}

	// Parse input
	const m = regexOutput.match(/(\/?)(.+)\1([a-z]*)/i);

	if (m === null) {
		throw new Error('Invalid input. Input must be a valid RegExp');
	}

	// Invalid flags
	if (m[3] && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test(m[3])) {
		return RegExp(regexOutput);
	}

	// Create the regular expression
	return new RegExp(m[2], m[3]);
}
