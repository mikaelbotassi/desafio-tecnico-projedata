import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from "@angular/core";
import { PessoaService } from "./features/pessoa/services/pessoa.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  providers: [PessoaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ texto() }}</h1>`,
})
export class AppComponent implements OnInit, OnDestroy {

  texto = signal('');
  contador = 0;

  subscriptionBuscarPessoa?: Subscription;

  constructor(
    private readonly pessoaService: PessoaService
  ) {}

  ngOnInit(): void {

    this.subscriptionBuscarPessoa =
      this.pessoaService.buscarPorId(1).subscribe((pessoa) => {

        this.texto.set(`Nome: ${pessoa.nome}`);

      });

    setInterval(() => this.contador++, 1000);

  }

  ngOnDestroy(): void {
    /** ... */
  }

}