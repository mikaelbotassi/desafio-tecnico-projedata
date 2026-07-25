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