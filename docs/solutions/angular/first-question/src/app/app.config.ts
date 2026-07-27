import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { todosFeature } from './features/todo-list/stores/todo.reducer';
import { provideEffects } from '@ngrx/effects';
import * as todosEffects from './features/todo-list/stores/todo.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(routes), 
    provideHttpClient(),
    provideStore(),
    provideState(todosFeature),
    provideEffects(todosEffects),
  ],
};
