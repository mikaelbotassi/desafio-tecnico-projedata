import { createReducer, on } from '@ngrx/store';
import { Todo, TodoState } from '../models/todo.model';

import {
  loadTodos,
  loadTodosSuccess,
  loadTodosError,
  toggleTodoComplete
} from './todo.actions';

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null
};

export const todoReducer = createReducer(
  initialState,
  on(loadTodos, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false
  })),
  on(loadTodosError, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(toggleTodoComplete, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed
          }
        : todo
    )
  }))
);