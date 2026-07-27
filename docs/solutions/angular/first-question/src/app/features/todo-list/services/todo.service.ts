import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Todo } from '../models/todo.model';


@Injectable({providedIn: 'root'})
export class TodoService {

  getTodos(): Observable<Todo[]> {
    const todos: Todo[] = [
      {
        id: 1,
        title: 'Estudar Angular',
        completed: false
      },

      {
        id: 2,
        title: 'Implementar NgRx',
        completed: true
      },

      {
        id: 3,
        title: 'Criar testes',
        completed: false
      }

    ];
    return of(todos).pipe(delay(1000));
  }

}