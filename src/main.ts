import { bootstrapApplication } from '@angular/platform-browser';
import SuperExpressive from 'super-expressive';
import { App } from './app/app';
import { appConfig } from './app/app.config';

/**
 * NOTE: assign SuperExpressive on the global object
 * so that it can be executed by the Editor
 */
window.SuperExpressive = SuperExpressive;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
