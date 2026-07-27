# Respostas do Desafio Front-end Attus

## 1. TypeScript e Qualidade de Código

### 1.1. Refatoração

As principais melhorias aplicadas ao código original são:

- Remoção de `any`, usando tipagem explícita.
- Uso de propriedades `readonly` para dados que não devem ser reatribuídos.
- Uso de `find` no lugar de laços manuais.
- Comparação estrita por tipo.
- Tratamento para produto não encontrado.
- Retorno booleano direto em `hasEstoqueProduto`.
- Uso de template string para melhorar legibilidade.

```typescript
class Produto {
  constructor(
    public readonly id: number,
    public readonly descricao: string,
    public quantidadeEstoque: number
  ) {}
}

class Verdureira {
  readonly produtos: Produto[] = [
    new Produto(1, 'Maçã', 20),
    new Produto(2, 'Laranja', 0),
    new Produto(3, 'Limão', 20),
  ];

  getDescricaoProduto(produtoId: number): string {
    const produto = this.produtos.find((p) => p.id === produtoId);

    return produto
      ? `${produto.id} - ${produto.descricao} (${produto.quantidadeEstoque}x)`
      : 'Produto não encontrado';
  }

  hasEstoqueProduto(produtoId: number): boolean {
    const produto = this.produtos.find((p) => p.id === produtoId);

    return Boolean(produto && produto.quantidadeEstoque > 0);
  }
}
```

### 1.2. Generics e Tipos Utilitários

A função `filtrarEPaginar<T>` recebe uma lista genérica, aplica o filtro informado e retorna apenas os itens da página atual, além do total de registros filtrados.

```typescript
class PaginaParams {
  constructor(
    public readonly pagina: number,
    public readonly tamanho: number
  ) {}
}

class Pagina<T> {
  constructor(
    public readonly itens: T[],
    public readonly totalRegistros: number
  ) {}
}

function filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams
): Pagina<T> {
  const dadosFiltrados = data.filter(filterFn);
  const inicio = (params.pagina - 1) * params.tamanho;
  const fim = inicio + params.tamanho;

  return new Pagina(
    dadosFiltrados.slice(inicio, fim),
    dadosFiltrados.length
  );
}

interface Usuario {
  readonly id: number;
  readonly nome: string;
}

const usuarios: Usuario[] = [
  { id: 1, nome: 'Ana' },
  { id: 2, nome: 'Maria' },
  { id: 3, nome: 'Marcos' },
  { id: 4, nome: 'João' },
];

const resultado = filtrarEPaginar(
  usuarios,
  (usuario) => usuario.nome.toLowerCase().includes('mar'),
  new PaginaParams(1, 10)
);

console.log(resultado.itens);
console.log(resultado.totalRegistros);
```

## 2. Angular, Fundamentos e Reatividade

### 2.1. Change Detection e OnPush

O problema ocorre porque o componente usa `ChangeDetectionStrategy.OnPush` e a propriedade `texto` é alterada dentro de um `subscribe`. Como a atualização acontece de forma assíncrona e a propriedade é um campo comum da classe, o Angular pode não marcar o componente para nova verificação.

Uma correção adequada, sem alterar a estratégia, sem modificar o service e sem remover o `setInterval`, é usar Angular Signals. Ao atualizar o signal com `.set()`, o Angular é notificado da mudança e a tela é atualizada corretamente.

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { delay, of, Subscription } from 'rxjs';

@Injectable()
class PessoaService {
  buscarPorId(id: number) {
    return of({ id, nome: 'João' }).pipe(delay(500));
  }
}

