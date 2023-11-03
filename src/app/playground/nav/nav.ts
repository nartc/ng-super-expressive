import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeSwitcher } from './theme-switcher/theme-switcher';

@Component({
	selector: 'app-playground-nav',
	standalone: true,
	templateUrl: './nav.html',
	host: { class: 'contents' },
	imports: [NgOptimizedImage, ThemeSwitcher],
})
export class Nav {}
