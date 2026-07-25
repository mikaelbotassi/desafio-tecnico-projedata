/*O componente abaixo utiliza `ChangeDetectionStrategy.OnPush`, porém o nome não é exibido na tela.

Identifique o problema, explique o motivo e proponha uma correção **sem**:

- alterar a estratégia;
- modificar o `PessoaService`;
- remover o `setInterval`.

```ts
*/
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
