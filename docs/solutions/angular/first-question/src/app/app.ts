import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from "@angular/core";
import { PessoaService } from "./features/pessoa/services/pessoa.service";
import { combineLatest, map, Subscription, switchMap } from "rxjs";
import { DebounceSearch } from "./features/debounce-search/components/debounce-search/debounce-search";

@Component({
  selector: 'app-root',
  providers: [PessoaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-debounce-search></app-debounce-search>`,
  imports: [DebounceSearch],
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