# 2. Angular — Fundamentos e Reatividade

## 2.1 Change Detection e OnPush

O componente abaixo utiliza `ChangeDetectionStrategy.OnPush`, porém o nome não é exibido na tela.

Identifique o problema, explique o motivo e proponha uma correção **sem**:

- alterar a estratégia;
- modificar o `PessoaService`;
- remover o `setInterval`.

```ts
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  OnDestroy,
  OnInit
} from '@angular/core';

import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
class PessoaService {

  /** @description Mock de uma busca em API com retorno em 0.5 segundos */
  buscarPorId(id: number) {
    return of({ id, nome: 'João' }).pipe(delay(500));
  }

}

@Component({
  selector: 'app-root',
  providers: [PessoaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ texto }}</h1>`,
})
export class AppComponent implements OnInit, OnDestroy {

  texto: string;
  contador = 0;

  subscriptionBuscarPessoa: Subscription;

  constructor(
    private readonly pessoaService: PessoaService
  ) {}

  ngOnInit(): void {

    this.subscriptionBuscarPessoa =
      this.pessoaService.buscarPorId(1).subscribe((pessoa) => {

        this.texto = `Nome: ${pessoa.nome}`;

      });

    setInterval(() => this.contador++, 1000);

  }

  ngOnDestroy(): void {
    /** ... */
  }

}
```

---

## 2.2 RxJS — Eliminando Subscriptions Aninhadas

Refatore o código abaixo eliminando o `subscribe` dentro de `subscribe`.

Utilize operadores RxJS adequados, evite memory leaks e explique brevemente sua escolha.

```ts
ngOnInit(): void {

  const pessoaId = 1;

  this.pessoaService.buscarPorId(pessoaId).subscribe(pessoa => {

    this.pessoaService.buscarQuantidadeFamiliares(pessoaId).subscribe(qtd => {

      this.texto = `Nome: ${pessoa.nome} | familiares: ${qtd}`;

    });

  });

}
```

---

## 2.3 RxJS — Busca com Debounce

Implemente um campo de busca reativo em um componente Angular que:

- Aguarde **500 ms** após o usuário parar de digitar antes de disparar a requisição (`debounce`);
- Cancele a requisição anterior caso o usuário digite novamente (evitando *race condition*);
- Exiba um indicador de loading durante a requisição;
- Gerencie a subscription sem memory leak.

Apresente:

- Serviço;
- Componente;
- Template utilizando `AsyncPipe`.

---

## 2.4 Performance — OnPush e trackBy

Considere uma lista com centenas de itens renderizados com `@for` (`ngFor`).

Explique:

- Por que utilizar `trackBy` melhora a performance e como implementá-lo corretamente;
- Como `ChangeDetectionStrategy.OnPush` reduz ciclos desnecessários de detecção;
- Qual seria o impacto de utilizar a estratégia **Default** nesse cenário.