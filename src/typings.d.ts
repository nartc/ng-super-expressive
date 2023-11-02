import type monaco from 'monaco-editor';

declare global {
	interface Window {
		monaco: typeof monaco;
	}
}
