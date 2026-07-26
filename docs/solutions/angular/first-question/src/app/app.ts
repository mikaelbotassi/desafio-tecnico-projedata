import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from "@angular/core";
import { PessoaService } from "./features/pessoa/services/pessoa.service";
import { map, Subscription, switchMap } from "rxjs";
import { ContadorItemsCarrinho } from "./features/contador-items-carrinho/contador-items-carrinho";

@Component({
  selector: 'app-root',
  providers: [PessoaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-contador-items-carrinho></app-contador-items-carrinho>`,
  imports: [ContadorItemsCarrinho],
})
export class AppComponent implements OnInit, OnDestroy {

  texto = signal('');
  contador = 0;

  subscriptionBuscarPessoa?: Subscription;

  constructor(
    private readonly pessoaService: PessoaService
  ) {}

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
    .subscribe(texto => this.texto.set(texto));
  }

  ngOnDestroy(): void {
    /** ... */
  }

}