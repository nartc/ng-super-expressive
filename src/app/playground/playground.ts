import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	standalone: true,
	templateUrl: './playground.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'playground' },
})
export default class Playground {}