@Component({
  selector: 'app-root',
  providers: [PessoaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ texto() }}</h1>`,
})
export class AppComponent implements OnInit, OnDestroy {
  readonly texto = signal('');
  contador = 0;
  private subscriptionBuscarPessoa?: Subscription;

  constructor(private readonly pessoaService: PessoaService) {}

  ngOnInit(): void {
    this.subscriptionBuscarPessoa = this.pessoaService
      .buscarPorId(1)
      .subscribe((pessoa) => {
        this.texto.set(`Nome: ${pessoa.nome}`);
      });

    setInterval(() => this.contador++, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptionBuscarPessoa?.unsubscribe();
  }
}
```

### 2.2. RxJS: Eliminando Subscriptions Aninhadas

O operador escolhido foi `switchMap`, porque a segunda chamada depende do resultado da primeira. Ele evita `subscribe` dentro de `subscribe`, mantém o fluxo em uma única cadeia RxJS e cancela a requisição anterior caso uma nova execução seja iniciada.

Para evitar memory leaks, a subscription pode ser gerenciada com `takeUntilDestroyed`.

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

ngOnInit(): void {
  const pessoaId = 1;

  this.pessoaService
    .buscarPorId(pessoaId)
    .pipe(
      switchMap((pessoa) =>
        this.pessoaService.buscarQuantidadeFamiliares(pessoaId).pipe(
          map((qtd) => `Nome: ${pessoa.nome} | familiares: ${qtd}`)
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((texto) => {
      this.texto = texto;
    });
}
```

### 2.3. RxJS: Busca com Debounce

A implementação usa `debounceTime(500)` para aguardar o usuário parar de digitar antes de buscar, `switchMap` para cancelar a requisição anterior e `takeUntilDestroyed` para evitar vazamento de memória. O template consome os estados com `async pipe`.

```typescript
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  delay,
  finalize,
  Observable,
  of,
} from 'rxjs';

export interface Pessoa {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class DebounceSearchService {
  private readonly data: Pessoa[] = [
    { id: 1, name: 'Igor' },
    { id: 2, name: 'Maria' },
    { id: 3, name: 'João' },
    { id: 4, name: 'Ana' },
  ];

  private readonly pessoasSubject = new BehaviorSubject<Pessoa[]>([]);
  private readonly loadingSubject = new BehaviorSubject(false);
  private readonly errorSubject = new BehaviorSubject(false);

  readonly pessoas$ = this.pessoasSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  search(search: string): Observable<Pessoa[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(false);

    return this.getSmartSearchValues(search).pipe(
      finalize(() => this.loadingSubject.next(false)),
      catchError(() => {
        this.errorSubject.next(true);
        return of([]);
      })
    );
  }

  updateResult(result: Pessoa[]): void {
    this.pessoasSubject.next(result);
  }

  reset(): void {
    this.pessoasSubject.next([]);
    this.errorSubject.next(false);
  }

  private getSmartSearchValues(search: string): Observable<Pessoa[]> {
    const filteredData = this.data.filter((pessoa) =>
      pessoa.name.toLowerCase().includes(search.toLowerCase())
    );

    return of(filteredData).pipe(delay(500));
  }
}
```

```typescript
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-debounce-search',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './debounce-search.html',
})
export class DebounceSearchComponent {
  private readonly service = inject(DebounceSearchService);

  readonly searchControl = new FormControl('');
  readonly pessoas$ = this.service.pessoas$;
  readonly loading$ = this.service.loading$;
  readonly error$ = this.service.error$;

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          if (!value) {
            this.service.reset();
          }
        }),
        filter((value): value is string => Boolean(value)),
        switchMap((value) => this.service.search(value)),
        takeUntilDestroyed()
      )
      .subscribe((result) => {
        this.service.updateResult(result);
      });
  }
}
```

```html
<input [formControl]="searchControl" placeholder="Buscar..." />

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Nome</th>
    </tr>
  </thead>

  <tbody>
    @if (loading$ | async) {
      <tr>
        <td colspan="2">Carregando...</td>
      </tr>
    } @else if (error$ | async) {
      <tr>
        <td colspan="2">Erro ao carregar dados</td>
      </tr>
    } @else {
      @for (item of pessoas$ | async; track item.id) {
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
        </tr>
      }
    }
  </tbody>
