import { createSelector } from "@ngrx/store";
import { todosFeature } from "./todo.reducer";

export const selectAllTodos = todosFeature.selectTodos;
export const selectPendingTodos = createSelector(
  selectAllTodos,
  (todos)=>todos.filter((t)=>!t.completed)
);
export const selectError = todosFeature.selectError
export const selectLoading = todosFeature.selectLoading