import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TodosApiService } from "../services/todo.service";
import { TodosApiActions, TodosPageActions } from "./todo.actions";
import { catchError, exhaustMap, map, of } from "rxjs";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof HttpErrorResponse) {
    if (
      typeof error.error === 'object' &&
      error.error !== null &&
      'message' in error.error
    ) {
      return String(error.error.message);
    }

    return error.message ||
      `Erro HTTP ${error.status}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Não foi possível carregar as tarefas.';
}

export const loadTodosEffect = createEffect((
  actions$ = inject(Actions),
  service = inject(TodosApiService)
) => actions$.pipe(
    ofType(TodosPageActions.loadTodos),
    //Impedir várias requisições concorrentes
    exhaustMap(() => service.getTodos().pipe(
      map((todos) => TodosApiActions.loadTodosSuccess({todos})),
      catchError((error:unknown) => of(TodosApiActions.loadTodosError({
        error: getErrorMessage(error)
      })))
    ))
  ), {functional:true});