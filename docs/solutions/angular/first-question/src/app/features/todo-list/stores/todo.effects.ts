import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadTodos, loadTodosError, loadTodosSuccess } from "./todo.actions";
import { catchError, map, mergeMap, of } from "rxjs";
import { TodoService } from "../services/todo.service";

@Injectable()
export class TodoEffects {

  readonly loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      mergeMap(() =>
        this.todoService.getTodos().pipe(
          map(todos => loadTodosSuccess({ todos })),
          catchError(error =>
            of(loadTodosError({error: error.message}))
          )
        )
      )
    )
  );


  constructor(
    private readonly actions$: Actions,
    private readonly todoService: TodoService
  ) {}

}