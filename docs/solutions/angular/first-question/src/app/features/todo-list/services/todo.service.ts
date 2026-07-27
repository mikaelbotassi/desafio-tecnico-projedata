import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodosApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.exemplo.com/todos';

  getTodos(): Observable<ReadonlyArray<Todo>> {
    return this.http.get<ReadonlyArray<Todo>>(
      this.apiUrl
    );
  }

  getTodosMock(): Observable<ReadonlyArray<Todo>> {
    return of(todosMock).pipe(
      delay(800),
    );
  }
  
}

const todosMock: ReadonlyArray<Todo> = [
    {
      id: 1,
      title: 'Configurar o NgRx Store',
      completed: true,
    },
    {
      id: 2,
      title: 'Criar as actions da feature To-do',
      completed: true,
    },
    {
      id: 3,
      title: 'Implementar o reducer',
      completed: false,
    },
    {
      id: 4,
      title: 'Criar os selectors',
      completed: false,
    },
    {
      id: 5,
      title: 'Implementar o effect de carregamento',
      completed: false,
    },
    {
      id: 6,
      title: 'Integrar o componente com o Store',
      completed: false,
    },
    {
      id: 7,
      title: 'Validar o fluxo no Redux DevTools',
      completed: false,
    },
  ];