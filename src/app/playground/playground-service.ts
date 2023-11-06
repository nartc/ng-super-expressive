import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, signal } from '@angular/core';
import type { editor } from 'monaco-editor';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import { provideNgxMonacoEditorConfig } from './di/monaco-editor-config';
import { injectOutput, provideOutput } from './di/output';

// @ts-expect-error monaco-vim does not have d.ts
import * as monacoVim from 'monaco-vim';

// const initialValue = 'SuperExpressive()';
const initialValue = `SuperExpressive()
    .allowMultipleMatches
    .lineByLine
    .oneOrMore.anyChar
    .anyOf
        .string('.ts')
        .string('.tsx')
    .end()
    .endOfInput
    .toRegex()
`;

export const [injectPlaygroundService, providePlaygroundService] = createInjectionToken(
	() => {
		const destroyRef = inject(DestroyRef);
		const regexpOutput = injectOutput();
		const window = inject(DOCUMENT).defaultView!;

		const vimStatusBarDiv = signal<HTMLDivElement | null>(null);
		let vimMode: { dispose: () => void } | null = null;

		const onExecute = (rawValue: string) => {
			// NOTE: trim comments
			const value = rawValue
				.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')
				.replace(/\n/g, '')
				.trim();

			if (!value.startsWith('SuperExpressive()')) {
				alert('Snippet must start with SuperExpressive()');
				return;
			}

			if (!value.includes('toRegex')) {
				alert('Please call toRegex() or toRegexString()');
				return;
			}

			const regexFn = new Function(`return ${value}`);

			try {
				const output = regexFn();
				console.log('[Debug Editor Value] -->', { value, output });
				regexpOutput.set(parseRegex(output));
			} catch (e) {
				console.log('there is an error', e);
			}
		};

		const onEditorInit = (editor: editor.IStandaloneCodeEditor) => {
			const monaco = window.monaco;

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
					onExecute(editor.getValue());
				},
			});

			const vimAction = editor.addAction({
				id: 'toggle-vim',
				label: 'Toggle VIM mode',
				keybindings: [
					monaco.KeyMod.WinCtrl | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
					monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
				],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 2,
				run: (editor) => {
					if (vimMode) {
						vimMode.dispose();
						vimMode = null;
						editor.updateOptions({ lineNumbers: 'on' });
					} else {
						vimMode = monacoVim.initVimMode(editor, vimStatusBarDiv());
						editor.updateOptions({ lineNumbers: 'relative' });
					}
				},
			});

			destroyRef.onDestroy(() => {
				action.dispose();
				vimAction.dispose();
			});
		};

		return {
			setVimStatusBarDiv: vimStatusBarDiv.set.bind(vimStatusBarDiv),
			onEditorInit,
		};
	},
	{ isRoot: false, extraProviders: [provideOutput(), provideNgxMonacoEditorConfig()] },
);

/**
 * From https://github.com/IonicaBizau/regex-parser.js/blob/master/lib/index.js
 * @param regexOutput {RegExp | string}
 */
function parseRegex(regexOutput: RegExp | string): RegExp {
	if (regexOutput instanceof RegExp) {
		return regexOutput;
	}

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
