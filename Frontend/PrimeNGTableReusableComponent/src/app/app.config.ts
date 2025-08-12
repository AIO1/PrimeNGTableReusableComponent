import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { Preset } from './themes/preset';
import { MessageService } from 'primeng/api';
import { SharedService } from './core/services/shared.service';
import { ECSPrimengTableHttpService, ECSPrimengTableNotificationService } from 'ecs-primeng-table';
import { NotificationService } from './core/services/notification.service';
import { HttpService } from './core/services/http.service';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
          preset: Preset,
          options: {
            darkModeSelector: false || 'none'
          }
        },
        ripple: true
      }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    MessageService,
    SharedService,
    { provide: ECSPrimengTableNotificationService, useClass: NotificationService },
    { provide: ECSPrimengTableHttpService, useClass: HttpService },
  ]
};