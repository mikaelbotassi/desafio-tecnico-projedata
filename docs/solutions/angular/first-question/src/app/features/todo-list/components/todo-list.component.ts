import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { Store } from '@ngrx/store';


import {
  selectAllTodos,
  selectPendingTodos,
  selectError,
  selectLoading,
} from '../stores/todo.selectors';

import { TodosPageActions } from '../stores/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
  private readonly store = inject(Store);

  readonly todos =
    this.store.selectSignal(selectAllTodos);

  readonly pendingTodos =
    this.store.selectSignal(selectPendingTodos);

  readonly loading =
    this.store.selectSignal(selectLoading);

  readonly error =
    this.store.selectSignal(selectError);

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.store.dispatch(
      TodosPageActions.loadTodos()
    );
  }

  toggleTodoComplete(id: number): void {
    this.store.dispatch(
      TodosPageActions.toggleTodoComplete({
        id,
      })
    );
  }
}