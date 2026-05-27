import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { SessionContextService } from './core/services/session-context.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [SessionContextService],
      useFactory: (sessionContext: SessionContextService) => () => sessionContext.initialize()
    }
  ]
};
