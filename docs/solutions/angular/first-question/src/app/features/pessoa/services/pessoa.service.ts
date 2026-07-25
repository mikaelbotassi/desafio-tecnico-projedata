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
export class PessoaService {

  /** @description Mock de uma busca em API com retorno em 0.5 segundos */
  buscarPorId(id: number) {
    return of({ id, nome: 'João' }).pipe(delay(500));
  }

  buscarQuantidadeFamiliares(id: number) {
    return of(5).pipe(delay(500));
  }

}
