import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const TodosPageActions = createActionGroup({
  source: 'Todos Page',
  events: {
    'Load Todos': emptyProps(),
    'Toggle Todo Complete': props<{
      id:number
    }>()
  }
});

export const TodosApiActions = createActionGroup({
  source: 'Todos API',
  events: {
    'Load Todos Success': props<{
      todos: ReadonlyArray<Todo>
    }>(),
    'Load Todos Error': props<{
      error:string
    }>()
  }
});