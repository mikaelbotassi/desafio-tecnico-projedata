# Resposta questão 2.1
O problema ocorre porque o componente utiliza ChangeDetectionStrategy.OnPush e a propriedade texto é alterada diretamente dentro do subscribe(). Como o Angular não identifica essa alteração em uma propriedade comum, a tela não é atualizada. A correção aplicada foi utilizar Angular Signals, transformando texto em um signal e atualizando seu valor com .set(). Os Signals notificam automaticamente o Angular sobre mudanças, funcionando corretamente com componentes OnPush. Existem também outras opções disponíveis, mas nesse caso foi utilizada a abordagem com Signals.

# Resposta questão 2.2
Escolhi o `switchMap` porque as chamadas dependem uma da outra: primeiro busco a pessoa e depois busco a quantidade de familiares. Ele permite encadear os Observables sem precisar criar um `subscribe` dentro de outro, deixando o código mais simples e evitando problemas de concorrência, pois cancela a requisição anterior caso uma nova seja iniciada.

Outros operadores também podem ser utilizados em cenários diferentes, mas o `switchMap` é o mais adequado para esse fluxo de chamadas dependentes.

### Código refatorado

```ts
ngOnInit(): void {
  const pessoaId = 1;

  this.pessoaService.buscarPorId(pessoaId)
    .pipe(
      switchMap(pessoa =>
        this.pessoaService.buscarQuantidadeFamiliares(pessoaId)
          .pipe(
            map(qtd => `Nome: ${pessoa.nome} | familiares: ${qtd}`)
          )
      )
    )
    .subscribe(texto => {
      this.texto = texto;
    });
}

## 2.3. RxJS — Busca com debounce

A implementação utiliza `debounceTime` para aguardar 500ms após o usuário parar de digitar antes de realizar a busca, evitando chamadas desnecessárias.

O operador `switchMap` foi utilizado para cancelar automaticamente a requisição anterior caso uma nova pesquisa seja realizada, evitando problemas de concorrência (race condition).

O estado de carregamento, erro e resultado da busca são mantidos no service através de `BehaviorSubject`, enquanto o template utiliza `async pipe` para gerenciar automaticamente as subscriptions.

---

### Service - DebounceSearchService

```typescript
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  delay,
  finalize,
  Observable,
  of
} from 'rxjs';

export interface Pessoa {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DebounceSearchService {

  private readonly data: Pessoa[] = [
    { id: 1, name: 'Igor' },
    { id: 2, name: 'Maria' },
    { id: 3, name: 'João' },
    { id: 4, name: 'Ana' },
  ];


  private readonly pessoasSubject =
    new BehaviorSubject<Pessoa[]>([]);

  private readonly loadingSubject =
    new BehaviorSubject(false);

  private readonly errorSubject =
    new BehaviorSubject(false);


  readonly pessoas$ =
    this.pessoasSubject.asObservable();

  readonly loading$ =
    this.loadingSubject.asObservable();

  readonly error$ =
    this.errorSubject.asObservable();


  search(search: string): Observable<Pessoa[]> {

    this.loadingSubject.next(true);
    this.errorSubject.next(false);

    return this.getSmartSearchValues(search)
      .pipe(

        finalize(() => {
          this.loadingSubject.next(false);
        }),

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

    const filteredData = this.data.filter(pessoa =>
      pessoa.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );


    return of(filteredData).pipe(
      delay(500)
    );
  }

}
```

---

### Component - DebounceSearchComponent

```typescript
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DebounceSearchService } from '../../services/debounce-search.service';


@Component({
  selector: 'app-debounce-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './debounce-search.html'
})
export class DebounceSearch {

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

        tap(value => {
          if (!value) {
            this.service.reset();
          }
        }),

        filter(value => !!value),

        switchMap(value =>
          this.service.search(value!)
        ),

        takeUntilDestroyed()
      )
      .subscribe(result => {
        this.service.updateResult(result);
      });

  }

}
```

---

### Template - debounce-search.html

```html
<input 
  class="form-control"
  [formControl]="searchControl"
  placeholder="Search..."
>


<table class="table">

<thead>
<tr>
    <th>ID</th>
    <th>Nome</th>
</tr>
</thead>


<tbody>

@if (loading$ | async) {

    <tr>
        <td colspan="2">
            Carregando...
        </td>
    </tr>

}
@else if (error$ | async) {

    <tr>
        <td colspan="2">
            Erro ao carregar dados
        </td>
    </tr>

}
@else {

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

### Operadores utilizados

- **debounceTime(500):** aguarda o usuário finalizar a digitação antes de executar a busca.
- **distinctUntilChanged():** evita novas requisições quando o valor digitado não foi alterado.
- **switchMap():** cancela a requisição anterior quando uma nova busca é iniciada, evitando race condition.
- **catchError():** trata erros da requisição sem quebrar o fluxo.
- **finalize():** controla o estado de loading ao finalizar a requisição.
- **takeUntilDestroyed():** garante o encerramento automático da subscription evitando memory leaks.