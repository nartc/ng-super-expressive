import { Component } from '@angular/core';
import { injectTheme } from '../../../theme';

@Component({
	selector: 'app-theme-switcher',
	standalone: true,
	templateUrl: './theme-switcher.html',
	host: {
		class: 'contents cursor-pointer',
		'(click)': 'onClick()',
	},
})
export class ThemeSwitcher {
	protected theme = injectTheme();

	protected onClick() {
		this.theme.changeTheme();
	}
}
