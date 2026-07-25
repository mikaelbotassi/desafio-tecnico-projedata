# 4. Desafio Prático — Aplicação Angular

## Stack obrigatória

- Angular 17+
- Angular Material
- NgRx ou Signals
- RxJS
- Vitest ou Jest

---

## 4.1 O que construir

### Tela de listagem de usuários

Implementar:

- Cards contendo:
  - Nome
  - E-mail
  - Botão de editar
- Filtro por nome com debounce de **300 ms**
- Estado de loading durante o carregamento
- Mensagem de erro em caso de falha

Os dados podem ser obtidos através de:

- JSON Server;
- MSW;
- Array estático em serviço.

---

### Cadastro e edição de usuário (Modal)

Abertura através do botão vermelho da listagem.

Implementar um formulário reativo contendo:

- E-mail *(obrigatório)*
- Nome *(obrigatório)*
- CPF *(obrigatório)*
- Telefone *(obrigatório)*
- Tipo de telefone

Também deve possuir:

- Validação com mensagens de erro por campo;
- Botão Salvar desabilitado enquanto o formulário estiver inválido;
- Preenchimento automático dos campos quando estiver editando um usuário.

---

## 4.2 Requisitos Técnicos

- Utilizar pelo menos **2 operadores RxJS** além de `map` e `tap`, como por exemplo:
  - `switchMap`
  - `forkJoin`
  - `catchError`
  - `debounceTime`
- Componentes Standalone;
- Gerenciamento de subscriptions sem memory leaks utilizando:
  - `takeUntilDestroyed`
  - `take`
  - `AsyncPipe`
  - ou `unsubscribe()` manual no `ngOnDestroy`;
- Cobertura de testes acima de **60%**, preferencialmente com **Vitest** ou **Jest**.

---

## 4.3 Diferenciais (não obrigatórios)

- Nx Monorepo com separação em bibliotecas
  - `feature-users`
  - `data-access-users`
  - `ui`
- Paginação na listagem;
- Validação de formato dos campos:
  - E-mail
  - CPF
  - Telefone
- Melhorias no projeto além do protótipo apresentado.