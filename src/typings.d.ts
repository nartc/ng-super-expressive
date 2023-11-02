import type monaco from 'monaco-editor';
import type SuperExpressive from 'super-expressive';

declare global {
	interface Window {
		monaco: typeof monaco;
		SuperExpressive: typeof SuperExpressive;
	}
}