</table>
```

### 2.4. Performance: OnPush e TrackBy

O `trackBy`, ou `track` no novo control flow com `@for`, melhora a performance porque permite que o Angular identifique cada item por uma chave estável. Assim, quando a lista muda, ele não precisa recriar todos os elementos do DOM; ele atualiza somente os itens realmente alterados.

```html
@for (usuario of usuarios; track usuario.id) {
  <p>{{ usuario.nome }}</p>
}
```

Com `ChangeDetectionStrategy.OnPush`, o Angular reduz verificações desnecessárias, pois o componente é checado principalmente quando recebe novos inputs, quando ocorre um evento no próprio componente, quando um signal usado no template muda ou quando uma emissão assíncrona observada pelo template acontece.

Com a estratégia `Default`, o Angular executa checagens mais amplas na árvore de componentes sempre que há eventos assíncronos na aplicação. Em telas com muitos componentes ou listas grandes, isso pode gerar mais processamento e piorar a fluidez da interface.

## 3. Gerenciamento de Estado

### 3.1. Angular Signals: Estado Local

O componente abaixo usa exclusivamente Signals para armazenar os itens do carrinho, calcular o total, adicionar/remover itens e emitir um `output()` sempre que o total mudar.

```typescript
import {
  Component,
  computed,
  effect,
  output,
  signal,
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

    <p>Total: {{ total() }}</p>

    @for (item of listaItens(); track item.id) {
      <div>
        {{ item.descricao }}
        Quantidade: {{ item.quantidade }}
        Preço: {{ item.preco }}

        <button type="button" (click)="removeItem(item.id)">
          Remover
        </button>
      </div>
    }

    <button
      type="button"
      (click)="addItem({
        id: 1,
        descricao: 'Produto',
        quantidade: 1,
        preco: 10
      })"
    >
      Adicionar item
    </button>
  `,
})
export class ContadorItemsCarrinhoComponent {
  readonly listaItens = signal<ItemCarrinho[]>([]);

  readonly total = computed(() =>
    this.listaItens().reduce(
      (acc, item) => acc + item.quantidade * item.preco,
      0
    )
  );

  readonly totalChange = output<number>();

  constructor() {
    effect(() => {
      this.totalChange.emit(this.total());
    });
  }

  addItem(item: ItemCarrinho): void {
    this.listaItens.update((itens) => {
      const existente = itens.find((i) => i.id === item.id);

      if (existente) {
        return itens.map((i) =>
          i.id === item.id
            ? { ...i, quantidade: i.quantidade + item.quantidade }
            : i
        );
      }

      return [...itens, item];
    });
  }

  removeItem(itemId: number): void {
    this.listaItens.update((itens) =>
      itens
        .map((item) =>
          item.id === itemId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }
}
```

### 3.2. Gerenciamento de Estado com NgRx: Feature To-do

A feature To-do foi estruturada com actions, reducer, selectors, effect e service, mantendo o estado fortemente tipado.

```typescript
export interface Todo {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}
```

```typescript
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const TodosPageActions = createActionGroup({
  source: 'Todos Page',
  events: {
    'Load Todos': emptyProps(),
    'Toggle Todo Complete': props<{ id: number }>(),
  },
});

export const TodosApiActions = createActionGroup({
  source: 'Todos API',
  events: {
    'Load Todos Success': props<{ todos: ReadonlyArray<Todo> }>(),
    'Load Todos Error': props<{ error: string }>(),
  },
});
```

```typescript
import { createFeature, createReducer, on } from '@ngrx/store';

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
  on(TodosPageActions.loadTodos, (state): TodoState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodosApiActions.loadTodosSuccess, (state, { todos }): TodoState => ({
    ...state,
    todos,
    loading: false,
    error: null,
  })),
  on(TodosApiActions.loadTodosError, (state, { error }): TodoState => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodosPageActions.toggleTodoComplete, (state, { id }): TodoState => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  }))
);

export const todosFeature = createFeature({
  name: 'todos',
  reducer: todosReducer,
});
```

```typescript
import { createSelector } from '@ngrx/store';

export const selectAllTodos = todosFeature.selectTodos;

export const selectPendingTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter((todo) => !todo.completed)
);

export const selectError = todosFeature.selectError;
export const selectLoading = todosFeature.selectLoading;
```

