import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from '../models/todo.model';
import { todoFeature } from './todo.feature';

export const {
  selectTodos,
  selectLoading,
  selectError
} = todoFeature;

export const selectPendingTodos = createSelector(
  selectTodos,
  todos => todos.filter(todo => !todo.completed)
);