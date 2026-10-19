import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { PreventDefaultEventPlugin } from './prevent-default-event-plugin.service';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
        {
      provide: EVENT_MANAGER_PLUGINS,
      multi: true,
      useClass: PreventDefaultEventPlugin
    },
     providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind, primeng',
          },
        },
      },
      // unstyled: true
    }),
    provideHttpClient()
  ]
};