```typescript
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, catchError, exhaustMap, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodosApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.exemplo.com/todos';

  getTodos(): Observable<ReadonlyArray<Todo>> {
    return this.http.get<ReadonlyArray<Todo>>(this.apiUrl);
  }
}

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
          map((todos) => TodosApiActions.loadTodosSuccess({ todos })),
          catchError((error: unknown) =>
            of(TodosApiActions.loadTodosError({
              error: getErrorMessage(error),
            }))
          )
        )
      )
    ),
  { functional: true }
);
```

O `exhaustMap` foi usado no effect para evitar requisições concorrentes caso o usuário dispare o carregamento várias vezes antes da chamada anterior terminar.

## 4. Desafio Prático: Aplicação Angular

A aplicação prática foi implementada como um workspace Nx com Angular, Angular Material, RxJS, Signal Store do NgRx e testes com Vitest.

### Funcionalidades Implementadas

- Listagem de usuários em cards com nome, e-mail e ação de editar.
- Filtro por nome com debounce de 300 ms.
- Estado de loading durante carregamento.
- Mensagem de erro em caso de falha na API.
- API mockada com JSON Server usando `db.json`.
- Modal para cadastro e edição de usuário com Angular Material Dialog.
- Formulário com campos de nome, e-mail, CPF, telefone e tipo de telefone.
- Validações obrigatórias e validações de formato para e-mail, CPF e telefone.
- Botão de salvar desabilitado enquanto o formulário está inválido.
- Preenchimento automático do formulário no modo edição.
- Paginação na listagem.
- Feedback visual com snackbar ao salvar usuário.

### Arquitetura

O projeto foi separado em bibliotecas Nx:

- `apps/users-app`: aplicação Angular principal.
- `libs/users/feature-users`: componentes de tela, cards e modal de formulário.
- `libs/users/data-access-users`: modelos, service HTTP e store de usuários.

### Gerenciamento de Estado

O estado da listagem foi implementado com `@ngrx/signals`, usando `signalStore`, `withState`, `withComputed`, `withMethods` e `rxMethod`.

O store controla:

- `users`
- `loading`
- `saving`
- `error`
- `feedback`
- `searchTerm`
- `pageIndex`
- `pageSize`

Também foram criados computeds para:

- `filteredUsers`
- `totalUsers`
- `totalFilteredUsers`
- `paginatedUsers`

### Uso de RxJS

A aplicação usa operadores RxJS em fluxos reais, incluindo:

- `debounceTime(300)`: atraso no filtro por nome.
- `distinctUntilChanged()`: evita repetir buscas com o mesmo termo.
- `switchMap()`: carrega usuários cancelando fluxo anterior quando necessário.
- `exhaustMap()`: evita salvamentos concorrentes.
- `catchError()`: trata falhas de carregamento e salvamento.
- `filter()`: valida retorno do modal antes de salvar.
- `takeUntilDestroyed()`: evita memory leaks.

### Integração com API

O service `UsersApiService` usa `HttpClient` e uma URL configurada por `InjectionToken`:

```typescript
export const USERS_API_URL = new InjectionToken<string>('USERS_API_URL', {
  factory: () => 'http://localhost:3000/users',
});
```

Métodos implementados:

- `getAll()`
- `create(payload)`
- `update(id, payload)`

### Formulário

O formulário do modal usa Angular Signal Forms com `form`, `FormField`, validators nativos e validators customizados.

Validações usadas:

- `required`
- `email`
- `minLength`
- `maxLength`
- `cpfValidator`
- `phoneValidator`

O formulário é inicializado com valores padrão e, no modo edição, recebe os dados do usuário selecionado.

### Testes

O projeto utiliza Vitest, com testes para componentes, services, validators e store. O script de cobertura disponível é:

```bash
npm run test:coverage
```

A meta do desafio é manter cobertura acima de 60%.

### Como Executar

Instalar dependências:

```bash
npm install
```

Subir a API mockada:

```bash
npm run api
```

Executar a aplicação:

```bash
npm start
```

Executar testes:

```bash
npm test
```

Gerar cobertura:

```bash
npm run test:coverage
```

Gerar build de produção:

```bash
npm run build
```
