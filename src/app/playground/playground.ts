import { DOCUMENT } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	ViewChild,
	inject,
} from '@angular/core';
import type { editor } from 'monaco-editor';
import { Editor } from './editor/editor';
import { Footer } from './footer/footer';
import { provideNgxMonacoEditorConfig } from './monaco-editor-config';
import { Nav } from './nav/nav';
import { injectOutput, provideOutput } from './output';
import { Result } from './result/result';

// @ts-expect-error
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

	@ViewChild('vimStatusBar', { static: true }) vimStatusBarDiv!: ElementRef<HTMLDivElement>;

	protected onEditorInit = (editor: editor.IStandaloneCodeEditor) => {
		const { monaco } = this.window;

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

		let vimMode: { dispose: () => void } | null = null;
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
					vimMode = monacoVim.initVimMode(editor, this.vimStatusBarDiv.nativeElement);
					editor.updateOptions({ lineNumbers: 'relative' });
				}
			},
		});

		this.destroyRef.onDestroy(() => {
			action.dispose();
			vimAction.dispose();
		});
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

		if (!value.includes('toRegex')) {
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
