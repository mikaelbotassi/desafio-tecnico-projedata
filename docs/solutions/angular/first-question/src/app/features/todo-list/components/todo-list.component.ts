import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';

import * as TodoActions from '../stores/todo.actions';
import * as TodoSelectors from '../stores/todo.selectors';
import { todoProviders } from '../stores/todo.providers';

@Component({
  selector: 'app-todo-list',
  imports: [AsyncPipe],
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent implements OnInit {

  private readonly store = inject(Store);

  readonly todos$ = this.store.select(TodoSelectors.selectTodos);

  readonly pendingTodos$ = this.store.select(TodoSelectors.selectPendingTodos);

  readonly loading$ = this.store.select(TodoSelectors.selectLoading);

  readonly error$ = this.store.select(TodoSelectors.selectError);

  ngOnInit() {
    this.store.dispatch(TodoActions.loadTodos());
  }

  toggleComplete(id: number): void {
    this.store.dispatch(
      TodoActions.toggleTodoComplete({ id })
    );
  }

}