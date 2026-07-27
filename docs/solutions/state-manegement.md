## 3.1. Angular Signals — Estado local

A implementação abaixo utiliza exclusivamente **Angular Signals** para controlar o estado do carrinho.

Foi criado um `signal` para armazenar a lista de itens, um `computed` para calcular automaticamente o valor total do carrinho considerando **quantidade × preço**, métodos para adicionar e remover itens e um `output()` que emite sempre que o valor total sofrer alguma alteração.

### Componente - ContadorItemsCarrinho

```typescript
import { 
  Component, 
  computed, 
  effect, 
  output, 
  signal 
} from '@angular/core';


interface ItemCarrinho {
  id: number;
  descricao: string;
  quantidade: number;
  preco: number;
}


@Component({
  selector: 'app-contador-items-carrinho',
  standalone: true,
  template: `
    <h2>Itens do Carrinho</h2>

    <p>
      Total:
      {{ total() }}
    </p>


    @for(item of listaItens(); track item.id) {

      <div>
        {{ item.descricao }}
        -
        Quantidade: {{ item.quantidade }}
        -
        Preço: {{ item.preco }}

        <button 
          (click)="removeItem(item.id)">
          Remover
        </button>

      </div>

    }


    <button 
      (click)="addItem({
        id: 1,
        descricao: 'Produto',
        quantidade: 1,
        preco: 10
      })">
      Adicionar item
    </button>

  `
})
export class ContadorItemsCarrinho {


  // Signal responsável pelo estado da lista de itens
  listaItens = signal<ItemCarrinho[]>([]);


  // Calcula automaticamente o valor total do carrinho
  total = computed(() =>
    this.listaItens()
      .reduce(
        (acc, item) => 
          acc + (item.quantidade * item.preco),
        0
      )
  );


  // Evento emitido sempre que o total mudar
  onTotalChange = output<number>();


  constructor() {

    effect(() => {
      this.onTotalChange.emit(
        this.total()
      );
    });

  }


  addItem(item: ItemCarrinho): void {

    this.listaItens.update(itens => {

      const existente = itens.find(
        i => i.id === item.id
      );


      if (existente) {

        existente.quantidade += item.quantidade;

        return [...itens];

      }


      return [
        ...itens,
        item
      ];

    });

  }


  removeItem(itemId: number): void {

    this.listaItens.update(itens => {

      const item = itens.find(
        i => i.id === itemId
      );


      if (!item) {
        return itens;
      }


      item.quantidade--;


      if (item.quantidade <= 0) {

        return itens.filter(
          i => i.id !== itemId
        );

      }


      return [...itens];

    });

  }

}

## 3.2. Gerenciamento de Estado com NgRx — Feature To-do

A implementação da feature To-do utiliza a estrutura recomendada do NgRx, separando as responsabilidades entre **actions**, **reducer**, **selectors**, **effects** e **service**.

O estado da lista de tarefas é centralizado no Store, permitindo controlar a lista completa, o carregamento, possíveis erros e a alteração do status de conclusão de cada tarefa.

---

### Model

```typescript
export interface Todo {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}
```

---

### Actions

As actions foram separadas por origem:

- `TodosPageActions`: ações disparadas pela interface.
- `TodosApiActions`: ações relacionadas ao retorno da API.

```typescript
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const TodosPageActions = createActionGroup({
  source: 'Todos Page',
  events: {
    'Load Todos': emptyProps(),
    'Toggle Todo Complete': props<{
      id: number;
    }>(),
  },
});

export const TodosApiActions = createActionGroup({
  source: 'Todos API',
  events: {
    'Load Todos Success': props<{
      todos: ReadonlyArray<Todo>;
    }>(),
    'Load Todos Error': props<{
      error: string;
    }>(),
  },
});
```

Com isso, a feature possui as ações exigidas:

- `loadTodos`
- `loadTodosSuccess`
- `loadTodosError`
- `toggleTodoComplete`

---

### Reducer

O estado foi tipado por meio da interface `TodoState`, garantindo previsibilidade sobre os dados armazenados no Store.

Também foi definido um estado inicial com:

- `todos`: lista de tarefas.
- `loading`: controle de carregamento.
- `error`: mensagem de erro, quando houver.

```typescript
import { createFeature, createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { TodosApiActions, TodosPageActions } from './todo.actions';

export interface TodoState {
  readonly todos: ReadonlyArray<Todo>;
  readonly loading: boolean;
  readonly error: string | null;
}

export const initialTodosState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const todosReducer = createReducer(
  initialTodosState,

  on(
    TodosPageActions.loadTodos,
    (state): TodoState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    TodosApiActions.loadTodosSuccess,
    (state, { todos }): TodoState => ({
      ...state,
      todos,
      loading: false,
      error: null,
    })
  ),

  on(
    TodosApiActions.loadTodosError,
    (state, { error }): TodoState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    TodosPageActions.toggleTodoComplete,
    (state, { id }): TodoState => ({
      ...state,
      error: null,
      loading: false,
      todos: state.todos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      ),
    })
  )
);

export const todosFeature = createFeature({
  name: 'todos',
  reducer: todosReducer,
});
```

A action `toggleTodoComplete` atualiza a tarefa de forma imutável, criando uma nova lista com o item alterado.

---

### Selectors

Os selectors isolam a leitura do estado e evitam que o componente conheça diretamente a estrutura interna do Store.

```typescript
import { createSelector } from '@ngrx/store';
import { todosFeature } from './todo.reducer';

export const selectAllTodos = todosFeature.selectTodos;

export const selectPendingTodos = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => !todo.completed)
);

export const selectError = todosFeature.selectError;

export const selectLoading = todosFeature.selectLoading;
```

Foram criados os seletores solicitados:

- `selectAllTodos`: retorna a lista completa de tarefas.
- `selectPendingTodos`: retorna somente as tarefas ainda não concluídas.

---

### Service

O service utiliza `HttpClient` com uma URL fictícia, conforme solicitado no enunciado.

```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
```

---

### Effect

O effect escuta a action `loadTodos`, chama o service e despacha uma action de sucesso ou erro.

Foi utilizado `exhaustMap` para evitar múltiplas requisições concorrentes caso o usuário dispare o carregamento várias vezes seguidas.

```typescript
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { TodosApiService } from '../services/todo.service';
import { TodosApiActions, TodosPageActions } from './todo.actions';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof HttpErrorResponse) {
    return error.message || `Erro HTTP ${error.status}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Não foi possível carregar as tarefas.';
};

export const loadTodosEffect = createEffect(
  (
    actions$ = inject(Actions),
    service = inject(TodosApiService)
  ) =>
    actions$.pipe(
      ofType(TodosPageActions.loadTodos),
      exhaustMap(() =>
        service.getTodos().pipe(
          map(todos =>
            TodosApiActions.loadTodosSuccess({
              todos,
            })
          ),
          catchError((error: unknown) =>
            of(
              TodosApiActions.loadTodosError({
                error: getErrorMessage(error),
              })
            )
          )
        )
      )
    ),
  {
    functional: true,
  }
);
```

---

### Uso no componente

O componente consome os selectors usando `selectSignal` e dispara actions por meio do `Store`.

```typescript
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

  readonly todos = this.store.selectSignal(selectAllTodos);
  readonly pendingTodos = this.store.selectSignal(selectPendingTodos);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);

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
```
