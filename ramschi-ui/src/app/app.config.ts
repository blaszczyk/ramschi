import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { handleHttpError } from './ramschi/http-error-interceptor';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([handleHttpError()])),
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6Ldvbz4rAAAAAD0o0n1e0PVsvfkPwr3HaSeA6FIu',
    },
  ],
};
