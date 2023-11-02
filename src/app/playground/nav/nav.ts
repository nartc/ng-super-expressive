import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'app-playground-nav',
	standalone: true,
	templateUrl: './nav.html',
	imports: [NgOptimizedImage],
	host: { class: 'contents' },
})
export class Nav {}
