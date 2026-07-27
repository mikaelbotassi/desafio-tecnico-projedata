import { createFeature } from '@ngrx/store';
import { todoReducer } from './todo.reducer';

export const todoFeature = createFeature({
  name: 'todos',
  reducer: todoReducer,
});