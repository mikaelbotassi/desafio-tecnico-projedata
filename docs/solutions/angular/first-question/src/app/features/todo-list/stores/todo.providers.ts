import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { TodoEffects } from './todo.effects';
import { todoFeature } from './todo.feature';

export const todoProviders = [
  provideState(todoFeature),
  provideEffects(TodoEffects),
];